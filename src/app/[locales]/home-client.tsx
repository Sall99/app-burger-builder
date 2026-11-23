'use client'

/* eslint-disable @next/next/no-img-element */
import React, { useState } from 'react'
import toast from 'react-hot-toast'
import { useDispatch, useSelector } from 'react-redux'
import { ArrowRight, Bookmark, Check, ChefHat, Flame, Layers, Plus, Tag } from 'lucide-react'
import { useLocale, useTranslations } from 'next-intl'

import {
    BuilderAnimated,
    BuilderWrapper,
    Controls,
    DeliveryTime,
    DietaryInfo,
    IngredientSubstitutions,
    MealDeals,
    SavedTemplates,
    ShareBurger
} from '@/components/ui'
import { Total } from '@/components/ui/total/total'
import { TotalMobile } from '@/components/ui/total/total-mobile'
import { selectIngredients } from '@/redux/selectors/ingredients'
import { setIngredients } from '@/redux/slices/ingredients-enhanced'
import { totalFormatter } from '@/utils/utils'

type StudioTab = 'ingredients' | 'combos' | 'nutrition' | 'saved'

interface SignatureBurger {
    id: string
    image: string
    nameFr: string
    nameEn: string
    descFr: string
    descEn: string
    tagFr: string
    tagEn: string
    kcal: number
    price: number
    ingredients: {
        meat: number
        cheese: number
        bacon: number
        salad: number
    }
}

const SIGNATURE_BURGERS: SignatureBurger[] = [
    {
        id: 'classic-smash',
        image: '/images/food/sig-classic.jpg',
        nameFr: 'Le Classic Smash',
        nameEn: 'The Classic Smash',
        descFr: 'Bœuf smashé croustillant, cheddar fondant, laitue fraîche, pain brioché.',
        descEn: 'Crispy seared smash patty, melted cheddar, crisp lettuce, brioche bun.',
        tagFr: 'Classique',
        tagEn: 'Classic',
        kcal: 555,
        price: 6.2,
        ingredients: { meat: 1, cheese: 1, bacon: 0, salad: 1 }
    },
    {
        id: 'smoky-bacon',
        image: '/images/food/sig-bacon.jpg',
        nameFr: 'Double Bacon Fumé',
        nameEn: 'Smoky Bacon Deluxe',
        descFr: 'Double bœuf grillé, double bacon fumé croustillant, cheddar affiné & salade.',
        descEn: 'Double grilled beef, double thick-cut crispy bacon, cheddar & lettuce.',
        tagFr: 'Bacon fumé',
        tagEn: 'Smoked Bacon',
        kcal: 1055,
        price: 9.3,
        ingredients: { meat: 2, cheese: 2, bacon: 2, salad: 1 }
    },
    {
        id: 'triple-cheese',
        image: '/images/food/sig-cheese.jpg',
        nameFr: 'Cheddar Melt Royal',
        nameEn: 'Triple Cheddar Melt',
        descFr: 'Double bœuf smashé nappé d’un triple cheddar affiné fondant.',
        descEn: 'Double smash beef layered with triple aged melted cheddar.',
        tagFr: 'Triple cheddar',
        tagEn: 'Triple Cheese',
        kcal: 1010,
        price: 7.8,
        ingredients: { meat: 2, cheese: 3, bacon: 0, salad: 0 }
    },
    {
        id: 'supreme-house',
        image: '/images/food/hero-burger.jpg',
        nameFr: 'Le Smash Complet',
        nameEn: 'The House Special',
        descFr: 'Double steak, double cheddar, bacon fumé et laitue croquante sur brioche.',
        descEn: 'Double patty, double cheddar, smoked bacon & crisp lettuce on brioche.',
        tagFr: 'Signature',
        tagEn: 'Signature',
        kcal: 935,
        price: 8.6,
        ingredients: { meat: 2, cheese: 2, bacon: 1, salad: 1 }
    }
]

export function HomeClient() {
    const dispatch = useDispatch()
    const { ingredients } = useSelector(selectIngredients)
    const t = useTranslations('Pages.Home')
    const locale = useLocale()
    const isFr = locale === 'fr'
    const [activeTab, setActiveTab] = useState<StudioTab>('ingredients')
    const [activeSignatureId, setActiveSignatureId] = useState<string | null>(null)

    const tabs: Array<{ id: StudioTab; label: string; icon: typeof Layers }> = [
        { id: 'ingredients', label: isFr ? 'Ingrédients' : 'Ingredients', icon: Layers },
        { id: 'combos', label: isFr ? 'Menus' : 'Combos', icon: Tag },
        { id: 'nutrition', label: 'Nutrition', icon: Flame },
        { id: 'saved', label: isFr ? 'Favoris' : 'Saved', icon: Bookmark }
    ]

    const scrollToSection = (id: string) => {
        const el = document.getElementById(id)
        if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }
    }

    const handleSelectSignature = (burger: SignatureBurger) => {
        dispatch(setIngredients(burger.ingredients))
        setActiveSignatureId(burger.id)
        setActiveTab('ingredients')
        toast.success(
            isFr
                ? `${burger.nameFr} chargé dans le configurateur`
                : `${burger.nameEn} loaded into the builder`
        )
        scrollToSection('builder')
    }

    return (
        <BuilderWrapper>
            <div className="mx-auto max-w-7xl px-4 pb-16 pt-6 sm:px-6 lg:px-8 space-y-14">
                {/* =========================================
                    1. HERO SECTION — INTERACTIVE 3D / 2D BURGER BUILDER
                   ========================================= */}
                <section id="builder" className="scroll-mt-20 space-y-6">
                    {/* Compact Editorial Hero Header */}
                    <div className="flex flex-col justify-between gap-4 border-b border-surface-border pb-6 lg:flex-row lg:items-end">
                        <div className="space-y-2">
                            <p className="text-xs font-medium text-ink-muted">
                                {isFr
                                    ? 'Préparé à la commande · Pain brioché artisanal ($4.00 inclus) · Livraison ~25 min'
                                    : 'Made to order · Artisan brioche bun ($4.00 included) · ~25 min delivery'}
                            </p>
                            <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-ink leading-tight">
                                {t('h1')}
                            </h1>
                            <p className="max-w-2xl text-sm text-ink-muted">
                                {isFr
                                    ? 'Composez votre burger couche par couche en 3D 360° interactive ou Photo 2D, avec prix et valeurs nutritionnelles calculés en direct.'
                                    : 'Build your burger layer by layer in interactive 360° 3D or 2D Photo, with live pricing and nutritional breakdown.'}
                            </p>
                        </div>

                        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
                            <button
                                type="button"
                                onClick={() =>
                                    window.dispatchEvent(new CustomEvent('burger-ai:open'))
                                }
                                className="inline-flex items-center gap-2 rounded-lg border border-surface-border bg-white px-3.5 py-2 text-xs font-semibold text-ink transition-colors hover:bg-surface">
                                <ChefHat size={15} className="text-brand-500" />
                                <span>
                                    {isFr
                                        ? 'Demander une recette à Sall IA'
                                        : 'Ask Sall AI for a recipe'}
                                </span>
                            </button>

                            <button
                                type="button"
                                onClick={() => scrollToSection('signatures')}
                                className="inline-flex items-center gap-1.5 rounded-lg border border-surface-border bg-surface/70 px-3.5 py-2 text-xs font-semibold text-ink transition-colors hover:bg-surface">
                                <span>
                                    {isFr ? 'Voir les 4 recettes signatures' : 'View 4 signature recipes'}
                                </span>
                                <ArrowRight size={13} />
                            </button>
                        </div>
                    </div>

                    {/* Hero Interactive Studio Grid: 3D/2D Stage Left + Controls & Checkout Right */}
                    <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12">
                        {/* Left Sticky 3D / 2D Burger Stage */}
                        <div className="lg:col-span-6 lg:sticky lg:top-20">
                            <BuilderAnimated ingredients={ingredients} />
                        </div>

                        {/* Right Controls + Tabs + Live Order Total */}
                        <div className="lg:col-span-6 space-y-5">
                            <div
                                role="tablist"
                                aria-label="Configurator sections"
                                className="grid grid-cols-4 gap-1 rounded-xl border border-surface-border bg-white p-1">
                                {tabs.map(({ id, label, icon: Icon }) => {
                                    const active = activeTab === id
                                    return (
                                        <button
                                            key={id}
                                            type="button"
                                            role="tab"
                                            aria-selected={active}
                                            onClick={() => setActiveTab(id)}
                                            className={`flex items-center justify-center gap-1.5 rounded-lg px-2.5 py-2 text-xs font-semibold transition-colors ${
                                                active
                                                    ? 'bg-ink text-white'
                                                    : 'text-ink-muted hover:bg-surface hover:text-ink'
                                            }`}>
                                            <Icon size={13} className="shrink-0" />
                                            <span className="truncate">{label}</span>
                                        </button>
                                    )
                                })}
                            </div>

                            <div className="space-y-4">
                                {activeTab === 'ingredients' && (
                                    <>
                                        <Controls />
                                        <IngredientSubstitutions />
                                    </>
                                )}

                                {activeTab === 'combos' && <MealDeals />}

                                {activeTab === 'nutrition' && (
                                    <div className="space-y-4">
                                        <DietaryInfo />
                                        <DeliveryTime />
                                    </div>
                                )}

                                {activeTab === 'saved' && (
                                    <div className="space-y-4">
                                        <SavedTemplates />
                                        <ShareBurger />
                                    </div>
                                )}
                            </div>

                            <Total />
                        </div>
                    </div>
                </section>

                {/* =========================================
                    2. SIGNATURE RECIPES (1-CLICK LOAD INTO HERO BUILDER)
                   ========================================= */}
                <section
                    id="signatures"
                    className="scroll-mt-20 border-t border-surface-border pt-10 space-y-6">
                    <div className="flex flex-wrap items-end justify-between gap-4">
                        <div>
                            <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-ink">
                                {isFr ? 'Recettes signatures' : 'Signature Recipes'}
                            </h2>
                            <p className="mt-1 text-sm text-ink-muted">
                                {isFr
                                    ? 'Chargez une recette maison directement dans le studio 3D ci-dessus puis ajustez les quantités.'
                                    : 'Load a house recipe directly into the 3D studio above and adjust any ingredient.'}
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        {SIGNATURE_BURGERS.map((burger) => {
                            const selected = activeSignatureId === burger.id
                            return (
                                <article
                                    key={burger.id}
                                    className={`flex flex-col overflow-hidden rounded-xl border bg-white transition-colors ${
                                        selected
                                            ? 'border-ink'
                                            : 'border-surface-border hover:border-ink/40'
                                    }`}>
                                    <div className="relative aspect-[4/3] w-full overflow-hidden bg-surface">
                                        <img
                                            src={burger.image}
                                            alt={isFr ? burger.nameFr : burger.nameEn}
                                            className="h-full w-full object-cover"
                                        />
                                        <span className="absolute left-2.5 top-2.5 rounded-md border border-surface-border/80 bg-white/95 px-2 py-0.5 text-[11px] font-medium text-ink">
                                            {isFr ? burger.tagFr : burger.tagEn}
                                        </span>
                                    </div>

                                    <div className="flex flex-1 flex-col justify-between p-4 space-y-4">
                                        <div>
                                            <div className="flex items-baseline justify-between gap-2">
                                                <h3 className="font-display text-base font-bold text-ink">
                                                    {isFr ? burger.nameFr : burger.nameEn}
                                                </h3>
                                                <span className="tabular-nums text-xs text-ink-subtle shrink-0">
                                                    {burger.kcal} kcal
                                                </span>
                                            </div>
                                            <p className="mt-1.5 min-h-[2.5rem] line-clamp-2 text-xs leading-relaxed text-ink-muted">
                                                {isFr ? burger.descFr : burger.descEn}
                                            </p>
                                        </div>

                                        <div className="flex items-center justify-between gap-3 pt-3 border-t border-surface-border">
                                            <span className="tabular-nums text-base font-bold text-ink">
                                                {totalFormatter.format(burger.price)}
                                            </span>
                                            <button
                                                type="button"
                                                onClick={() => handleSelectSignature(burger)}
                                                className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
                                                    selected
                                                        ? 'bg-ink text-white'
                                                        : 'border border-surface-border bg-surface/70 text-ink hover:bg-surface'
                                                }`}>
                                                {selected ? (
                                                    <>
                                                        <Check size={13} />
                                                        <span>{isFr ? 'Sélectionné' : 'Loaded'}</span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <Plus size={13} />
                                                        <span>
                                                            {isFr ? 'Personnaliser' : 'Customize'}
                                                        </span>
                                                    </>
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                </article>
                            )
                        })}
                    </div>
                </section>
            </div>

            <TotalMobile />
        </BuilderWrapper>
    )
}
