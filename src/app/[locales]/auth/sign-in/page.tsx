import { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'

import SignInForm from './form'

export async function generateMetadata(): Promise<Metadata> {
    const t = await getTranslations('Pages.Auth.SignIn')

    return {
        title: t('title'),
        description: t('description')
    }
}

export default function SignInPage() {
    return (
        <div className="flex justify-center px-8 sm:px-16">
            <SignInForm />
        </div>
    )
}
