import { Metadata } from 'next'

import { SignUpForm } from './form'

export const metadata: Metadata = {
    title: 'Sign up',
    description: 'Sign up to create orders'
}

const Signup = () => {
    return (
        <div className="flex justify-center px-8 sm:px-16">
            <SignUpForm />
        </div>
    )
}

export default Signup
