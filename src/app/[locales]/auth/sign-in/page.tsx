import { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'

import SignInForm from './form'

export async function generateMetadata(): Promise<Metadata> {
    const t = await getTranslations('Pages.Auth.SignIn')

    return {
        title: 'Sign In to Burger Builder | Access Your Custom Burger Account',
        description:
            'Sign in to your Burger Builder account to build custom burgers, track orders, earn loyalty points, and reorder your favorite burger creations.',
        keywords:
            'burger builder sign in, burger login, food ordering login, burger account, custom burger account',
        openGraph: {
            title: 'Sign In to Burger Builder',
            description:
                'Log in to build custom burgers, track your orders, and earn rewards.',
            url: 'https://app-burger-builder.vercel.app/en/auth/sign-in'
        }
    }
}

export default function SignInPage() {
    return (
        <div className="flex justify-center px-8 sm:px-16">
            <SignInForm />
        </div>
    )
}
