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
        name: 'The Gourmet Patty',
        address: '123 Main Street',
        city: 'New York',
        state: 'NY',
        zipCode: '10001',
        country: 'USA',
        phone: '(212) 555-0100',
        email: 'hello@gourmetpatty.com',
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
        name: 'Bun & Beyond',
        address: '456 5th Avenue',
        city: 'New York',
        state: 'NY',
        zipCode: '10018',
        country: 'USA',
        phone: '(212) 555-0200',
        email: 'info@bunbeyond.com',
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
        name: 'Sizzle Shack',
        address: '789 Bedford Avenue',
        city: 'Brooklyn',
        state: 'NY',
        zipCode: '11249',
        country: 'USA',
        phone: '(718) 555-0300',
        email: 'contact@sizzleshack.com',
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
        name: 'Flippin Good',
        address: '321 Queens Boulevard',
        city: 'Queens',
        state: 'NY',
        zipCode: '11375',
        country: 'USA',
        phone: '(718) 555-0400',
        email: 'hello@flippingood.com',
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
    },
    {
        id: 'location-5',
        name: 'Grilled & Thrilled',
        address: '234 Lexington Ave',
        city: 'New York',
        state: 'NY',
        zipCode: '10016',
        country: 'USA',
        phone: '(212) 555-0500',
        email: 'info@grilledthrilled.com',
        coordinates: {
            lat: 40.7484,
            lng: -73.9857
        },
        hours: {
            monday: '11:00 AM - 10:00 PM',
            tuesday: '11:00 AM - 10:00 PM',
            wednesday: '11:00 AM - 10:00 PM',
            thursday: '11:00 AM - 10:00 PM',
            friday: '11:00 AM - 12:00 AM',
            saturday: '11:00 AM - 12:00 AM',
            sunday: '12:00 PM - 9:00 PM'
        },
        features: ['Dine-in', 'Takeout', 'Delivery', 'Wi-Fi', 'Rooftop Dining'],
        image: '/images/burger-empy.png',
        rating: 4.9,
        reviewCount: 678
    },
    {
        id: 'location-6',
        name: 'Patty Paradise',
        address: '567 Broadway',
        city: 'New York',
        state: 'NY',
        zipCode: '10012',
        country: 'USA',
        phone: '(212) 555-0600',
        email: 'hello@pattyparadise.com',
        coordinates: {
            lat: 40.7233,
            lng: -73.9966
        },
        hours: {
            monday: '10:00 AM - 11:00 PM',
            tuesday: '10:00 AM - 11:00 PM',
            wednesday: '10:00 AM - 11:00 PM',
            thursday: '10:00 AM - 11:00 PM',
            friday: '10:00 AM - 1:00 AM',
            saturday: '10:00 AM - 1:00 AM',
            sunday: '11:00 AM - 10:00 PM'
        },
        features: ['Dine-in', 'Takeout', 'Delivery', 'Wi-Fi', 'Craft Beers', 'Vegan Options'],
        image: '/images/burger-empy.png',
        rating: 4.7,
        reviewCount: 445
    },
    {
        id: 'location-7',
        name: 'The Juicy Joint',
        address: '890 Atlantic Avenue',
        city: 'Brooklyn',
        state: 'NY',
        zipCode: '11238',
        country: 'USA',
        phone: '(718) 555-0700',
        email: 'contact@juicyjoint.com',
        coordinates: {
            lat: 40.6782,
            lng: -73.9442
        },
        hours: {
            monday: '11:00 AM - 10:00 PM',
            tuesday: '11:00 AM - 10:00 PM',
            wednesday: '11:00 AM - 10:00 PM',
            thursday: '11:00 AM - 10:00 PM',
            friday: '11:00 AM - 11:00 PM',
            saturday: '11:00 AM - 11:00 PM',
            sunday: '12:00 PM - 9:00 PM'
        },
        features: ['Dine-in', 'Takeout', 'Delivery', 'Parking', 'Family Friendly'],
        image: '/images/burger-empy.png',
        rating: 4.6,
        reviewCount: 512
    },
    {
        id: 'location-8',
        name: 'Melt My Heart',
        address: '432 Park Avenue South',
        city: 'New York',
        state: 'NY',
        zipCode: '10016',
        country: 'USA',
        phone: '(212) 555-0800',
        email: 'hello@meltmyheart.com',
        coordinates: {
            lat: 40.745,
            lng: -73.983
        },
        hours: {
            monday: '10:30 AM - 10:30 PM',
            tuesday: '10:30 AM - 10:30 PM',
            wednesday: '10:30 AM - 10:30 PM',
            thursday: '10:30 AM - 10:30 PM',
            friday: '10:30 AM - 11:30 PM',
            saturday: '10:30 AM - 11:30 PM',
            sunday: '11:00 AM - 9:30 PM'
        },
        features: ['Dine-in', 'Takeout', 'Delivery', 'Wi-Fi', 'Gluten-Free Options'],
        image: '/images/burger-empy.png',
        rating: 4.8,
        reviewCount: 621
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

    return Math.round(distance * 10) / 10
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
