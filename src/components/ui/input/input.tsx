'use client'
import { FC } from 'react'
import clsx from 'clsx'

export interface InputProps {
    classname?: string
    name: string
    type: 'text' | 'password' | 'email' | 'number' | 'date'
    placeholder: string
    value?: string
    defaultValue?: string
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
    errors,
    autoComplete,
    value,
    defaultValue,
    onChange,
    disabled,
    autoFocus,
    minLength,
    maxLength,
    min,
    max,
    step,
    pattern,
    id
}) => {
    const hasError = errors && errors[name]
    const errorMessage = hasError ? errors[name].message : ''
    const inputClass = clsx(
        'border-b border-gray-200 w-full outline-none focus:outline-none mb-4 text-gray-100',
        {
            'border-red-400 border-opacity-90': hasError,
            'bg-gray-100 cursor-not-allowed': disabled
        },
        classname
    )

    return (
        <div className="mb-4">
            <div className="inputField relative">
                <input
                    id={id || name}
                    type={type}
                    {...(register ? register(name) : { onChange })}
                    className={inputClass}
                    placeholder=" "
                    autoComplete={autoComplete}
                    value={value}
                    defaultValue={defaultValue}
                    required={required}
                    disabled={disabled}
                    autoFocus={autoFocus}
                    minLength={minLength}
                    maxLength={maxLength}
                    min={min}
                    max={max}
                    step={step}
                    pattern={pattern}
                    aria-invalid={hasError ? 'true' : 'false'}
                    aria-describedby={hasError ? `${name}-error` : undefined}
                />
                <label
                    htmlFor={id || name}
                    className="absolute left-0 top-0 text-sm text-gray-400 transition-all pointer-events-none">
                    {placeholder}
                </label>
            </div>
            {hasError && (
                <span id={`${name}-error`} className="text-red-400 text-xs opacity-90">
                    {errorMessage}
                </span>
            )}
        </div>
    )
}
