'use client'

import React, { useEffect, useState } from 'react'
import { BiCurrentLocation, BiMap, BiPhone, BiTime } from 'react-icons/bi'
import { MdEmail, MdLocationOn, MdStar } from 'react-icons/md'
import { useTranslations } from 'next-intl'

import {
    calculateDistance,
    formatAddress,
    getDirectionsUrl,
    getLocationsByDistance,
    RESTAURANT_LOCATIONS,
    type RestaurantLocation
} from '@/types/locations'

export const LocationFinder: React.FC = () => {
    const t = useTranslations('Locations')
    const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null)
    const [selectedLocation, setSelectedLocation] = useState<RestaurantLocation | null>(null)
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

                if (sorted.length > 0) {
                    setSelectedLocation(sorted[0])
                }

                setIsLoadingLocation(false)
            },
            (error) => {
                console.error('Geolocation error:', error)
                setLocationError(t('locationPermissionDenied'))
                setIsLoadingLocation(false)
            }
        )
    }

    useEffect(() => {
        getUserLocation()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const handleLocationClick = (location: RestaurantLocation) => {
        setSelectedLocation(location)
    }

    const handleGetDirections = (location: RestaurantLocation) => {
        const url = getDirectionsUrl(location)
        window.open(url, '_blank')
    }

    return (
        <div className="location-finder">
            <div className="location-header">
                <BiMap className="location-icon" aria-hidden="true" />
                <div>
                    <h3 className="location-title">{t('title')}</h3>
                    <p className="location-subtitle">{t('subtitle')}</p>
                </div>
            </div>

            <div className="location-find-nearest">
                <button
                    onClick={getUserLocation}
                    disabled={isLoadingLocation}
                    className="location-find-button">
                    <BiCurrentLocation />
                    {isLoadingLocation ? t('finding') : t('findNearest')}
                </button>
                {locationError && <p className="location-error">{locationError}</p>}
            </div>

            <div className="location-content">
                <div className="location-list">
                    <h4 className="location-list-title">
                        {userLocation ? t('nearestLocations') : t('allLocations')}
                    </h4>

                    {sortedLocations.map((location) => (
                        <div
                            key={location.id}
                            onClick={() => handleLocationClick(location)}
                            className={`location-card ${selectedLocation?.id === location.id ? 'location-card-active' : ''}`}>
                            <div className="location-card-header">
                                <h5 className="location-card-name">{location.name}</h5>
                                {location.distance !== undefined && (
                                    <span className="location-distance">
                                        {location.distance} {t('miles')}
                                    </span>
                                )}
                            </div>

                            {location.rating && (
                                <div className="location-rating">
                                    <MdStar className="location-star" />
                                    <span className="location-rating-value">{location.rating}</span>
                                    <span className="location-reviews">
                                        ({location.reviewCount} {t('reviews')})
                                    </span>
                                </div>
                            )}

                            <div className="location-address">
                                <MdLocationOn className="location-info-icon" />
                                <span>{formatAddress(location)}</span>
                            </div>

                            <div className="location-phone">
                                <BiPhone className="location-info-icon" />
                                <a href={`tel:${location.phone}`}>{location.phone}</a>
                            </div>

                            <div className="location-features">
                                {location.features.slice(0, 3).map((feature, idx) => (
                                    <span key={idx} className="location-feature-badge">
                                        {feature}
                                    </span>
                                ))}
                            </div>

                            <button className="location-view-button">{t('viewDetails')}</button>
                        </div>
                    ))}
                </div>

                <div className="location-details">
                    {selectedLocation ? (
                        <>
                            <div className="location-details-card">
                                <h4 className="location-details-name">{selectedLocation.name}</h4>

                                {selectedLocation.rating && (
                                    <div className="location-rating location-rating-large">
                                        <MdStar className="location-star" />
                                        <span className="location-rating-value">
                                            {selectedLocation.rating}
                                        </span>
                                        <span className="location-reviews">
                                            ({selectedLocation.reviewCount} {t('reviews')})
                                        </span>
                                    </div>
                                )}

                                <div className="location-details-section">
                                    <h5 className="location-details-section-title">
                                        {t('contactInfo')}
                                    </h5>

                                    <div className="location-detail-item">
                                        <MdLocationOn className="location-detail-icon" />
                                        <div>
                                            <p className="location-detail-label">{t('address')}</p>
                                            <p className="location-detail-value">
                                                {formatAddress(selectedLocation)}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="location-detail-item">
                                        <BiPhone className="location-detail-icon" />
                                        <div>
                                            <p className="location-detail-label">{t('phone')}</p>
                                            <p className="location-detail-value">
                                                <a href={`tel:${selectedLocation.phone}`}>
                                                    {selectedLocation.phone}
                                                </a>
                                            </p>
                                        </div>
                                    </div>

                                    <div className="location-detail-item">
                                        <MdEmail className="location-detail-icon" />
                                        <div>
                                            <p className="location-detail-label">{t('email')}</p>
                                            <p className="location-detail-value">
                                                <a href={`mailto:${selectedLocation.email}`}>
                                                    {selectedLocation.email}
                                                </a>
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="location-details-section">
                                    <h5 className="location-details-section-title">
                                        <BiTime /> {t('hours')}
                                    </h5>
                                    <div className="location-hours-grid">
                                        {Object.entries(selectedLocation.hours).map(
                                            ([day, hours]) => (
                                                <div key={day} className="location-hour-item">
                                                    <span className="location-hour-day">
                                                        {t(`days.${day}`)}:
                                                    </span>
                                                    <span className="location-hour-time">
                                                        {hours}
                                                    </span>
                                                </div>
                                            )
                                        )}
                                    </div>
                                </div>

                                <div className="location-details-section">
                                    <h5 className="location-details-section-title">
                                        {t('features')}
                                    </h5>
                                    <div className="location-features-grid">
                                        {selectedLocation.features.map((feature, idx) => (
                                            <span key={idx} className="location-feature-tag">
                                                ✓ {feature}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                <button
                                    onClick={() => handleGetDirections(selectedLocation)}
                                    className="location-directions-button">
                                    <BiMap /> {t('getDirections')}
                                </button>
                            </div>

                            <div className="location-map-container">
                                <iframe
                                    width="100%"
                                    height="450"
                                    style={{ border: 0, borderRadius: '0.5rem' }}
                                    loading="lazy"
                                    allowFullScreen
                                    referrerPolicy="no-referrer-when-downgrade"
                                    src={`https://www.google.com/maps?q=${selectedLocation.coordinates.lat},${selectedLocation.coordinates.lng}&hl=en&z=15&output=embed`}
                                    title={`Map showing ${selectedLocation.name}`}></iframe>
                            </div>
                        </>
                    ) : (
                        <div className="location-no-selection">
                            <BiMap className="location-no-selection-icon" />
                            <p>{t('selectLocation')}</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
