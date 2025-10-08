'use client'

import React, { useEffect, useState } from 'react'
import { BiBell, BiBellOff } from 'react-icons/bi'
import { MdNotifications } from 'react-icons/md'
import { useTranslations } from 'next-intl'

import {
    getNotificationPermission,
    isPushNotificationSupported,
    isPushSubscribed,
    registerServiceWorker,
    requestNotificationPermission,
    sendSubscriptionToServer,
    sendTestNotification,
    subscribeToPushNotifications,
    unsubscribeFromPushNotifications
} from '@/utils/push-notifications'

export const NotificationSettings: React.FC = () => {
    const t = useTranslations('Notifications')
    const [isSupported, setIsSupported] = useState(false)
    const [permission, setPermission] = useState<NotificationPermission>('default')
    const [isSubscribed, setIsSubscribed] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [registration, setRegistration] = useState<ServiceWorkerRegistration | null>(null)

    const [preferences, setPreferences] = useState({
        orderUpdates: true,
        promotions: true,
        loyaltyRewards: true,
        newFeatures: false
    })

    useEffect(() => {
        setIsSupported(isPushNotificationSupported())
        setPermission(getNotificationPermission())

        if (isPushNotificationSupported()) {
            registerServiceWorker().then((reg) => {
                if (reg) {
                    setRegistration(reg)
                    isPushSubscribed(reg).then(setIsSubscribed)
                }
            })
        }
    }, [])

    const handleEnableNotifications = async () => {
        if (!registration) {
            alert(t('errorNoServiceWorker'))
            return
        }

        setIsLoading(true)

        try {
            const perm = await requestNotificationPermission()
            setPermission(perm)

            if (perm === 'granted') {
                const subscription = await subscribeToPushNotifications(registration)

                if (subscription) {
                    await sendSubscriptionToServer(subscription)
                    setIsSubscribed(true)

                    await sendTestNotification()
                }
            }
        } catch (error) {
            console.error('Error enabling notifications:', error)
            alert(t('errorEnabling'))
        } finally {
            setIsLoading(false)
        }
    }

    const handleDisableNotifications = async () => {
        if (!registration) return

        setIsLoading(true)

        try {
            await unsubscribeFromPushNotifications(registration)
            setIsSubscribed(false)
        } catch (error) {
            console.error('Error disabling notifications:', error)
            alert(t('errorDisabling'))
        } finally {
            setIsLoading(false)
        }
    }

    const handleTestNotification = async () => {
        await sendTestNotification()
    }

    const handlePreferenceChange = (key: keyof typeof preferences) => {
        setPreferences((prev) => ({
            ...prev,
            [key]: !prev[key]
        }))
    }

    if (!isSupported) {
        return (
            <div className="notifications-settings">
                <div className="notifications-header">
                    <MdNotifications className="notifications-icon" />
                    <div>
                        <h3 className="notifications-title">{t('title')}</h3>
                        <p className="notifications-subtitle">{t('subtitle')}</p>
                    </div>
                </div>
                <div className="notifications-not-supported">
                    <BiBellOff className="notifications-not-supported-icon" />
                    <p>{t('notSupported')}</p>
                </div>
            </div>
        )
    }

    return (
        <div className="notifications-settings">
            <div className="notifications-header">
                <MdNotifications className="notifications-icon" />
                <div>
                    <h3 className="notifications-title">{t('title')}</h3>
                    <p className="notifications-subtitle">{t('subtitle')}</p>
                </div>
            </div>

            <div
                className={`notifications-status ${isSubscribed ? 'notifications-status-enabled' : 'notifications-status-disabled'}`}>
                <div className="notifications-status-content">
                    {isSubscribed ? (
                        <>
                            <BiBell className="notifications-status-icon" />
                            <span>{t('statusEnabled')}</span>
                        </>
                    ) : (
                        <>
                            <BiBellOff className="notifications-status-icon" />
                            <span>{t('statusDisabled')}</span>
                        </>
                    )}
                </div>
            </div>

            {permission === 'denied' && (
                <div className="notifications-warning">
                    <p>{t('permissionDenied')}</p>
                    <p className="notifications-warning-hint">{t('permissionDeniedHint')}</p>
                </div>
            )}

            <div className="notifications-main-toggle">
                {!isSubscribed ? (
                    <button
                        onClick={handleEnableNotifications}
                        disabled={isLoading || permission === 'denied'}
                        className="notifications-enable-button">
                        <BiBell />
                        {isLoading ? t('enabling') : t('enable')}
                    </button>
                ) : (
                    <div className="notifications-enabled-actions">
                        <button
                            onClick={handleDisableNotifications}
                            disabled={isLoading}
                            className="notifications-disable-button">
                            <BiBellOff />
                            {isLoading ? t('disabling') : t('disable')}
                        </button>
                        <button
                            onClick={handleTestNotification}
                            className="notifications-test-button">
                            {t('sendTest')}
                        </button>
                    </div>
                )}
            </div>

            {isSubscribed && (
                <div className="notifications-preferences">
                    <h4 className="notifications-preferences-title">{t('preferences')}</h4>

                    <div className="notifications-preference-item">
                        <div className="notifications-preference-info">
                            <span className="notifications-preference-name">
                                {t('pref.orderUpdates')}
                            </span>
                            <span className="notifications-preference-desc">
                                {t('pref.orderUpdatesDesc')}
                            </span>
                        </div>
                        <button
                            onClick={() => handlePreferenceChange('orderUpdates')}
                            className={`notifications-toggle ${preferences.orderUpdates ? 'notifications-toggle-on' : ''}`}
                            aria-label={t('toggle')}>
                            <span className="notifications-toggle-slider"></span>
                        </button>
                    </div>

                    <div className="notifications-preference-item">
                        <div className="notifications-preference-info">
                            <span className="notifications-preference-name">
                                {t('pref.promotions')}
                            </span>
                            <span className="notifications-preference-desc">
                                {t('pref.promotionsDesc')}
                            </span>
                        </div>
                        <button
                            onClick={() => handlePreferenceChange('promotions')}
                            className={`notifications-toggle ${preferences.promotions ? 'notifications-toggle-on' : ''}`}
                            aria-label={t('toggle')}>
                            <span className="notifications-toggle-slider"></span>
                        </button>
                    </div>

                    <div className="notifications-preference-item">
                        <div className="notifications-preference-info">
                            <span className="notifications-preference-name">
                                {t('pref.loyaltyRewards')}
                            </span>
                            <span className="notifications-preference-desc">
                                {t('pref.loyaltyRewardsDesc')}
                            </span>
                        </div>
                        <button
                            onClick={() => handlePreferenceChange('loyaltyRewards')}
                            className={`notifications-toggle ${preferences.loyaltyRewards ? 'notifications-toggle-on' : ''}`}
                            aria-label={t('toggle')}>
                            <span className="notifications-toggle-slider"></span>
                        </button>
                    </div>

                    <div className="notifications-preference-item">
                        <div className="notifications-preference-info">
                            <span className="notifications-preference-name">
                                {t('pref.newFeatures')}
                            </span>
                            <span className="notifications-preference-desc">
                                {t('pref.newFeaturesDesc')}
                            </span>
                        </div>
                        <button
                            onClick={() => handlePreferenceChange('newFeatures')}
                            className={`notifications-toggle ${preferences.newFeatures ? 'notifications-toggle-on' : ''}`}
                            aria-label={t('toggle')}>
                            <span className="notifications-toggle-slider"></span>
                        </button>
                    </div>
                </div>
            )}

            <div className="notifications-info">
                <h5 className="notifications-info-title">{t('whatYoullReceive')}</h5>
                <ul className="notifications-info-list">
                    <li>🍔 {t('info.orderConfirmed')}</li>
                    <li>🚚 {t('info.outForDelivery')}</li>
                    <li>✅ {t('info.orderDelivered')}</li>
                    <li>🎁 {t('info.specialOffers')}</li>
                    <li>⭐ {t('info.loyaltyUpdates')}</li>
                </ul>
            </div>
        </div>
    )
}
