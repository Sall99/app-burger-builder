'use client'

import React from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { useDispatch } from 'react-redux'
import { yupResolver } from '@hookform/resolvers/yup'
import { ArrowRight, Lock, MapPin } from 'lucide-react'
import Link from 'next/link'
import { useSession } from 'next-auth/react'
import { useLocale, useTranslations } from 'next-intl'

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

export function ShippingAddress({ handlePayment }: ShippingAddressProps) {
    const dispatch = useDispatch()
    const locale = useLocale()
    const { shippingAddress } = useAppSelector(selectShippingAddress)
    const { data: session } = useSession()
    const t = useTranslations('ShippingAddress')
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
        if (isShippingAddressPresent) {
            handlePayment()
        }
    }

    if (!session) {
        return (
            <div className="rounded-xl border border-zinc-200/80 bg-zinc-50/70 p-6 text-center space-y-4">
                <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl bg-white text-zinc-900 ring-1 ring-zinc-200">
                    <Lock size={18} />
                </div>
                <p className="text-sm font-semibold text-zinc-950">{t('YouShouldBeLoggedIn')}</p>
                <Link
                    href={`/${locale}/auth/sign-in`}
                    className="inline-flex items-center gap-2 rounded-xl bg-zinc-950 px-5 py-2.5 text-sm font-medium text-white hover:bg-zinc-800 transition-colors">
                    <span>{t('GoToLoginPage')}</span>
                    <ArrowRight size={14} />
                </Link>
            </div>
        )
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center gap-2.5 rounded-xl border border-zinc-200/80 bg-zinc-50/70 px-3.5 py-2.5 text-xs text-zinc-600">
                <MapPin size={14} className="shrink-0 text-orange-500" />
                <span>
                    {locale === 'fr'
                        ? 'Indiquez votre adresse pour recevoir votre burger bien chaud.'
                        : 'Enter your delivery details so we can bring your burger hot & fresh.'}
                </span>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} aria-live="polite" className="space-y-1">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-3">
                    <Input
                        name="firstName"
                        type="text"
                        placeholder={t('FirstName')}
                        register={register}
                        errors={errors}
                        aria-invalid={!!errors.firstName}
                    />
                    <Input
                        name="lastName"
                        type="text"
                        placeholder={t('LastName')}
                        register={register}
                        errors={errors}
                        aria-invalid={!!errors.lastName}
                    />
                </div>
                <Input
                    name="streetAddress"
                    type="text"
                    placeholder={t('StreetAddress')}
                    register={register}
                    errors={errors}
                    aria-invalid={!!errors.streetAddress}
                />
                <Input
                    name="town"
                    type="text"
                    placeholder={t('Town')}
                    register={register}
                    errors={errors}
                    aria-invalid={!!errors.town}
                />

                <div className="pt-2">
                    <Button
                        type="submit"
                        label={
                            isShippingAddressPresent
                                ? t('ProceedToPayment')
                                : t('AddShippingAddress')
                        }
                        className="w-full py-2.5 text-sm font-medium"
                    />
                </div>
            </form>
        </div>
    )
}
