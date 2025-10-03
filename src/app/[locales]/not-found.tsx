import Link from 'next/link'

/**
 * Next.js 404 Not Found Page
 */
export default function NotFound() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12">
            <div className="max-w-md w-full text-center">
                <div className="mb-8">
                    <svg
                        className="mx-auto h-20 w-20 text-gray-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        aria-hidden="true">
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M12 12h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                    </svg>
                </div>

                <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>

                <h2 className="text-2xl font-semibold text-gray-700 mb-4">Page Not Found</h2>

                <p className="text-gray-600 mb-8">
                    Sorry, we couldn&apos;t find the page you&apos;re looking for. The page might
                    have been moved or deleted.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link
                        href="/"
                        className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors">
                        Go Home
                    </Link>
                    <button
                        onClick={() => window.history.back()}
                        className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors">
                        Go Back
                    </button>
                </div>

                <div className="mt-12">
                    <p className="text-sm text-gray-500 mb-4">Looking for something?</p>
                    <div className="flex flex-col gap-2 text-sm">
                        <Link
                            href="/"
                            className="text-blue-600 hover:text-blue-700 hover:underline">
                            Build a Burger
                        </Link>
                        <Link
                            href="/history"
                            className="text-blue-600 hover:text-blue-700 hover:underline">
                            Order History
                        </Link>
                        <Link
                            href="/profile"
                            className="text-blue-600 hover:text-blue-700 hover:underline">
                            Your Profile
                        </Link>
                        <Link
                            href="/help"
                            className="text-blue-600 hover:text-blue-700 hover:underline">
                            Help & Support
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}
