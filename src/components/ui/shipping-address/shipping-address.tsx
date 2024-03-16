'use client'
import React from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { useDispatch } from 'react-redux'
import { useAppSelector } from '@/redux/hook'
import { shippingAddressFormSchema } from '@/utils/yup.schema'

import { Button, Input } from '..'
import { addShippingAddress } from '@/redux/slices/shipping-address'
import { selectShippingAddress } from '@/redux/selectors/shipping-address'

type ShippingFormValues = {
    firstName: string
    lastName: string
    streetAddress: string
    town: string
}
interface ShippingAddressProps {
    handlePayment: () => void
}

export function ShippingAddress({ handlePayment }: ShippingAddressProps) {
    const dispatch = useDispatch()
    const { shippingAddress } = useAppSelector(selectShippingAddress)

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

    return (
        <div>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="flex gap-8">
                    <Input
                        name="firstName"
                        type="text"
                        placeholder="First name"
                        register={register}
                        errors={errors}
                    />
                    <Input
                        name="lastName"
                        type="text"
                        placeholder="Last name"
                        register={register}
                        errors={errors}
                    />
                </div>
                <Input
                    name="streetAddress"
                    type="text"
                    placeholder="Street address"
                    register={register}
                    errors={errors}
                />
                <Input
                    name="town"
                    type="text"
                    placeholder="Town/City"
                    register={register}
                    errors={errors}
                />

                {isShippingAddressPresent ? (
                    <Button
                        type="submit"
                        label="Proceed to payment"
                        className="w-full h-10"
                        onClick={handlePayment}
                    />
                ) : (
                    <Button type="submit" label="Add shipping address" className="w-full h-10" />
                )}
            </form>
        </div>
    )
}
