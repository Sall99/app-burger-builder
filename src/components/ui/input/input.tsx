'use client';
import { FC } from 'react';
import clsx from 'clsx';

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
    const hasError = errors && errors[name];
    const errorMessage = hasError ? errors[name].message : '';
    const inputClass = clsx(
        'block w-full px-2 py-2 pt-5 rounded-md border bg-white text-gray-100 focus:outline-none focus:ring-1 focus:ring-primary-100 focus:border-primary-100 transition-all text-sm',
        {
            'border-red-400 focus:ring-red-200': hasError,
            'border-gray-200': !hasError,
            'bg-gray-50 text-gray-400 cursor-not-allowed': disabled
        },
        classname
    );

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
                <span className="text-gray-300 text-sm px-2">
                    {placeholder}
                </span>
            </div>
            {hasError && (
                <div className="mt-1">
                    <span id={`${name}-error`} className="text-red-500 text-xs">
                        {errorMessage}
                    </span>
                </div>
            )}
        </div>
    );
};
