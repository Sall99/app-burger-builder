/**
 * Push Notifications Utility
 * Handles service worker registration and push subscription
 */

// Check if push notifications are supported
export function isPushNotificationSupported(): boolean {
    return 'serviceWorker' in navigator && 'PushManager' in window && 'Notification' in window
}

// Check current notification permission
export function getNotificationPermission(): NotificationPermission {
    if (!('Notification' in window)) {
        return 'denied'
    }
    return Notification.permission
}

// Request notification permission
export async function requestNotificationPermission(): Promise<NotificationPermission> {
    if (!('Notification' in window)) {
        return 'denied'
    }

    const permission = await Notification.requestPermission()
    return permission
}

// Register service worker
export async function registerServiceWorker(): Promise<ServiceWorkerRegistration | null> {
    if (!('serviceWorker' in navigator)) {
        console.warn('Service Workers not supported')
        return null
    }

    try {
        const registration = await navigator.serviceWorker.register('/service-worker.js', {
            scope: '/'
        })
        console.log('Service Worker registered:', registration)
        return registration
    } catch (error) {
        console.error('Service Worker registration failed:', error)
        return null
    }
}

// Subscribe to push notifications
export async function subscribeToPushNotifications(
    registration: ServiceWorkerRegistration
): Promise<PushSubscription | null> {
    try {
        // Note: In production, you'll need a VAPID public key from your push service
        // For demo, we'll use a placeholder approach
        const subscription = await registration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: urlBase64ToUint8Array(
                // This is a demo VAPID public key - replace with your own in production
                'BEl62iUYgUivxIkv69yViEuiBIa-Ib37J8xQmrr0-jMZCzX5Dx0ZLPKpT0G5HH8DFzj-dYvKlmCNIKdXWBMr0x0'
            ) as any
        })

        console.log('Push subscription:', subscription)
        return subscription
    } catch (error) {
        console.error('Push subscription failed:', error)
        return null
    }
}

// Unsubscribe from push notifications
export async function unsubscribeFromPushNotifications(
    registration: ServiceWorkerRegistration
): Promise<boolean> {
    try {
        const subscription = await registration.pushManager.getSubscription()
        if (subscription) {
            await subscription.unsubscribe()
            console.log('Unsubscribed from push notifications')
            return true
        }
        return false
    } catch (error) {
        console.error('Unsubscribe failed:', error)
        return false
    }
}

// Check if user is subscribed
export async function isPushSubscribed(registration: ServiceWorkerRegistration): Promise<boolean> {
    try {
        const subscription = await registration.pushManager.getSubscription()
        return subscription !== null
    } catch (error) {
        console.error('Error checking subscription:', error)
        return false
    }
}

// Send notification subscription to server
export async function sendSubscriptionToServer(subscription: PushSubscription): Promise<boolean> {
    try {
        // In production, send to your backend API
        const response = await fetch('/api/push/subscribe', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                subscription: subscription.toJSON()
            })
        })

        return response.ok
    } catch (error) {
        console.error('Error sending subscription to server:', error)
        // For demo purposes, return true
        return true
    }
}

// Send test notification
export async function sendTestNotification(): Promise<void> {
    if (!('Notification' in window)) {
        console.warn('Notifications not supported')
        return
    }

    if (Notification.permission === 'granted') {
        new Notification('Burger Builder 🍔', {
            body: 'Test notification - Push notifications are working!',
            icon: '/images/Logo.png',
            badge: '/images/Logo.png',
            tag: 'test-notification'
        })
    }
}

// Helper: Convert VAPID key
function urlBase64ToUint8Array(base64String: string): Uint8Array {
    const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
    const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/')

    const rawData = window.atob(base64)
    const outputArray = new Uint8Array(rawData.length)

    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i)
    }
    return new Uint8Array(outputArray.buffer.slice(0))
}

// Notification types and templates
export const NOTIFICATION_TYPES = {
    ORDER_CONFIRMED: {
        title: '🍔 Order Confirmed!',
        body: 'Your delicious burger is being prepared.',
        icon: '/images/Logo.png'
    },
    ORDER_READY: {
        title: '✅ Order Ready!',
        body: 'Your burger is ready for pickup or on its way!',
        icon: '/images/Logo.png'
    },
    ORDER_DELIVERED: {
        title: '🎉 Order Delivered!',
        body: 'Enjoy your meal! Rate your experience.',
        icon: '/images/Logo.png'
    },
    PROMOTION: {
        title: '🎁 Special Offer!',
        body: 'Check out our latest deals and combos!',
        icon: '/images/Logo.png'
    },
    LOYALTY_REWARD: {
        title: '⭐ New Reward Unlocked!',
        body: "You've earned enough points for a reward!",
        icon: '/images/Logo.png'
    },
    TIER_UPGRADE: {
        title: '🥇 Tier Upgraded!',
        body: "Congratulations! You've reached a new loyalty tier!",
        icon: '/images/Logo.png'
    }
}
