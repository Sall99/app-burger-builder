'use client'

/* eslint-disable @next/next/no-img-element */
import React from 'react'

export const LAYER_IMAGE_MAP: Record<string, { src: string; alt: string }> = {
    BreadTop: {
        src: '/images/burger/bun-top.png',
        alt: 'Toasted sesame brioche top bun'
    },
    BreadBottom: {
        src: '/images/burger/bun-bottom.png',
        alt: 'Toasted brioche bottom bun'
    },
    meat: {
        src: '/images/burger/meat.png',
        alt: 'Flame-grilled smash beef patty'
    },
    cheese: {
        src: '/images/burger/cheese.png',
        alt: 'Melted aged cheddar cheese slice'
    },
    salad: {
        src: '/images/burger/salad.png',
        alt: 'Crisp fresh butterhead lettuce'
    },
    bacon: {
        src: '/images/burger/bacon.png',
        alt: 'Crispy thick-cut smoked bacon'
    }
}

export const BurgerLayerArt: React.FC<{ type: string; className?: string }> = ({
    type,
    className = ''
}) => {
    const asset = LAYER_IMAGE_MAP[type]
    if (!asset) return null

    return (
        <img
            src={asset.src}
            alt={asset.alt}
            draggable={false}
            loading="eager"
            decoding="async"
            className={`w-full h-auto block select-none pointer-events-none object-contain ${className}`}
        />
    )
}
