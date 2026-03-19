import { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'

import { SignUpForm } from './form'

export async function generateMetadata(): Promise<Metadata> {
    const t = await getTranslations('Pages.Auth.SignUp')

    return {
        title: 'Create Account | Burger Builder - Start Building Custom Burgers',
        description:
            'Join Burger Builder today! Create a free account to build custom burgers, save your favorite creations, earn loyalty points, and enjoy fast delivery.',
        keywords:
            'burger builder sign up, create burger account, register burger builder, food ordering sign up, custom burger account',
        openGraph: {
            title: 'Create Your Burger Builder Account',
            description:
                'Sign up free to build custom burgers, save favorites, and earn loyalty rewards.',
            url: 'https://app-burger-builder.vercel.app/en/auth/sign-up'
        }
    }
}

const Signup = () => {
    return (
        <div className="flex justify-center px-8 sm:px-16">
            <SignUpForm />
        </div>
    )
}

export default Signup
