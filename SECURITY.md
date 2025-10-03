# Security

This document outlines the security measures implemented in the Burger Builder application.

## Table of Contents

- [Security Headers](#security-headers)
- [Authentication & Authorization](#authentication--authorization)
- [Rate Limiting](#rate-limiting)
- [Input Validation & Sanitization](#input-validation--sanitization)
- [Payment Security](#payment-security)
- [Error Handling](#error-handling)
- [Reporting Vulnerabilities](#reporting-vulnerabilities)

## Security Headers

The application implements several security headers via `next.config.js`:

### Implemented Headers

- **Strict-Transport-Security (HSTS)**
    - Forces HTTPS connections
    - `max-age=63072000; includeSubDomains; preload`

- **X-Frame-Options**
    - Prevents clickjacking attacks
    - Value: `SAMEORIGIN`

- **X-Content-Type-Options**
    - Prevents MIME type sniffing
    - Value: `nosniff`

- **X-XSS-Protection**
    - Enables browser XSS protection
    - Value: `1; mode=block`

- **Referrer-Policy**
    - Controls referrer information
    - Value: `origin-when-cross-origin`

- **Permissions-Policy**
    - Restricts browser features
    - Disables: camera, microphone, geolocation

## Authentication & Authorization

### NextAuth.js

- **Session Strategy**: JWT-based
- **Providers**:
    - Credentials (email/password with bcrypt)
    - GitHub OAuth
    - Google OAuth

### Password Security

- **Hashing**: bcrypt with 10 salt rounds
- **Minimum Length**: 8 characters
- **Storage**: Never store plain-text passwords

### Protected Routes

Middleware protects these routes (see `src/middleware.ts`):

- `/profile`
- `/orders`
- `/checkout`
- `/payment-confirm`

Unauthenticated users are redirected to `/auth/sign-in`.

## Rate Limiting

### Implementation

Rate limiting is implemented via `src/lib/rate-limit.ts` using in-memory storage.

**⚠️ Production Note**: Replace with Redis or similar for production use.

### Rate Limits

| Endpoint Type    | Limit        | Window   |
| ---------------- | ------------ | -------- |
| Authentication   | 5 requests   | 1 minute |
| Write Operations | 5 requests   | 1 minute |
| General API      | 30 requests  | 1 minute |
| Read Operations  | 100 requests | 1 minute |

### Protected Endpoints

- `POST /api/auth/sign-up` - 5 req/min
- `POST /api/create-payment-intent` - 5 req/min (recommended)
- Other sensitive endpoints (to be implemented)

### Response Headers

When rate limited, responses include:

- `Retry-After`: Seconds until reset
- `X-RateLimit-Limit`: Maximum requests allowed
- `X-RateLimit-Remaining`: Requests remaining
- `X-RateLimit-Reset`: Timestamp of rate limit reset

## Input Validation & Sanitization

### Sign-Up Validation

**src/app/api/auth/sign-up/route.ts:**

```typescript
- Email: Valid format check (regex)
- Password: Minimum 8 characters
- Name: Maximum 60 characters
- Input: Sanitized (removes < > characters)
- Email: Normalized to lowercase
```

### Payment Validation

**src/app/api/create-payment-intent/route.ts:**

```typescript
- Amount: Must be > 0 and ≤ $10,000
- Shipping Address: Required fields validation
- User: Must be authenticated
```

### Sanitization Function

```typescript
function sanitizeInput(input: string): string {
    return input.trim().replace(/[<>]/g, '')
}
```

**Applied to**:

- User names
- Email addresses
- All user-provided text

## Payment Security

### Stripe Integration

✅ **Secure Implementation**:

- Uses Stripe Checkout Sessions (recommended)
- No hardcoded test tokens
- Server-side only secret key
- Client receives session ID, not sensitive data

❌ **Removed**:

- Hardcoded `tok_visa` test token
- Direct charge creation with test token
- Hardcoded localhost URLs

### Payment Flow

1. Client requests payment session
2. Server validates user & amount
3. Server creates Stripe Checkout Session
4. Client redirects to Stripe-hosted page
5. Stripe handles payment securely
6. Webhook updates order status (recommended)

### Environment Variables

```bash
NEXT_STRIPE_SECRET_KEY=sk_test_...  # Server-side only
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...  # Client-safe
```

## Error Handling

### Best Practices

✅ **What We Do**:

- Log errors server-side for debugging
- Return generic error messages to clients
- Use appropriate HTTP status codes

❌ **What We Avoid**:

- Exposing stack traces
- Revealing database errors
- Leaking internal implementation details

### Examples

**Bad** (exposes internals):

```typescript
return NextResponse.json(
    {
        error: error.message // Could reveal DB structure
    },
    { status: 500 }
)
```

**Good** (generic message):

```typescript
console.error('Error creating user:', error) // Log server-side
return NextResponse.json(
    {
        error: 'Unable to create account. Please try again later.'
    },
    { status: 500 }
)
```

## Database Security

### Prisma Best Practices

- **Connection**: Uses connection pooling
- **Injection Prevention**: Parameterized queries (Prisma default)
- **Environment Variables**: Secure credential storage

### MongoDB

- **Authentication**: Required (via connection string)
- **Network**: Whitelist IP addresses
- **Encryption**: TLS/SSL for connections

## Content Security Policy (CSP)

**Status**: ⚠️ To be implemented

**Recommended** for future enhancement:

```javascript
headers: {
    'Content-Security-Policy':
        "default-src 'self'; " +
        "script-src 'self' 'unsafe-inline' 'unsafe-eval'; " +
        "style-src 'self' 'unsafe-inline';"
}
```

## Session Security

### NextAuth Configuration

```typescript
session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
}
```

### Cookies

- **httpOnly**: Yes (prevents XSS)
- **secure**: Yes in production (HTTPS only)
- **sameSite**: 'lax' (CSRF protection)

## API Security Checklist

When creating new API routes, ensure:

- [ ] Authentication required for sensitive operations
- [ ] Rate limiting applied
- [ ] Input validation implemented
- [ ] Input sanitization applied
- [ ] Proper error handling (no internal details exposed)
- [ ] Appropriate HTTP status codes
- [ ] CORS configured if needed

## Production Security Checklist

Before deploying to production:

### Environment

- [ ] All secrets rotated from development values
- [ ] `NODE_ENV=production` set
- [ ] Debug mode disabled
- [ ] Proper logging configured

### Authentication

- [ ] OAuth redirects point to production URLs
- [ ] Strong `NEXTAUTH_SECRET` (32+ characters)
- [ ] Session timeouts configured appropriately

### Infrastructure

- [ ] HTTPS enforced (HSTS header)
- [ ] Database backups configured
- [ ] Monitoring and alerting set up
- [ ] Rate limiting with Redis (not in-memory)

### Code

- [ ] Dependencies updated and scanned
- [ ] No hardcoded secrets or API keys
- [ ] Error messages don't expose internals
- [ ] Input validation on all endpoints

## Security Tools

### Development

```bash
# Audit dependencies
npm audit

# Fix vulnerabilities
npm audit fix

# Check for outdated packages
npm outdated
```

### Recommended Tools

- **Snyk**: Dependency scanning
- **OWASP ZAP**: Security testing
- **Dependabot**: Automated dependency updates
- **SonarQube**: Code quality and security

## Reporting Vulnerabilities

If you discover a security vulnerability, please:

1. **Do NOT** open a public issue
2. Email: security@your-domain.com (replace with actual)
3. Include:
    - Description of the vulnerability
    - Steps to reproduce
    - Potential impact
    - Suggested fix (if any)

We aim to respond within 48 hours.

## Security Updates

| Date    | Update                          |
| ------- | ------------------------------- |
| 2025-10 | Security headers implemented    |
| 2025-10 | Rate limiting added             |
| 2025-10 | Stripe hardcoded token removed  |
| 2025-10 | Input validation & sanitization |

## Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Next.js Security](https://nextjs.org/docs/app/building-your-application/configuring/security-headers)
- [Stripe Security](https://stripe.com/docs/security/guide)
- [NextAuth.js Security](https://next-auth.js.org/configuration/options#security)

---

**Last Updated**: October 2025

For questions about security, contact the development team.
