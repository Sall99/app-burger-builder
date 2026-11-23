import { GoogleGenAI } from '@google/genai'
import { NextRequest, NextResponse } from 'next/server'

import { CREATOR_INFO } from '@/config/creator'
import { withRateLimit } from '@/lib/rate-limit'
import { COMBOS } from '@/types/combos'
import { RESTAURANT_LOCATIONS } from '@/types/locations'
import { LOYALTY_TIERS } from '@/types/loyalty'

export const dynamic = 'force-dynamic'

interface IncomingMessage {
    role: 'user' | 'assistant'
    content: string
}

interface BurgerContext {
    ingredients?: {
        meat?: number
        bacon?: number
        cheese?: number
        salad?: number
    }
    totalPrice?: number
    calories?: number
}

interface SuggestedRecipe {
    name: string
    meat: number
    bacon: number
    cheese: number
    salad: number
}

const RECIPE_REGEX = /<burger_recipe>\s*([\s\S]*?)\s*<\/burger_recipe>/i

// Fastest low-latency models first for snappy chat replies
const FALLBACK_MODELS = [
    'gemini-3.5-flash-lite',
    'gemini-flash-lite-latest',
    'gemini-3.5-flash',
    'gemini-3.6-flash'
]

let cachedClient: { apiKey: string; ai: GoogleGenAI } | null = null

function getAIClient(apiKey: string): GoogleGenAI {
    if (!cachedClient || cachedClient.apiKey !== apiKey) {
        cachedClient = { apiKey, ai: new GoogleGenAI({ apiKey }) }
    }
    return cachedClient.ai
}

function clampIngredient(value: unknown): number {
    const num = Number(value)
    if (!Number.isFinite(num) || num < 0) return 0
    return Math.min(5, Math.round(num))
}

function extractRecipe(rawText: string): { reply: string; recipe: SuggestedRecipe | null } {
    const match = rawText.match(RECIPE_REGEX)
    if (!match) {
        return { reply: rawText.trim(), recipe: null }
    }

    const cleanReply = rawText.replace(RECIPE_REGEX, '').trim()
    try {
        const parsed = JSON.parse(match[1])
        const recipe: SuggestedRecipe = {
            name:
                typeof parsed.name === 'string' && parsed.name.trim()
                    ? parsed.name.trim().slice(0, 48)
                    : 'Spécial Chef Sall',
            meat: clampIngredient(parsed.meat),
            bacon: clampIngredient(parsed.bacon),
            cheese: clampIngredient(parsed.cheese),
            salad: clampIngredient(parsed.salad)
        }
        const totalLayers = recipe.meat + recipe.bacon + recipe.cheese + recipe.salad
        return { reply: cleanReply, recipe: totalLayers > 0 ? recipe : null }
    } catch {
        return { reply: cleanReply, recipe: null }
    }
}

const STATIC_CATALOG_PROMPT = (() => {
    const combosSummary = COMBOS.map(
        (c) =>
            `- ${c.name}: $${c.comboPrice.toFixed(2)} (save $${c.savings.toFixed(2)}, ${c.ingredients.meat}M/${c.ingredients.bacon}B/${c.ingredients.cheese}C/${c.ingredients.salad}S)`
    ).join('\n')

    const locationsSummary = RESTAURANT_LOCATIONS.map(
        (loc) => `- ${loc.name}: ${loc.address}, ${loc.city} (${loc.phone})`
    ).join('\n')

    const tiersSummary = Object.values(LOYALTY_TIERS)
        .map((t) => `${t.name}(${t.minPoints}+pts, ${t.pointsMultiplier}x)`)
        .join(', ')

    return `MENU: Bun $4.00 (base), Meat $1.30, Bacon $0.70, Cheese $0.40, Salad $0.50.
PROMOS: WELCOME10 (10% off, min $10), SAVE5 ($5 off, min $15), BURGER20 (20% off, min $20).
COMBOS:
${combosSummary}
LOYALTY: ${tiersSummary}
LOCATIONS:
${locationsSummary}
CREATOR & CONTACT:
- Burger Builder was created by ${CREATOR_INFO.name} (${CREATOR_INFO.roleEn}).
- If a user asks who created the site, wants to contact the creator, report a bug, or collaborate, always share:
  Name: ${CREATOR_INFO.name}
  Email: ${CREATOR_INFO.email}
  GitHub: ${CREATOR_INFO.github}
FEATURES: Drag & drop layers, Undo/Redo, Saved Templates, Substitutions, Live Nutrition/Allergens, Track Order (/track-order), Order History (/history), Stripe checkout.`
})()

function buildSystemInstruction(locale: string, burgerContext?: BurgerContext): string {
    const currentBurgerLine = burgerContext?.ingredients
        ? `Current burger: meat=${burgerContext.ingredients.meat ?? 0}, bacon=${burgerContext.ingredients.bacon ?? 0}, cheese=${burgerContext.ingredients.cheese ?? 0}, salad=${burgerContext.ingredients.salad ?? 0}, total=$${(burgerContext.totalPrice ?? 4).toFixed(2)}${burgerContext.calories ? `, ${burgerContext.calories} kcal` : ''}.`
        : 'Current burger: empty bun ($4.00).'

    return `You are "Sall" (also called Chef Sall), the fast, friendly AI culinary assistant for Burger Builder.
Reply concisely (2-4 short sentences max) in ${locale === 'fr' ? 'French' : 'English'} (or match user language).
${STATIC_CATALOG_PROMPT}
${currentBurgerLine}
When recommending a burger recipe, append ONE tag at the very end (never mention the tag):
<burger_recipe>{"name":"Recipe Name","meat":2,"bacon":1,"cheese":2,"salad":1}</burger_recipe>
Keys: name, meat, bacon, cheese, salad (integers 0-5).`
}

async function generateWithFallback(
    ai: GoogleGenAI,
    preferredModel: string,
    contents: Array<{ role: string; parts: Array<{ text: string }> }>,
    systemInstruction: string
) {
    const modelsToTry = Array.from(new Set([preferredModel, ...FALLBACK_MODELS]))
    let lastError: any = null

    for (const model of modelsToTry) {
        try {
            const response = await ai.models.generateContent({
                model,
                contents,
                config: {
                    systemInstruction,
                    temperature: 0.6,
                    maxOutputTokens: 650,
                    thinkingConfig: { thinkingBudget: 0 }
                }
            })
            return response
        } catch (err: any) {
            lastError = err
            const status = err?.status || err?.code
            // If thinkingBudget: 0 is rejected (400) by a specific model, retry that model without thinkingConfig
            if (status === 400) {
                try {
                    return await ai.models.generateContent({
                        model,
                        contents,
                        config: {
                            systemInstruction,
                            temperature: 0.6,
                            maxOutputTokens: 1024
                        }
                    })
                } catch (retryErr: any) {
                    lastError = retryErr
                    continue
                }
            }
            if (status === 404 || status === 503 || status === 429 || status === 500) {
                console.warn(`Gemini model "${model}" failed (${status}), trying fallback...`)
                continue
            }
            throw err
        }
    }

    throw lastError
}

export async function POST(request: NextRequest) {
    const rateLimitResult = await withRateLimit(request, 'api', 20)
    if (rateLimitResult && 'status' in rateLimitResult) {
        return rateLimitResult
    }

    const apiKey = process.env.GEMINI_API_KEY
    if (!apiKey || apiKey.startsWith('your-')) {
        return NextResponse.json(
            {
                code: 'MISSING_API_KEY',
                error: 'GEMINI_API_KEY is not configured on the server.'
            },
            { status: 503 }
        )
    }

    let locale: 'fr' | 'en' = 'en'

    try {
        const body = await request.json()
        const rawMessages: IncomingMessage[] = Array.isArray(body?.messages) ? body.messages : []
        locale = body?.locale === 'fr' ? 'fr' : 'en'
        const burgerContext: BurgerContext | undefined = body?.burgerContext

        const validMessages = rawMessages
            .filter(
                (m): m is IncomingMessage =>
                    (m?.role === 'user' || m?.role === 'assistant') &&
                    typeof m?.content === 'string' &&
                    m.content.trim().length > 0
            )
            .slice(-8)
            .map((m) => ({
                role: m.role === 'assistant' ? 'model' : 'user',
                parts: [{ text: m.content.trim().slice(0, 800) }]
            }))

        if (validMessages.length === 0) {
            return NextResponse.json({ error: 'Message is required' }, { status: 400 })
        }

        const ai = getAIClient(apiKey)
        const preferredModel = process.env.GEMINI_MODEL || 'gemini-3.5-flash-lite'

        const response = await generateWithFallback(
            ai,
            preferredModel,
            validMessages,
            buildSystemInstruction(locale, burgerContext)
        )

        const rawText = response.text || ''
        if (!rawText) {
            return NextResponse.json({ error: 'Empty response from Gemini AI' }, { status: 502 })
        }

        const { reply, recipe } = extractRecipe(rawText)

        return NextResponse.json({ reply, recipe }, { status: 200 })
    } catch (error: any) {
        console.error('Gemini chat error:', error)
        const status = error?.status || error?.code
        const isFr = locale === 'fr'

        if (status === 401 || status === 403) {
            return NextResponse.json(
                {
                    error: isFr
                        ? 'Clé API Gemini invalide ou non autorisée. Vérifie GEMINI_API_KEY dans .env.'
                        : 'Invalid or unauthorized Gemini API key. Check GEMINI_API_KEY in .env.'
                },
                { status: 401 }
            )
        }

        if (status === 429) {
            return NextResponse.json(
                {
                    error: isFr
                        ? 'Limite de requêtes Gemini atteinte. Réessaie dans quelques secondes.'
                        : 'Gemini rate limit reached. Please try again in a few seconds.'
                },
                { status: 429 }
            )
        }

        return NextResponse.json(
            {
                error: isFr
                    ? 'Impossible de joindre Sall pour le moment. Réessaie dans un instant.'
                    : 'Unable to reach Sall right now. Please try again in a moment.'
            },
            { status: 500 }
        )
    }
}
