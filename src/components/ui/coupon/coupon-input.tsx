'use client'

import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Check, X } from 'lucide-react'
import { useTranslations } from 'next-intl'

import {
    calculateDiscount,
    clearCoupon,
    setCouponCode,
    setCouponInvalid,
    setCouponValid,
    setValidating
} from '@/redux/slices/coupon'
import { RootState } from '@/redux/store'

interface CouponInputProps {
    orderTotal: number
}

export function CouponInput({ orderTotal }: CouponInputProps) {
    const dispatch = useDispatch()
    const t = useTranslations('Coupon')
    const coupon = useSelector((state: RootState) => state.rootReducer.coupon)
    const [inputValue, setInputValue] = useState('')

    useEffect(() => {
        if (coupon.isValid && orderTotal) {
            dispatch(calculateDiscount(orderTotal))
        }
    }, [coupon.isValid, orderTotal, dispatch])

    const handleApplyCoupon = async () => {
        if (!inputValue.trim()) return

        const code = inputValue.trim().toUpperCase()
        dispatch(setCouponCode(code))
        dispatch(setValidating(true))

        try {
            const response = await fetch('/api/coupons/validate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ code, orderTotal })
            })

            const data = await response.json()

            if (response.ok && data.valid) {
                dispatch(
                    setCouponValid({
                        discountType: data.discountType,
                        discountValue: data.discountValue,
                        maxDiscount: data.maxDiscount
                    })
                )
                dispatch(calculateDiscount(orderTotal))
            } else {
                dispatch(setCouponInvalid(data.error || 'Invalid coupon code'))
            }
        } catch {
            dispatch(setCouponInvalid('Failed to validate coupon'))
        }
    }

    const handleRemoveCoupon = () => {
        dispatch(clearCoupon())
        setInputValue('')
    }

    return (
        <div className="w-full">
            {!coupon.isValid ? (
                <div className="flex gap-2">
                    <input
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value.toUpperCase())}
                        onKeyDown={(e) => e.key === 'Enter' && handleApplyCoupon()}
                        placeholder={t('enterCode') || 'Promo code'}
                        className="flex-1 rounded-xl border border-zinc-200 bg-white px-3 py-2 text-xs font-medium uppercase text-zinc-950 placeholder:normal-case placeholder:text-zinc-400 focus:border-zinc-950 focus:outline-none"
                        maxLength={20}
                        disabled={coupon.isValidating}
                    />
                    <button
                        type="button"
                        onClick={handleApplyCoupon}
                        disabled={!inputValue.trim() || coupon.isValidating}
                        className="shrink-0 rounded-xl bg-zinc-950 px-3.5 py-2 text-xs font-semibold text-white hover:bg-zinc-800 disabled:opacity-40">
                        {coupon.isValidating ? '...' : t('apply') || 'Apply'}
                    </button>
                </div>
            ) : (
                <div className="flex items-center justify-between rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2">
                    <div className="flex items-center gap-2 text-xs">
                        <Check size={14} className="text-emerald-600" />
                        <span className="font-semibold text-emerald-900">{coupon.code}</span>
                        <span className="text-emerald-700">
                            (-${coupon.appliedDiscount.toFixed(2)})
                        </span>
                    </div>
                    <button
                        type="button"
                        onClick={handleRemoveCoupon}
                        className="rounded-md p-1 text-emerald-700 hover:bg-emerald-100"
                        aria-label={t('remove') || 'Remove'}>
                        <X size={14} />
                    </button>
                </div>
            )}

            {coupon.error && (
                <p className="mt-1.5 text-xs font-medium text-red-600">{coupon.error}</p>
            )}
        </div>
    )
}
