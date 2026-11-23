'use client'

import React, { useState } from 'react'
import {
    Check,
    Clock,
    Compass,
    ExternalLink,
    Mail,
    MapPin,
    Navigation,
    Phone,
    Star
} from 'lucide-react'
import { useTranslations } from 'next-intl'

import {
    formatAddress,
    getDirectionsUrl,
    getLocationsByDistance,
    RESTAURANT_LOCATIONS,
    type RestaurantLocation
} from '@/types/locations'

export const LocationFinder: React.FC = () => {
    const t = useTranslations('Locations')
    const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null)
    const [selectedLocation, setSelectedLocation] = useState<RestaurantLocation | null>(
        RESTAURANT_LOCATIONS[0] || null
    )
    const [isLoadingLocation, setIsLoadingLocation] = useState(false)
    const [locationError, setLocationError] = useState<string | null>(null)
    const [sortedLocations, setSortedLocations] =
        useState<Array<RestaurantLocation & { distance?: number }>>(RESTAURANT_LOCATIONS)

    const getUserLocation = () => {
        if (!('geolocation' in navigator)) {
            setLocationError(t('geolocationNotSupported'))
            return
        }

        setIsLoadingLocation(true)
        setLocationError(null)

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords
                setUserLocation({ lat: latitude, lng: longitude })
                const sorted = getLocationsByDistance(latitude, longitude)
                setSortedLocations(sorted)
                if (sorted.length > 0) setSelectedLocation(sorted[0])
                setIsLoadingLocation(false)
            },
            (error) => {
                switch (error.code) {
                    case error.PERMISSION_DENIED:
                        setLocationError(t('locationPermissionDenied'))
                        break
                    case error.POSITION_UNAVAILABLE:
                        setLocationError(t('locationUnavailable'))
                        break
                    case error.TIMEOUT:
                        setLocationError(t('locationTimeout'))
                        break
                    default:
                        setLocationError(t('locationPermissionDenied'))
                }
                setIsLoadingLocation(false)
            }
        )
    }

    return (
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 space-y-8">
            <div className="flex flex-col gap-4 border-b border-zinc-200/80 pb-6 sm:flex-row sm:items-end sm:justify-between">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-950">
                        {t('title')}
                    </h1>
                    <p className="mt-1 text-sm text-zinc-500">{t('subtitle')}</p>
                </div>

                <button
                    type="button"
                    onClick={getUserLocation}
                    disabled={isLoadingLocation}
                    className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-zinc-950 px-4 py-2 text-xs font-semibold text-white hover:bg-zinc-800 transition-colors disabled:opacity-50">
                    <Compass size={14} />
                    <span>{isLoadingLocation ? t('finding') : t('findNearest')}</span>
                </button>
            </div>

            {locationError && (
                <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs font-medium text-amber-900">
                    {locationError}
                </div>
            )}

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 items-start">
                <div className="space-y-2.5 lg:col-span-5">
                    <p className="text-xs font-medium text-zinc-500">
                        {userLocation ? t('nearestLocations') : t('allLocations')} (
                        {sortedLocations.length})
                    </p>

                    {sortedLocations.map((location) => {
                        const isSelected = selectedLocation?.id === location.id
                        return (
                            <button
                                key={location.id}
                                type="button"
                                onClick={() => setSelectedLocation(location)}
                                className={`w-full text-left rounded-2xl border p-4 transition-all ${
                                    isSelected
                                        ? 'border-zinc-950 bg-zinc-50/80 shadow-soft'
                                        : 'border-zinc-200/80 bg-white hover:border-zinc-300'
                                }`}>
                                <div className="flex items-start justify-between gap-2">
                                    <h3 className="text-sm font-semibold text-zinc-950">
                                        {location.name}
                                    </h3>
                                    {location.distance !== undefined && (
                                        <span className="shrink-0 rounded-full bg-zinc-900 px-2 py-0.5 text-[10px] font-semibold text-white">
                                            {location.distance} {t('miles')}
                                        </span>
                                    )}
                                </div>

                                {location.rating && (
                                    <div className="mt-1 flex items-center gap-1 text-xs text-zinc-500">
                                        <Star
                                            size={12}
                                            className="fill-amber-400 text-amber-400"
                                        />
                                        <span className="font-semibold text-zinc-900">
                                            {location.rating}
                                        </span>
                                        <span>({location.reviewCount})</span>
                                    </div>
                                )}

                                <p className="mt-2 flex items-start gap-1.5 text-xs text-zinc-500">
                                    <MapPin size={13} className="mt-0.5 shrink-0 text-zinc-400" />
                                    <span>{formatAddress(location)}</span>
                                </p>
                            </button>
                        )
                    })}
                </div>

                <div className="lg:col-span-7 lg:sticky lg:top-24 space-y-4">
                    {selectedLocation && (
                        <>
                            <div className="rounded-2xl border border-zinc-200/80 bg-white p-6 space-y-5">
                                <div className="flex flex-wrap items-start justify-between gap-4 border-b border-zinc-100 pb-4">
                                    <div>
                                        <h2 className="text-lg font-bold tracking-tight text-zinc-950">
                                            {selectedLocation.name}
                                        </h2>
                                        <p className="mt-0.5 text-xs text-zinc-500">
                                            {formatAddress(selectedLocation)}
                                        </p>
                                    </div>

                                    <button
                                        type="button"
                                        onClick={() =>
                                            window.open(getDirectionsUrl(selectedLocation), '_blank')
                                        }
                                        className="inline-flex items-center gap-1.5 rounded-full bg-zinc-950 px-4 py-2 text-xs font-semibold text-white hover:bg-zinc-800 transition-colors">
                                        <Navigation size={13} />
                                        <span>{t('getDirections')}</span>
                                        <ExternalLink size={11} />
                                    </button>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
                                    <div className="space-y-2.5">
                                        <p className="font-semibold text-zinc-950">
                                            {t('contactInfo')}
                                        </p>
                                        <div className="flex items-center gap-2 text-zinc-600">
                                            <Phone size={13} className="text-zinc-400" />
                                            <a
                                                href={`tel:${selectedLocation.phone}`}
                                                className="hover:text-zinc-950">
                                                {selectedLocation.phone}
                                            </a>
                                        </div>
                                        <div className="flex items-center gap-2 text-zinc-600">
                                            <Mail size={13} className="text-zinc-400" />
                                            <a
                                                href={`mailto:${selectedLocation.email}`}
                                                className="hover:text-zinc-950 truncate">
                                                {selectedLocation.email}
                                            </a>
                                        </div>
                                    </div>

                                    <div className="space-y-1.5">
                                        <p className="flex items-center gap-1.5 font-semibold text-zinc-950 mb-2">
                                            <Clock size={13} className="text-zinc-400" />
                                            <span>{t('hours')}</span>
                                        </p>
                                        {Object.entries(selectedLocation.hours).map(
                                            ([day, hours]) => (
                                                <div
                                                    key={day}
                                                    className="flex justify-between text-zinc-600">
                                                    <span className="font-medium text-zinc-800">
                                                        {t(`days.${day}`)}
                                                    </span>
                                                    <span>{hours}</span>
                                                </div>
                                            )
                                        )}
                                    </div>
                                </div>

                                <div className="flex flex-wrap gap-1.5 border-t border-zinc-100 pt-4">
                                    {selectedLocation.features.map((feature, idx) => (
                                        <span
                                            key={idx}
                                            className="inline-flex items-center gap-1 rounded-full bg-zinc-100 px-2.5 py-1 text-[11px] font-medium text-zinc-700">
                                            <Check size={11} className="text-emerald-600" />
                                            {feature}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            <div className="overflow-hidden rounded-2xl border border-zinc-200/80 bg-white">
                                <iframe
                                    width="100%"
                                    height="340"
                                    style={{ border: 0 }}
                                    loading="lazy"
                                    allowFullScreen
                                    referrerPolicy="no-referrer-when-downgrade"
                                    src={`https://www.google.com/maps?q=${selectedLocation.coordinates.lat},${selectedLocation.coordinates.lng}&hl=en&z=15&output=embed`}
                                    title={`Map showing ${selectedLocation.name}`}
                                />
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    )
}
