import { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'

import { SignUpForm } from './form'

export async function generateMetadata(): Promise<Metadata> {
    const t = await getTranslations('Pages.Auth.SignUp')

    return {
        title: t('title'),
        description: t('description')
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
