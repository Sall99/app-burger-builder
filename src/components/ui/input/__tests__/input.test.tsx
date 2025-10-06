import { useForm } from 'react-hook-form'
import { render, screen } from '@testing-library/react'

import { Input } from '../input'

const TestInputWrapper = ({ type = 'text', placeholder = 'Test Input', name = 'test' }) => {
    const {
        register,
        formState: { errors }
    } = useForm()

    return (
        <Input
            name={name}
            type={type as 'text' | 'number' | 'password' | 'email' | 'date'}
            placeholder={placeholder}
            register={register}
            errors={errors}
        />
    )
}

describe('Input Component', () => {
    it('should render input with label', () => {
        render(<TestInputWrapper placeholder="Enter email" />)
        expect(screen.getByLabelText('Enter email')).toBeInTheDocument()
    })

    it('should render input with correct type', () => {
        render(<TestInputWrapper type="email" placeholder="Email" />)
        const input = screen.getByLabelText('Email')
        expect(input).toHaveAttribute('type', 'email')
    })

    it('should render password input', () => {
        render(<TestInputWrapper type="password" placeholder="Password" />)
        const input = screen.getByLabelText('Password')
        expect(input).toHaveAttribute('type', 'password')
    })

    it('should render text input by default', () => {
        render(<TestInputWrapper placeholder="Name" />)
        const input = screen.getByLabelText('Name')
        expect(input).toHaveAttribute('type', 'text')
    })

    it('should render with correct name attribute', () => {
        render(<TestInputWrapper name="email" placeholder="Email" />)
        const input = screen.getByLabelText('Email')
        expect(input).toHaveAttribute('name', 'email')
    })
})
