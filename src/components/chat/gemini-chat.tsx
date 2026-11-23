'use client'

import React, { useEffect, useMemo, useRef, useState } from 'react'
import toast from 'react-hot-toast'
import { useDispatch, useSelector } from 'react-redux'
import { Check, ChefHat, Loader2, Send, Trash2, Wand2, X } from 'lucide-react'
import { usePathname, useRouter } from 'next/navigation'
import { useLocale } from 'next-intl'

import { selectIngredients } from '@/redux/selectors/ingredients'
import { setIngredients } from '@/redux/slices/ingredients-enhanced'
import { calculateBurgerDietaryInfo } from '@/utils/dietary-calculator'
import { totalFormatter } from '@/utils/utils'

export interface SuggestedRecipe {
    name: string
    meat: number
    bacon: number
    cheese: number
    salad: number
}

interface ChatMessage {
    id: string
    role: 'user' | 'assistant'
    content: string
    recipe?: SuggestedRecipe | null
    isError?: boolean
}

interface GeminiChatProps {
    userName?: string
}

const QUICK_PROMPTS = {
    fr: [
        'Suggère-moi un burger gourmand',
        'Burger riche en protéines',
        'Codes promo disponibles ?',
        'Analyse mon burger'
    ],
    en: [
        'Suggest a gourmet burger',
        'High-protein burger',
        'Available promo codes?',
        'Review my burger'
    ]
} as const

export const chatHelpers = {
    open: () => {
        if (typeof window !== 'undefined') window.dispatchEvent(new CustomEvent('burger-ai:open'))
    },
    close: () => {
        if (typeof window !== 'undefined') window.dispatchEvent(new CustomEvent('burger-ai:close'))
    },
    toggle: () => {
        if (typeof window !== 'undefined') window.dispatchEvent(new CustomEvent('burger-ai:toggle'))
    }
}

function estimateRecipePrice(recipe: SuggestedRecipe): number {
    return 4 + recipe.meat * 1.3 + recipe.bacon * 0.7 + recipe.cheese * 0.4 + recipe.salad * 0.5
}

function renderFormattedText(text: string): React.ReactNode {
    const parts = text.split(/(\*\*[^*]+\*\*)/g)
    return parts.map((part, idx) => {
        if (part.startsWith('**') && part.endsWith('**') && part.length > 4) {
            return (
                <strong key={idx} className="font-semibold text-zinc-950">
                    {part.slice(2, -2)}
                </strong>
            )
        }
        return <React.Fragment key={idx}>{part}</React.Fragment>
    })
}

export const GeminiChat: React.FC<GeminiChatProps> = ({ userName }) => {
    const locale = useLocale()
    const router = useRouter()
    const pathname = usePathname()
    const isFr = locale === 'fr'
    const dispatch = useDispatch()
    const { ingredients, totalPrice } = useSelector(selectIngredients)
    const dietaryInfo = useMemo(() => calculateBurgerDietaryInfo(ingredients), [ingredients])

    const [isOpen, setIsOpen] = useState(false)
    const [showTeaser, setShowTeaser] = useState(false)
    const [input, setInput] = useState('')
    const [loading, setLoading] = useState(false)
    const [appliedMessageId, setAppliedMessageId] = useState<string | null>(null)
    const [messages, setMessages] = useState<ChatMessage[]>([])

    const messagesEndRef = useRef<HTMLDivElement>(null)
    const inputRef = useRef<HTMLInputElement>(null)

    useEffect(() => {
        if (typeof window === 'undefined') return
        const dismissed = window.sessionStorage.getItem('chef_gemini_teaser_dismissed')
        if (dismissed) return
        const timer = setTimeout(() => {
            setShowTeaser(true)
        }, 1200)
        return () => clearTimeout(timer)
    }, [])

    const dismissTeaser = () => {
        setShowTeaser(false)
        if (typeof window !== 'undefined') {
            window.sessionStorage.setItem('chef_gemini_teaser_dismissed', '1')
        }
    }

    const openChat = () => {
        dismissTeaser()
        setIsOpen(true)
    }

    useEffect(() => {
        const onOpen = () => {
            dismissTeaser()
            setIsOpen(true)
        }
        const onClose = () => setIsOpen(false)
        const onToggle = () => {
            dismissTeaser()
            setIsOpen((prev) => !prev)
        }
        window.addEventListener('burger-ai:open', onOpen)
        window.addEventListener('burger-ai:close', onClose)
        window.addEventListener('burger-ai:toggle', onToggle)
        return () => {
            window.removeEventListener('burger-ai:open', onOpen)
            window.removeEventListener('burger-ai:close', onClose)
            window.removeEventListener('burger-ai:toggle', onToggle)
        }
    }, [])

    useEffect(() => {
        if (isOpen) {
            messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
            setTimeout(() => inputRef.current?.focus(), 100)
        }
    }, [isOpen, messages, loading])

    const welcomeText = isFr
        ? `Bonjour${userName ? ` ${userName}` : ''} ! Je suis Sall, votre chef assistant. Demandez-moi une recette sur-mesure, des conseils nutrition ou un code promo.`
        : `Hi${userName ? ` ${userName}` : ''}! I'm Sall, your chef assistant. Ask me for custom burger recipes, nutrition info, or promo codes.`

    const sendMessage = async (textOverride?: string) => {
        const content = (textOverride ?? input).trim()
        if (!content || loading) return

        const userMsg: ChatMessage = { id: `u-${Date.now()}`, role: 'user', content }
        const nextMessages = [...messages, userMsg]
        setMessages(nextMessages)
        setInput('')
        setLoading(true)

        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    locale,
                    messages: nextMessages.map((m) => ({ role: m.role, content: m.content })),
                    burgerContext: {
                        ingredients,
                        totalPrice,
                        calories: dietaryInfo.totalNutrition.calories
                    }
                })
            })

            const data = await response.json()

            if (!response.ok) {
                setMessages((prev) => [
                    ...prev,
                    {
                        id: `e-${Date.now()}`,
                        role: 'assistant',
                        content:
                            data.error ||
                            (isFr
                                ? 'Impossible de joindre Sall.'
                                : 'Unable to reach Sall.'),
                        isError: true
                    }
                ])
                return
            }

            setMessages((prev) => [
                ...prev,
                {
                    id: `a-${Date.now()}`,
                    role: 'assistant',
                    content: data.reply,
                    recipe: data.recipe ?? null
                }
            ])
        } catch {
            setMessages((prev) => [
                ...prev,
                {
                    id: `e-${Date.now()}`,
                    role: 'assistant',
                    content: isFr ? 'Erreur réseau.' : 'Network error.',
                    isError: true
                }
            ])
        } finally {
            setLoading(false)
        }
    }

    const handleApplyRecipe = (messageId: string, recipe: SuggestedRecipe) => {
        dispatch(
            setIngredients({
                meat: recipe.meat,
                bacon: recipe.bacon,
                cheese: recipe.cheese,
                salad: recipe.salad
            })
        )
        setAppliedMessageId(messageId)
        toast.success(
            isFr ? `"${recipe.name}" appliqué !` : `"${recipe.name}" applied!`
        )
        const isOnBuilder = pathname === `/${locale}` || pathname === '/'
        if (!isOnBuilder) {
            router.push(`/${locale}`)
        }
    }

    const totalLayers =
        (ingredients.meat || 0) +
        (ingredients.bacon || 0) +
        (ingredients.cheese || 0) +
        (ingredients.salad || 0)
    const prompts = isFr ? QUICK_PROMPTS.fr : QUICK_PROMPTS.en

    if (pathname?.includes('/auth/')) return null

    return (
        <div className="fixed bottom-20 right-4 z-50 lg:bottom-6 lg:right-6">
            {isOpen && (
                <div
                    role="dialog"
                    aria-label="Sall AI Assistant"
                    className="mb-3 flex h-[520px] max-h-[78vh] w-[368px] max-w-[calc(100vw-2rem)] flex-col overflow-hidden rounded-3xl border border-surface-border bg-white shadow-elevated">
                    {/* Expressive Food-App Header */}
                    <div className="flex items-center justify-between bg-ink px-4 py-3.5 text-white">
                        <div className="flex items-center gap-2.5">
                            <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-brand-500 text-white">
                                <ChefHat size={18} />
                            </div>
                            <div>
                                <div className="flex items-center gap-1.5">
                                    <h2 className="font-display text-sm font-bold tracking-tight text-white">
                                        Sall
                                    </h2>
                                    <span className="h-2 w-2 rounded-full bg-fresh-500" />
                                </div>
                                <p className="tabular-nums text-[11px] text-neutral-400">
                                    {totalLayers > 0
                                        ? `${totalLayers} ${isFr ? 'couches' : 'layers'} • ${totalFormatter.format(totalPrice)}`
                                        : isFr
                                          ? 'Chef Assistant IA'
                                          : 'AI Chef Assistant'}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-0.5">
                            {messages.length > 0 && (
                                <button
                                    type="button"
                                    onClick={() => setMessages([])}
                                    aria-label={isFr ? 'Effacer' : 'Clear'}
                                    className="rounded-lg p-1.5 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-900 transition-colors">
                                    <Trash2 size={14} />
                                </button>
                            )}
                            <button
                                type="button"
                                onClick={() => setIsOpen(false)}
                                aria-label={isFr ? 'Fermer' : 'Close'}
                                className="rounded-lg p-1.5 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-900 transition-colors">
                                <X size={16} />
                            </button>
                        </div>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 bg-zinc-50/50">
                        <div className="max-w-[90%] rounded-2xl rounded-tl-sm border border-zinc-200/70 bg-white px-3.5 py-2.5 text-xs leading-relaxed text-zinc-700 shadow-soft">
                            {welcomeText}
                        </div>

                        {messages.length === 0 && (
                            <div className="flex flex-wrap gap-1.5 pt-1">
                                {prompts.map((prompt) => (
                                    <button
                                        key={prompt}
                                        type="button"
                                        onClick={() => sendMessage(prompt)}
                                        className="rounded-full border border-zinc-200 bg-white px-3 py-1.5 text-[11px] font-medium text-zinc-700 hover:border-zinc-400 hover:text-zinc-950 transition-colors">
                                        {prompt}
                                    </button>
                                ))}
                            </div>
                        )}

                        {messages.map((msg) => (
                            <div
                                key={msg.id}
                                className={`flex flex-col ${
                                    msg.role === 'user' ? 'items-end' : 'items-start'
                                }`}>
                                <div
                                    className={`max-w-[88%] rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed whitespace-pre-wrap ${
                                        msg.role === 'user'
                                            ? 'rounded-tr-sm bg-zinc-950 text-white'
                                            : msg.isError
                                              ? 'rounded-tl-sm border border-red-200 bg-red-50 text-red-700'
                                              : 'rounded-tl-sm border border-zinc-200/70 bg-white text-zinc-700 shadow-soft'
                                    }`}>
                                    {msg.role === 'assistant'
                                        ? renderFormattedText(msg.content)
                                        : msg.content}
                                </div>

                                {msg.recipe && (
                                    <div className="mt-2 w-[88%] rounded-2xl border border-zinc-200 bg-white p-3.5 shadow-soft space-y-2.5">
                                        <div className="flex items-center justify-between gap-2">
                                            <span className="text-xs font-semibold text-zinc-950">
                                                {msg.recipe.name}
                                            </span>
                                            <span className="text-xs font-semibold text-orange-600 tabular-nums">
                                                {totalFormatter.format(
                                                    estimateRecipePrice(msg.recipe)
                                                )}
                                            </span>
                                        </div>

                                        <div className="flex flex-wrap gap-1 text-[11px] text-zinc-600">
                                            {msg.recipe.meat > 0 && (
                                                <span className="rounded-md bg-zinc-100 px-2 py-0.5 font-medium">
                                                    {isFr ? 'Viande' : 'Meat'} ×{msg.recipe.meat}
                                                </span>
                                            )}
                                            {msg.recipe.bacon > 0 && (
                                                <span className="rounded-md bg-zinc-100 px-2 py-0.5 font-medium">
                                                    Bacon ×{msg.recipe.bacon}
                                                </span>
                                            )}
                                            {msg.recipe.cheese > 0 && (
                                                <span className="rounded-md bg-zinc-100 px-2 py-0.5 font-medium">
                                                    {isFr ? 'Fromage' : 'Cheese'} ×{msg.recipe.cheese}
                                                </span>
                                            )}
                                            {msg.recipe.salad > 0 && (
                                                <span className="rounded-md bg-zinc-100 px-2 py-0.5 font-medium">
                                                    {isFr ? 'Salade' : 'Salad'} ×{msg.recipe.salad}
                                                </span>
                                            )}
                                        </div>

                                        <button
                                            type="button"
                                            onClick={() => handleApplyRecipe(msg.id, msg.recipe!)}
                                            className={`flex w-full items-center justify-center gap-1.5 rounded-xl py-2 text-xs font-medium transition-all ${
                                                appliedMessageId === msg.id
                                                    ? 'bg-emerald-600 text-white'
                                                    : 'bg-zinc-950 text-white hover:bg-zinc-800'
                                            }`}>
                                            {appliedMessageId === msg.id ? (
                                                <>
                                                    <Check size={13} />
                                                    <span>
                                                        {isFr ? 'Appliqué' : 'Applied'}
                                                    </span>
                                                </>
                                            ) : (
                                                <>
                                                    <Wand2 size={13} />
                                                    <span>
                                                        {isFr
                                                            ? 'Appliquer ce burger'
                                                            : 'Apply to builder'}
                                                    </span>
                                                </>
                                            )}
                                        </button>
                                    </div>
                                )}
                            </div>
                        ))}

                        {loading && (
                            <div className="inline-flex items-center gap-2 rounded-2xl border border-zinc-200/70 bg-white px-3.5 py-2 text-xs text-zinc-500 shadow-soft">
                                <Loader2 size={13} className="animate-spin text-orange-500" />
                                <span>{isFr ? 'Réflexion...' : 'Thinking...'}</span>
                            </div>
                        )}

                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input */}
                    <form
                        onSubmit={(e) => {
                            e.preventDefault()
                            sendMessage()
                        }}
                        className="flex items-center gap-2 border-t border-zinc-100 bg-white p-2.5">
                        <input
                            ref={inputRef}
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder={isFr ? 'Écrire à Sall...' : 'Ask Sall...'}
                            maxLength={500}
                            disabled={loading}
                            className="flex-1 rounded-xl bg-zinc-100/80 px-3.5 py-2 text-xs text-zinc-950 placeholder:text-zinc-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-zinc-950/15"
                        />
                        <button
                            type="submit"
                            disabled={!input.trim() || loading}
                            aria-label={isFr ? 'Envoyer' : 'Send'}
                            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-brand-500 text-white hover:bg-brand-600 transition-colors disabled:opacity-35">
                            <Send size={14} />
                        </button>
                    </form>
                </div>
            )}

            {/* Welcome Teaser Bubble on Arrival */}
            {!isOpen && showTeaser && (
                <div className="mb-2.5 ml-auto flex max-w-[260px] items-start gap-2.5 rounded-xl border border-surface-border bg-white p-3 shadow-elevated">
                    <button
                        type="button"
                        onClick={openChat}
                        className="flex-1 text-left focus:outline-none">
                        <p className="text-xs font-semibold text-ink flex items-center gap-1.5">
                            <ChefHat size={14} className="text-brand-500 shrink-0" />
                            <span>{isFr ? 'Assistant Sall' : 'Chef Sall'}</span>
                        </p>
                        <p className="mt-1 text-[11px] leading-snug text-ink-muted">
                            {isFr
                                ? 'Besoin d’une idée de recette ? Je compose votre burger en 1 clic.'
                                : 'Need a recipe idea? I can build your burger in 1 click.'}
                        </p>
                    </button>
                    <button
                        type="button"
                        onClick={dismissTeaser}
                        aria-label={isFr ? 'Fermer le message' : 'Dismiss message'}
                        className="rounded-md p-1 text-ink-subtle hover:bg-surface hover:text-ink transition-colors">
                        <X size={13} />
                    </button>
                </div>
            )}

            {/* Clean Launcher */}
            <button
                type="button"
                onClick={() => {
                    dismissTeaser()
                    setIsOpen((prev) => !prev)
                }}
                aria-label={isOpen ? 'Close Sall' : 'Open Sall'}
                className="ml-auto flex items-center gap-2 rounded-full bg-ink px-4 py-2.5 text-white shadow-elevated transition-colors hover:bg-charcoal-light">
                {isOpen ? <X size={16} /> : <ChefHat size={16} />}
                <span className="text-xs font-semibold whitespace-nowrap">
                    {isOpen ? (isFr ? 'Fermer' : 'Close') : 'Sall'}
                </span>
            </button>
        </div>
    )
}
