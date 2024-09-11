'use client';
import React from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { yupResolver } from '@hookform/resolvers/yup';
import Link from 'next/link';

import { useAppSelector } from '@/redux/hook';
import { selectCurrentUser } from '@/redux/selectors/current-user';
import { selectShippingAddress } from '@/redux/selectors/shipping-address';
import { addShippingAddress } from '@/redux/slices/shipping-address';
import { shippingAddressFormSchema } from '@/utils/yup.schema';

import { Button, Input } from '..';

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
    const dispatch = useDispatch();
    const { shippingAddress } = useAppSelector(selectShippingAddress);
    const currentUser = useSelector(selectCurrentUser);
    const isShippingAddressPresent = Object.values(shippingAddress).every((value) => value !== '');
    const {
        handleSubmit,
        register,
        formState: { errors }
    } = useForm<ShippingFormValues>({
        resolver: yupResolver(shippingAddressFormSchema),
        defaultValues: shippingAddress
    });

    const onSubmit: SubmitHandler<ShippingFormValues> = (data) => {
        dispatch(addShippingAddress(data));
    };

    return (
        <div>
            {currentUser ? (
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
                        <Button
                            type="submit"
                            label="Add shipping address"
                            className="w-full h-10"
                        />
                    )}
                </form>
            ) : (
                <div className="p-4 rounded-md">
                    <p className="flex flex-col gap-4">
                        <span className="text-primary-200 text-sm">
                            You should be logged in to make an order.
                        </span>
                        <Link href="/auth/sign-in" className="text-sm  underline">
                            Go to login page
                        </Link>
                    </p>
                </div>
            )}
        </div>
    );
}
