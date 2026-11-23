'use client'

import React, { useEffect, useState } from 'react'
import { AlertTriangle, Bell, BellOff, CheckCircle2, Send } from 'lucide-react'
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

    const preferenceItems = [
        {
            key: 'orderUpdates' as const,
            name: t('pref.orderUpdates'),
            desc: t('pref.orderUpdatesDesc')
        },
        {
            key: 'promotions' as const,
            name: t('pref.promotions'),
            desc: t('pref.promotionsDesc')
        },
        {
            key: 'loyaltyRewards' as const,
            name: t('pref.loyaltyRewards'),
            desc: t('pref.loyaltyRewardsDesc')
        },
        {
            key: 'newFeatures' as const,
            name: t('pref.newFeatures'),
            desc: t('pref.newFeaturesDesc')
        }
    ]

    if (!isSupported) {
        return (
            <div className="rounded-2xl border border-zinc-200/80 bg-white p-10 text-center space-y-2.5">
                <BellOff size={32} className="mx-auto text-zinc-400" />
                <p className="text-sm font-medium text-zinc-500">{t('notSupported')}</p>
            </div>
        )
    }

    return (
        <div className="space-y-4">
            {/* Status & Main Toggle */}
            <div className="rounded-2xl border border-zinc-200/80 bg-white p-5 space-y-4">
                <div
                    className={`flex items-center justify-between gap-3 rounded-xl border px-4 py-3 ${
                        isSubscribed
                            ? 'border-emerald-200 bg-emerald-50/70 text-emerald-800'
                            : 'border-zinc-200/80 bg-zinc-50 text-zinc-600'
                    }`}>
                    <div className="flex items-center gap-2.5 text-sm font-medium">
                        {isSubscribed ? (
                            <CheckCircle2 size={17} className="text-emerald-600" />
                        ) : (
                            <BellOff size={17} className="text-zinc-400" />
                        )}
                        <span>{isSubscribed ? t('statusEnabled') : t('statusDisabled')}</span>
                    </div>
                </div>

                {permission === 'denied' && (
                    <div className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50/70 p-3.5 text-xs text-amber-900">
                        <AlertTriangle size={16} className="mt-0.5 shrink-0 text-amber-600" />
                        <div>
                            <p className="font-semibold">{t('permissionDenied')}</p>
                            <p className="mt-0.5 text-amber-800">{t('permissionDeniedHint')}</p>
                        </div>
                    </div>
                )}

                <div>
                    {!isSubscribed ? (
                        <button
                            type="button"
                            onClick={handleEnableNotifications}
                            disabled={isLoading || permission === 'denied'}
                            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-zinc-950 px-5 py-2.5 text-sm font-medium text-white hover:bg-zinc-800 transition-colors disabled:opacity-40 disabled:cursor-not-allowed">
                            <Bell size={15} />
                            <span>{isLoading ? t('enabling') : t('enable')}</span>
                        </button>
                    ) : (
                        <div className="flex flex-wrap gap-2.5">
                            <button
                                type="button"
                                onClick={handleTestNotification}
                                className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-zinc-950 px-4 py-2.5 text-sm font-medium text-white hover:bg-zinc-800 transition-colors">
                                <Send size={14} />
                                <span>{t('sendTest')}</span>
                            </button>
                            <button
                                type="button"
                                onClick={handleDisableNotifications}
                                disabled={isLoading}
                                className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-sm font-medium text-zinc-700 hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-colors">
                                <BellOff size={14} />
                                <span>{isLoading ? t('disabling') : t('disable')}</span>
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Preferences */}
            {isSubscribed && (
                <div className="rounded-2xl border border-zinc-200/80 bg-white p-5">
                    <h3 className="text-sm font-semibold text-zinc-950 mb-3">{t('preferences')}</h3>

                    <div className="divide-y divide-zinc-100">
                        {preferenceItems.map((item) => {
                            const enabled = preferences[item.key]
                            return (
                                <div
                                    key={item.key}
                                    className="flex items-center justify-between gap-4 py-3.5 first:pt-1 last:pb-1">
                                    <div>
                                        <p className="text-sm font-medium text-zinc-950">
                                            {item.name}
                                        </p>
                                        <p className="text-xs text-zinc-500">{item.desc}</p>
                                    </div>
                                    <button
                                        type="button"
                                        role="switch"
                                        aria-checked={enabled}
                                        aria-label={t('toggle')}
                                        onClick={() => handlePreferenceChange(item.key)}
                                        className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors ${
                                            enabled ? 'bg-zinc-950' : 'bg-zinc-200'
                                        }`}>
                                        <span
                                            className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
                                                enabled ? 'translate-x-6' : 'translate-x-1'
                                            }`}
                                        />
                                    </button>
                                </div>
                            )
                        })}
                    </div>
                </div>
            )}

            {/* Info */}
            <div className="rounded-2xl border border-zinc-200/80 bg-white p-5">
                <h3 className="text-sm font-semibold text-zinc-950 mb-3">{t('whatYoullReceive')}</h3>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-medium text-zinc-600">
                    <li className="rounded-xl border border-zinc-100 bg-zinc-50/70 px-3.5 py-2.5">
                        {t('info.orderConfirmed')}
                    </li>
                    <li className="rounded-xl border border-zinc-100 bg-zinc-50/70 px-3.5 py-2.5">
                        {t('info.outForDelivery')}
                    </li>
                    <li className="rounded-xl border border-zinc-100 bg-zinc-50/70 px-3.5 py-2.5">
                        {t('info.orderDelivered')}
                    </li>
                    <li className="rounded-xl border border-zinc-100 bg-zinc-50/70 px-3.5 py-2.5">
                        {t('info.specialOffers')}
                    </li>
                    <li className="rounded-xl border border-zinc-100 bg-zinc-50/70 px-3.5 py-2.5 sm:col-span-2">
                        {t('info.loyaltyUpdates')}
                    </li>
                </ul>
            </div>
        </div>
    )
}
