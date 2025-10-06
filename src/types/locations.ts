/**
 * Restaurant Locations System
 * Store locations with Google Maps integration
 */

export interface RestaurantLocation {
    id: string
    name: string
    address: string
    city: string
    state: string
    zipCode: string
    country: string
    phone: string
    email: string
    coordinates: {
        lat: number
        lng: number
    }
    hours: {
        monday: string
        tuesday: string
        wednesday: string
        thursday: string
        friday: string
        saturday: string
        sunday: string
    }
    features: string[]
    image?: string
    rating?: number
    reviewCount?: number
}

/**
 * Mock Restaurant Locations
 * In production, fetch from API or database
 */
export const RESTAURANT_LOCATIONS: RestaurantLocation[] = [
    {
        id: 'location-1',
        name: 'Burger Builder Downtown',
        address: '123 Main Street',
        city: 'New York',
        state: 'NY',
        zipCode: '10001',
        country: 'USA',
        phone: '(212) 555-0100',
        email: 'downtown@burgerbuilder.com',
        coordinates: {
            lat: 40.7589,
            lng: -73.9851
        },
        hours: {
            monday: '10:00 AM - 10:00 PM',
            tuesday: '10:00 AM - 10:00 PM',
            wednesday: '10:00 AM - 10:00 PM',
            thursday: '10:00 AM - 10:00 PM',
            friday: '10:00 AM - 11:00 PM',
            saturday: '10:00 AM - 11:00 PM',
            sunday: '11:00 AM - 9:00 PM'
        },
        features: ['Drive-thru', 'Dine-in', 'Takeout', 'Delivery', 'Wi-Fi'],
        image: '/images/burger-empy.png',
        rating: 4.5,
        reviewCount: 234
    },
    {
        id: 'location-2',
        name: 'Burger Builder Midtown',
        address: '456 5th Avenue',
        city: 'New York',
        state: 'NY',
        zipCode: '10018',
        country: 'USA',
        phone: '(212) 555-0200',
        email: 'midtown@burgerbuilder.com',
        coordinates: {
            lat: 40.7549,
            lng: -73.984
        },
        hours: {
            monday: '9:00 AM - 11:00 PM',
            tuesday: '9:00 AM - 11:00 PM',
            wednesday: '9:00 AM - 11:00 PM',
            thursday: '9:00 AM - 11:00 PM',
            friday: '9:00 AM - 12:00 AM',
            saturday: '9:00 AM - 12:00 AM',
            sunday: '10:00 AM - 10:00 PM'
        },
        features: ['Dine-in', 'Takeout', 'Delivery', 'Wi-Fi', 'Outdoor Seating'],
        image: '/images/burger-empy.png',
        rating: 4.7,
        reviewCount: 456
    },
    {
        id: 'location-3',
        name: 'Burger Builder Brooklyn',
        address: '789 Bedford Avenue',
        city: 'Brooklyn',
        state: 'NY',
        zipCode: '11249',
        country: 'USA',
        phone: '(718) 555-0300',
        email: 'brooklyn@burgerbuilder.com',
        coordinates: {
            lat: 40.7081,
            lng: -73.9571
        },
        hours: {
            monday: '11:00 AM - 10:00 PM',
            tuesday: '11:00 AM - 10:00 PM',
            wednesday: '11:00 AM - 10:00 PM',
            thursday: '11:00 AM - 10:00 PM',
            friday: '11:00 AM - 11:00 PM',
            saturday: '11:00 AM - 11:00 PM',
            sunday: '11:00 AM - 9:00 PM'
        },
        features: ['Dine-in', 'Takeout', 'Delivery', 'Wi-Fi', 'Live Music'],
        image: '/images/burger-empy.png',
        rating: 4.8,
        reviewCount: 567
    },
    {
        id: 'location-4',
        name: 'Burger Builder Queens',
        address: '321 Queens Boulevard',
        city: 'Queens',
        state: 'NY',
        zipCode: '11375',
        country: 'USA',
        phone: '(718) 555-0400',
        email: 'queens@burgerbuilder.com',
        coordinates: {
            lat: 40.7282,
            lng: -73.814
        },
        hours: {
            monday: '10:00 AM - 10:00 PM',
            tuesday: '10:00 AM - 10:00 PM',
            wednesday: '10:00 AM - 10:00 PM',
            thursday: '10:00 AM - 10:00 PM',
            friday: '10:00 AM - 11:00 PM',
            saturday: '10:00 AM - 11:00 PM',
            sunday: '11:00 AM - 9:00 PM'
        },
        features: ['Drive-thru', 'Dine-in', 'Takeout', 'Delivery', 'Parking'],
        image: '/images/burger-empy.png',
        rating: 4.6,
        reviewCount: 389
    }
]

/**
 * Calculate distance between two coordinates (Haversine formula)
 */
export function calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
    const R = 3959 // Earth's radius in miles
    const dLat = toRad(lat2 - lat1)
    const dLng = toRad(lng2 - lng1)

    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) * Math.sin(dLng / 2)

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    const distance = R * c

    return Math.round(distance * 10) / 10 // Round to 1 decimal
}

function toRad(degrees: number): number {
    return degrees * (Math.PI / 180)
}

/**
 * Find nearest location to user coordinates
 */
export function findNearestLocation(
    userLat: number,
    userLng: number,
    locations: RestaurantLocation[] = RESTAURANT_LOCATIONS
): RestaurantLocation | null {
    if (locations.length === 0) return null

    let nearest = locations[0]
    let minDistance = calculateDistance(
        userLat,
        userLng,
        locations[0].coordinates.lat,
        locations[0].coordinates.lng
    )

    for (let i = 1; i < locations.length; i++) {
        const distance = calculateDistance(
            userLat,
            userLng,
            locations[i].coordinates.lat,
            locations[i].coordinates.lng
        )
        if (distance < minDistance) {
            minDistance = distance
            nearest = locations[i]
        }
    }

    return nearest
}

/**
 * Get locations sorted by distance from user
 */
export function getLocationsByDistance(
    userLat: number,
    userLng: number,
    locations: RestaurantLocation[] = RESTAURANT_LOCATIONS
): Array<RestaurantLocation & { distance: number }> {
    return locations
        .map((location) => ({
            ...location,
            distance: calculateDistance(
                userLat,
                userLng,
                location.coordinates.lat,
                location.coordinates.lng
            )
        }))
        .sort((a, b) => a.distance - b.distance)
}

/**
 * Get location by ID
 */
export function getLocationById(id: string): RestaurantLocation | undefined {
    return RESTAURANT_LOCATIONS.find((loc) => loc.id === id)
}

/**
 * Format address for display
 */
export function formatAddress(location: RestaurantLocation): string {
    return `${location.address}, ${location.city}, ${location.state} ${location.zipCode}`
}

/**
 * Get Google Maps URL for directions
 */
export function getDirectionsUrl(location: RestaurantLocation): string {
    const address = formatAddress(location)
    return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(address)}`
}

