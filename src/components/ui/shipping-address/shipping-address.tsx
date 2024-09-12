'use client'

import React from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { useDispatch } from 'react-redux'
import { yupResolver } from '@hookform/resolvers/yup'
import Link from 'next/link'
import { useSession } from 'next-auth/react'

import { useAppSelector } from '@/redux/hook'
import { selectShippingAddress } from '@/redux/selectors/shipping-address'
import { addShippingAddress } from '@/redux/slices/shipping-address'
import { shippingAddressFormSchema } from '@/utils/yup.schema'

import { Button, Input } from '..'

type ShippingFormValues = {
    firstName: string
    lastName: string
    streetAddress: string
    town: string
}

interface ShippingAddressProps {
    handlePayment: () => void
    isOpen: boolean
}

export function ShippingAddress({ handlePayment, isOpen }: ShippingAddressProps) {
    const dispatch = useDispatch()
    const { shippingAddress } = useAppSelector(selectShippingAddress)
    const { data: session } = useSession()
    const isShippingAddressPresent = Object.values(shippingAddress).every((value) => value !== '')
    const {
        handleSubmit,
        register,
        formState: { errors }
    } = useForm<ShippingFormValues>({
        resolver: yupResolver(shippingAddressFormSchema),
        defaultValues: shippingAddress
    })

    const onSubmit: SubmitHandler<ShippingFormValues> = (data) => {
        dispatch(addShippingAddress(data))
    }

    if (!session) {
        return (
            <div className="p-4 rounded-md">
                <p className="flex flex-col gap-4">
                    <span className="text-primary-200 text-sm">
                        You should be logged in to make an order.
                    </span>
                    <Link href="/auth/sign-in" className="text-sm underline">
                        Go to login page
                    </Link>
                </p>
            </div>
        )
    }

    return (
        <div className="shipping-address">
            <form onSubmit={handleSubmit(onSubmit)} aria-live="polite">
                <div className="flex gap-8">
                    <Input
                        name="firstName"
                        type="text"
                        placeholder="First name"
                        register={register}
                        errors={errors}
                        aria-invalid={!!errors.firstName}
                    />
                    <Input
                        name="lastName"
                        type="text"
                        placeholder="Last name"
                        register={register}
                        errors={errors}
                        aria-invalid={!!errors.lastName}
                    />
                </div>
                <Input
                    name="streetAddress"
                    type="text"
                    placeholder="Street address"
                    register={register}
                    errors={errors}
                    aria-invalid={!!errors.streetAddress}
                />
                <Input
                    name="town"
                    type="text"
                    placeholder="Town/City"
                    register={register}
                    errors={errors}
                    aria-invalid={!!errors.town}
                />

                <Button
                    type="submit"
                    label={isShippingAddressPresent ? 'Proceed to payment' : 'Add shipping address'}
                    className="w-full h-10"
                    onClick={isShippingAddressPresent ? handlePayment : undefined}
                />
            </form>
        </div>
    )
}
