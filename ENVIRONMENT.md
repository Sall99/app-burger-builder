# Environment Variables

This document describes all environment variables used in the Burger Builder application.

## Required Variables

These variables **must** be set for the application to work:

### `DATABASE_URL`

- **Description**: MongoDB connection string
- **Format**: `mongodb+srv://username:password@cluster.mongodb.net/database?retryWrites=true&w=majority`
- **Example**: `mongodb+srv://user:pass@cluster0.mongodb.net/burger-builder`
- **Where to get**: [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)

### `NEXTAUTH_URL`

- **Description**: The canonical URL of your site
- **Development**: `http://localhost:3000`
- **Production**: `https://yourdomain.com`
- **Important**: Must match your actual domain

### `NEXTAUTH_SECRET`

- **Description**: Secret used to encrypt JWT tokens
- **Generate**: `openssl rand -base64 32`
- **Example**: `your-secret-key-minimum-32-characters-long`
- **Security**: Never commit this to version control!

## OAuth Providers (Optional)

Configure these to enable social login:

### GitHub OAuth

#### `GITHUB_ID`

- **Description**: GitHub OAuth App Client ID
- **Where to get**:
    1. Go to GitHub Settings → Developer settings → OAuth Apps
    2. Create a new OAuth App
    3. Set Authorization callback URL to `http://localhost:3000/api/auth/callback/github`

#### `GITHUB_SECRET`

- **Description**: GitHub OAuth App Client Secret
- **Security**: Keep this secret!

### Google OAuth

#### `GOOGLE_ID`

- **Description**: Google OAuth 2.0 Client ID
- **Where to get**:
    1. Go to [Google Cloud Console](https://console.cloud.google.com/)
    2. Create a project → APIs & Services → Credentials
    3. Create OAuth 2.0 Client ID
    4. Add authorized redirect URI: `http://localhost:3000/api/auth/callback/google`

#### `GOOGLE_SECRET`

- **Description**: Google OAuth 2.0 Client Secret
- **Security**: Keep this secret!

## Payment (Optional)

### `NEXT_STRIPE_SECRET_KEY`

- **Description**: Stripe Secret API Key
- **Format**: `sk_test_...` (test) or `sk_live_...` (production)
- **Where to get**: [Stripe Dashboard](https://dashboard.stripe.com/apikeys)
- **Security**: Server-side only, never expose to client!

### `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`

- **Description**: Stripe Publishable API Key
- **Format**: `pk_test_...` (test) or `pk_live_...` (production)
- **Where to get**: [Stripe Dashboard](https://dashboard.stripe.com/apikeys)
- **Note**: Safe to expose to client (public key)

## Development

### `NODE_ENV`

- **Description**: Application environment
- **Values**: `development` | `production` | `test`
- **Default**: `development`
- **Note**: Set automatically by Next.js in most cases

## Optional: Analytics & Monitoring

### `NEXT_PUBLIC_GA_MEASUREMENT_ID`

- **Description**: Google Analytics Measurement ID
- **Format**: `G-XXXXXXXXXX`
- **Where to get**: Google Analytics → Admin → Data Streams

### `SENTRY_DSN`

- **Description**: Sentry error tracking DSN
- **Where to get**: [Sentry Project Settings](https://sentry.io/)

## Email Service (Not yet implemented)

These are placeholders for future email functionality:

- `EMAIL_SERVER_USER`
- `EMAIL_SERVER_PASSWORD`
- `EMAIL_SERVER_HOST`
- `EMAIL_SERVER_PORT`
- `EMAIL_FROM`

## Environment Files

### Local Development

- **File**: `.env.local`
- **Usage**: Local development overrides
- **Git**: Ignored (never commit!)

### Testing

- **File**: `.env.test`
- **Usage**: Testing environment
- **Git**: Ignored

### Production

- **Platform**: Set via hosting platform (Vercel, etc.)
- **Never** commit production secrets to git!

## Validation

The application automatically validates environment variables on startup:

```typescript
// Import the validation module
import { validateEnv } from '@/lib/env'

// Validate manually
const result = validateEnv()
if (!result.isValid) {
    console.error('Missing variables:', result.missing)
}
```

## Security Best Practices

1. **Never commit secrets** to version control
2. **Use different values** for development, staging, and production
3. **Rotate secrets regularly**, especially after team changes
4. **Use environment-specific** OAuth callbacks
5. **Enable 2FA** on all service accounts (GitHub, Google, Stripe, etc.)
6. **Monitor** secret access and usage
7. **Use secret managers** for production (AWS Secrets Manager, etc.)

## Troubleshooting

### Missing DATABASE_URL

```
Error: Missing required environment variables: DATABASE_URL
```

**Solution**: Add `DATABASE_URL` to your `.env.local` file

### NEXTAUTH_SECRET too short

```
Warning: NEXTAUTH_SECRET should be at least 32 characters long
```

**Solution**: Generate a new secret: `openssl rand -base64 32`

### OAuth Provider Not Working

```
Warning: No OAuth providers configured
```

**Solution**: Add at least one OAuth provider (GitHub or Google)

### Invalid MongoDB Connection String

```
Warning: DATABASE_URL should be a MongoDB connection string
```

**Solution**: Ensure your DATABASE_URL starts with `mongodb://` or `mongodb+srv://`

## Example Configuration

### Development (`.env.local`)

```bash
DATABASE_URL="mongodb://localhost:27017/burger-builder"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="generated-secret-key-32-chars-min"
GITHUB_ID="dev_github_client_id"
GITHUB_SECRET="dev_github_secret"
```

### Production (Hosting Platform)

```bash
DATABASE_URL="mongodb+srv://prod:secure@cluster.mongodb.net/prod-db"
NEXTAUTH_URL="https://burgerbuilder.com"
NEXTAUTH_SECRET="different-production-secret-key"
GITHUB_ID="prod_github_client_id"
GITHUB_SECRET="prod_github_secret"
NODE_ENV="production"
```

## Need Help?

- Check the [Next.js Environment Variables docs](https://nextjs.org/docs/basic-features/environment-variables)
- Review [NextAuth.js Configuration](https://next-auth.js.org/configuration/options)
- See [Prisma Connection Strings](https://www.prisma.io/docs/reference/database-reference/connection-urls)
