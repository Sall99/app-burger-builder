import { Metadata } from 'next'

import SignInForm from './form'

export const metadata: Metadata = {
    title: 'Sign In',
    description: 'Sign in to your account'
}

export default function SignInPage() {
    return (
        <div className="flex justify-center px-8 sm:px-16">
            <SignInForm />
        </div>
    )
}
