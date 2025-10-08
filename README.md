# Burger Builder

Burger Builder is a web application that allows users to customize and build their perfect burger from a variety of fresh ingredients. Built with Next.js 14, Prisma, and MongoDB, this project demonstrates a modern, full-stack approach to web development.

## Table of Contents

- [Tech Stack](#tech-stack)
- [Features](#features)
- [Getting Started](#getting-started)
    - [Prerequisites](#prerequisites)
    - [Installation](#installation)
    - [Running the Application](#running-the-application)
- [Environment Variables](#environment-variables)
- [Testing](#testing)
- [Admin Panel](#admin-panel)
- [Database](#database)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

## Tech Stack

- **Next.js 14**: A React framework for server-side rendering, static site generation, and API routes.
- **Prisma**: A next-generation ORM for Node.js and TypeScript that simplifies database access and management.
- **MongoDB**: A NoSQL database for storing application data in a flexible, document-oriented format.
- **NextAuth.js**: Authentication and session management with role-based access control.
- **Tailwind CSS**: Utility-first CSS framework for responsive design.
- **TypeScript**: Type-safe JavaScript for better development experience.

## Features

- **Custom Burger Builder**: Create and customize your burger with a variety of ingredients.
- **Admin Panel**: Comprehensive admin dashboard for managing orders, users, and coupons.
- **User Role Management**: Role-based access control with admin and user permissions.
- **Multi-language Support**: Localized interface in English and French.
- **Responsive Design**: Optimized for both desktop and mobile devices.
- **Authentication**: Secure login and session management with role-based access.
- **SEO Optimization**: Enhanced with server-side rendering and dynamic meta tags.
- **Analytics**: Integrated with tools for performance and user behavior tracking.

## Getting Started

### Prerequisites

Ensure you have the following installed:

- [Node.js](https://nodejs.org/) (v16 or higher)
- [npm](https://www.npmjs.com/) or [Yarn](https://yarnpkg.com/)
- [MongoDB](https://www.mongodb.com/) (local or cloud instance)

### Installation

1. **Clone the repository**:

    ```bash
    git clone https://github.com/your-username/app-burger-builder.git
    cd app-burger-builder
    ```

2. **Install dependencies**:

    ```bash
    npm install
    ```

3. **Set up environment variables**:

    Copy the example environment file and update with your values:

    ```bash
    cp env.example .env.local
    ```

    See [Environment Variables](#environment-variables) section for details.

4. **Set up the database**:

    Generate Prisma client:

    ```bash
    npx prisma generate
    ```

    Push the database schema:

    ```bash
    npx prisma db push
    ```

### Running the Application

```bash
# Development mode
npm run dev

# Production build
npm run build
npm start

# Run tests
npm test

# Run E2E tests
npm run test:e2e
```

The application will be available at `http://localhost:3000`

## Environment Variables

This project uses environment variables for configuration. See **[ENVIRONMENT.md](./ENVIRONMENT.md)** for detailed documentation.

### Quick Start

1. Copy the example file:

    ```bash
    cp env.example .env.local
    ```

2. Update the following required variables:
    - `DATABASE_URL` - Your MongoDB connection string
    - `NEXTAUTH_SECRET` - Generate with: `openssl rand -base64 32`
    - `NEXTAUTH_URL` - `http://localhost:3000` for development

3. (Optional) Add OAuth credentials for social login:
    - GitHub: `GITHUB_ID`, `GITHUB_SECRET`
    - Google: `GOOGLE_ID`, `GOOGLE_SECRET`

### Admin Access

The application includes test credentials for easy development and testing:

- **Admin User**: `admin@test.com` / `admin123`
- **Regular User**: `user@test.com` / `user123`

These credentials are available in the sign-in and sign-up forms for testing purposes.

For complete documentation, see [ENVIRONMENT.md](./ENVIRONMENT.md)

## Testing

This project has comprehensive test coverage including unit tests, integration tests, and E2E tests.

See **[TESTING.md](./TESTING.md)** for detailed testing documentation.

### Quick Test Commands

```bash
# Run all unit tests
npm test

# Run tests with coverage
npm run test:coverage

# Run E2E tests
npm run test:e2e

# Run all tests (CI mode)
npm run test:all
```

**Current Coverage**: ~25% (51 tests passing)

## Admin Panel

The application includes a comprehensive admin panel accessible at `/admin` for users with admin roles.

### Admin Features

- **Dashboard**: Overview of key metrics and statistics
- **Order Management**: View, filter, and manage customer orders
- **User Management**: Manage user accounts and roles
- **Coupon Management**: Create and manage discount codes
- **Multi-language Support**: Admin interface available in English and French

### Admin Routes

- `/admin` - Main dashboard
- `/admin/orders` - Order management
- `/admin/users` - User management  
- `/admin/coupons` - Coupon management

### Access Control

- Admin routes are protected by middleware
- Only users with `admin` role can access admin features
- Regular users are redirected to the main application

## Database

This project uses **MongoDB** with **Prisma ORM**.

### Schema

- **User**: Authentication and profile data with role management (admin/user)
- **Account**: OAuth provider accounts
- **Order**: Order details with status tracking
- **Address**: Shipping addresses
- **Coupon**: Discount codes and promotional offers

### Prisma Commands

```bash
# Generate Prisma Client
npx prisma generate

# Push schema to database
npx prisma db push

# Open Prisma Studio (database GUI)
npx prisma studio

# Create a migration
npx prisma migrate dev --name your-migration-name
```

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import project in [Vercel](https://vercel.com)
3. Add environment variables in Vercel dashboard
4. Deploy!

### Environment Variables for Production

Make sure to set these in your hosting platform:

- `DATABASE_URL`
- `NEXTAUTH_URL` (your production URL)
- `NEXTAUTH_SECRET`
- OAuth credentials (if using social login)
- Stripe keys (if using payments)

See [ENVIRONMENT.md](./ENVIRONMENT.md) for complete list.

## Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Code Style

- Use TypeScript
- Follow ESLint rules
- Write tests for new features
- Use Conventional Commits

## License

This project is licensed under the MIT License.

## Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- Database: [MongoDB](https://www.mongodb.com/) with [Prisma](https://www.prisma.io/)
- Authentication: [NextAuth.js](https://next-auth.js.org/)
- Payments: [Stripe](https://stripe.com/)
- UI: [Tailwind CSS](https://tailwindcss.com/)

---

Made with ❤️ by the Burger Builder Team
