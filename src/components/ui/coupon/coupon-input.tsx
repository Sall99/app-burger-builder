'use client'

import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Check, Tag, X } from 'lucide-react'
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
        } catch (error) {
            dispatch(setCouponInvalid('Failed to validate coupon'))
        }
    }

    const handleRemoveCoupon = () => {
        dispatch(clearCoupon())
        setInputValue('')
    }

    if (coupon.isValid && orderTotal) {
        dispatch(calculateDiscount(orderTotal))
    }

    return (
        <div className="coupon-section mt-4">
            {!coupon.isValid ? (
                <div className="flex gap-2">
                    <div className="flex-1 relative">
                        <Tag
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                            size={18}
                        />
                        <input
                            type="text"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value.toUpperCase())}
                            onKeyDown={(e) => e.key === 'Enter' && handleApplyCoupon()}
                            placeholder={t('enterCode') || 'Enter promo code'}
                            className="w-full pl-10 pr-3 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent uppercase"
                            maxLength={20}
                            disabled={coupon.isValidating}
                        />
                    </div>
                    <button
                        onClick={handleApplyCoupon}
                        disabled={!inputValue.trim() || coupon.isValidating}
                        className="px-6 py-2 bg-primary-200 hover:bg-primary-600 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                        {coupon.isValidating
                            ? t('validating') || 'Checking...'
                            : t('apply') || 'Apply'}
                    </button>
                </div>
            ) : (
                <div className="flex items-center justify-between p-3 bg-green-50 border-2 border-green-500 rounded-lg">
                    <div className="flex items-center gap-2">
                        <Check className="text-green-600" size={20} />
                        <div>
                            <p className="font-semibold text-green-800">{coupon.code}</p>
                            <p className="text-sm text-green-600">
                                {t('saved') || 'You saved'} ${coupon.appliedDiscount.toFixed(2)}!
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={handleRemoveCoupon}
                        className="p-1 hover:bg-green-100 rounded transition-colors"
                        title={t('remove') || 'Remove'}>
                        <X size={18} className="text-green-700" />
                    </button>
                </div>
            )}

            {coupon.error && (
                <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                    <X size={14} />
                    {coupon.error}
                </p>
            )}
        </div>
    )
}
