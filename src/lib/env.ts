/**
 * Environment Variable Validation
 * Validates required environment variables at build/runtime
 */

const requiredEnvVars = ['DATABASE_URL', 'NEXTAUTH_SECRET', 'NEXTAUTH_URL'] as const

const optionalEnvVars = [
    'GITHUB_ID',
    'GITHUB_SECRET',
    'GOOGLE_ID',
    'GOOGLE_SECRET',
    'NEXT_STRIPE_SECRET_KEY',
    'NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY',
    'NODE_ENV'
] as const

type RequiredEnvVar = (typeof requiredEnvVars)[number]
type OptionalEnvVar = (typeof optionalEnvVars)[number]
type EnvVar = RequiredEnvVar | OptionalEnvVar

interface ValidationResult {
    isValid: boolean
    missing: string[]
    warnings: string[]
}

/**
 * Validates that all required environment variables are set
 */
export function validateEnv(): ValidationResult {
    const missing: string[] = []
    const warnings: string[] = []

    // Check required variables
    for (const envVar of requiredEnvVars) {
        if (!process.env[envVar]) {
            missing.push(envVar)
        }
    }

    // Check optional but recommended variables
    for (const envVar of optionalEnvVars) {
        if (!process.env[envVar]) {
            warnings.push(`Optional: ${envVar} is not set`)
        }
    }

    // Validate DATABASE_URL format
    if (process.env.DATABASE_URL && !process.env.DATABASE_URL.startsWith('mongodb')) {
        warnings.push('DATABASE_URL should be a MongoDB connection string')
    }

    // Validate NEXTAUTH_SECRET length
    if (process.env.NEXTAUTH_SECRET && process.env.NEXTAUTH_SECRET.length < 32) {
        warnings.push('NEXTAUTH_SECRET should be at least 32 characters long for security')
    }

    // Check if OAuth is properly configured
    const hasGitHub = process.env.GITHUB_ID && process.env.GITHUB_SECRET
    const hasGoogle = process.env.GOOGLE_ID && process.env.GOOGLE_SECRET

    if (!hasGitHub && !hasGoogle) {
        warnings.push(
            'No OAuth providers configured. Users can only use email/password authentication.'
        )
    }

    const isValid = missing.length === 0

    return {
        isValid,
        missing,
        warnings
    }
}

/**
 * Gets an environment variable with type safety
 */
export function getEnvVar(key: EnvVar, fallback?: string): string {
    const value = process.env[key]

    if (!value) {
        if (fallback !== undefined) {
            return fallback
        }
        if (requiredEnvVars.includes(key as RequiredEnvVar)) {
            throw new Error(`Required environment variable ${key} is not set`)
        }
        return ''
    }

    return value
}

/**
 * Gets the current environment
 */
export function getEnvironment(): 'development' | 'production' | 'test' {
    const env = process.env.NODE_ENV || 'development'
    if (env === 'production' || env === 'test') {
        return env
    }
    return 'development'
}

/**
 * Checks if we're in production
 */
export function isProduction(): boolean {
    return getEnvironment() === 'production'
}

/**
 * Checks if we're in development
 */
export function isDevelopment(): boolean {
    return getEnvironment() === 'development'
}

/**
 * Checks if we're in test environment
 */
export function isTest(): boolean {
    return getEnvironment() === 'test'
}

// Validate environment variables on module load (only in Node.js environment)
if (typeof window === 'undefined') {
    const result = validateEnv()

    if (!result.isValid) {
        console.error('❌ Missing required environment variables:')
        result.missing.forEach((key) => console.error(`  - ${key}`))

        if (!isTest()) {
            throw new Error('Missing required environment variables. Check your .env file.')
        }
    }

    if (result.warnings.length > 0 && isDevelopment()) {
        console.warn('⚠️  Environment warnings:')
        result.warnings.forEach((warning) => console.warn(`  - ${warning}`))
    }

    if (result.isValid && isDevelopment()) {
        console.log('✅ Environment variables validated successfully')
    }
}
