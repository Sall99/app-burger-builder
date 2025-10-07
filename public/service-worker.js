/* eslint-disable no-restricted-globals */
/**
 * Service Worker for Push Notifications
 * Handles push events and notification clicks
 */

// Service worker version
const CACHE_VERSION = 'v1'

self.addEventListener('install', (event) => {
    console.log('[Service Worker] Installing...')
    self.skipWaiting()
})

self.addEventListener('activate', (event) => {
    console.log('[Service Worker] Activating...')
    event.waitUntil(self.clients.claim())
})

// Push event - receive notification
self.addEventListener('push', (event) => {
    console.log('[Service Worker] Push received')

    let notificationData = {
        title: 'Burger Builder',
        body: 'You have a new notification!',
        icon: '/images/Logo.png',
        badge: '/images/Logo.png',
        data: {
            url: '/'
        }
    }

    // Parse push data if available
    if (event.data) {
        try {
            const data = event.data.json()
            notificationData = {
                title: data.title || notificationData.title,
                body: data.body || notificationData.body,
                icon: data.icon || notificationData.icon,
                badge: data.badge || notificationData.badge,
                tag: data.tag || 'default',
                requireInteraction: data.requireInteraction || false,
                data: {
                    url: data.url || '/',
                    orderId: data.orderId,
                    type: data.type
                }
            }
        } catch (e) {
            console.error('[Service Worker] Error parsing push data:', e)
        }
    }

    // Show notification
    const promiseChain = self.registration.showNotification(notificationData.title, {
        body: notificationData.body,
        icon: notificationData.icon,
        badge: notificationData.badge,
        tag: notificationData.tag,
        requireInteraction: notificationData.requireInteraction,
        data: notificationData.data,
        actions: [
            {
                action: 'view',
                title: 'View'
            },
            {
                action: 'close',
                title: 'Close'
            }
        ]
    })

    event.waitUntil(promiseChain)
})

// Notification click event
self.addEventListener('notificationclick', (event) => {
    console.log('[Service Worker] Notification clicked')

    event.notification.close()

    if (event.action === 'close') {
        return
    }

    // Open the app
    const urlToOpen = event.notification.data?.url || '/'

    event.waitUntil(
        self.clients
            .matchAll({
                type: 'window',
                includeUncontrolled: true
            })
            .then((clientList) => {
                // Check if app is already open
                for (let i = 0; i < clientList.length; i++) {
                    const client = clientList[i]
                    if (client.url === urlToOpen && 'focus' in client) {
                        return client.focus()
                    }
                }
                // Open new window
                if (self.clients.openWindow) {
                    return self.clients.openWindow(urlToOpen)
                }
            })
    )
})

// Background sync (optional - for offline order queue)
self.addEventListener('sync', (event) => {
    console.log('[Service Worker] Background sync:', event.tag)

    if (event.tag === 'sync-orders') {
        event.waitUntil(syncOrders())
    }
})

async function syncOrders() {
    // Placeholder for syncing orders when back online
    console.log('[Service Worker] Syncing orders...')
}
