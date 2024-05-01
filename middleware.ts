import createMiddleware from 'next-intl/middleware'

const middleware = createMiddleware({
    locales: ['en', 'fr'],
    defaultLocale: 'en'
})

export default middleware

export const config = {
    matcher: ['/', '/(en|fr)/:page*']
}
