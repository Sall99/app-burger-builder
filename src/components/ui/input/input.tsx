import { FC } from 'react'
import clsx from 'clsx'

export interface InputProps {
    classname?: string
    name: string
    type: 'text' | 'password' | 'email' | 'number' | 'date'
    placeholder: string
    value?: string
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
    disabled?: boolean
    register?: any
    required?: boolean
    errors?: any
    autoFocus?: boolean
    autoComplete?: string
    minLength?: number
    maxLength?: number
    min?: number
    max?: number
    step?: number
    pattern?: string
    id?: string
}

export const Input: FC<InputProps> = ({
    classname,
    type,
    placeholder,
    required,
    name,
    register,
    errors
}) => {
    return (
        <div className="mb-4">
            <div className="inputField">
                <input
                    type={type}
                    {...(register ? register(name, { required }) : { name, required })}
                    className={clsx(
                        'border-b border-gray-200 w-full outline-none focus:outline-none mb-4 text-gray-100',
                        [classname],
                        errors && errors[type] ? 'border-red-400 border-opacity-90' : ''
                    )}
                    placeholder=" "
                />
                <span className="text-sm">{placeholder}</span>
            </div>{' '}
            {errors && errors[name] && (
                <span className=" text-red-400 text-xs opacity-90">{errors[name].message}</span>
            )}
        </div>
    )
}
