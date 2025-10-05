'use client'

import { useState } from 'react'
import {
    BiDollar,
    BiEnvelope,
    BiLock,
    BiShield,
    BiStar,
    BiTrendingUp,
    BiUser
} from 'react-icons/bi'
import { MdVerified } from 'react-icons/md'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { yupResolver } from '@hookform/resolvers/yup'
import { AxiosError } from 'axios'
import { useTranslations } from 'next-intl'
import useSWR, { mutate } from 'swr'

import { updateProfileAction } from '@/actions/auth'
import { currentUserAction } from '@/actions/users'
import { Button, Input } from '@/components/ui'
import { UpdateProfileInFormValues } from '@/types'
import { updateProfileFormSchema } from '@/utils/yup.schema'

const useUpdate = () => {
    const [loading, setLoading] = useState(false)
    const t = useTranslations('UpdateProfile')

    const update = async (data: UpdateProfileInFormValues) => {
        setLoading(true)
        try {
            await updateProfileAction(data)
            toast.success(t('ProfileUpdated'))

            mutate(['User'])
        } catch (error) {
            if (error instanceof AxiosError && error.response) {
                toast.error(error.response.data?.error || t('Error'))
            } else {
                toast.error(t('UnknownError'))
            }
        } finally {
            setLoading(false)
        }
    }

    return { update, loading }
}

export const UpdateProfileForm = () => {
    const t = useTranslations('UpdateProfile')
    const [activeTab, setActiveTab] = useState<'info' | 'security' | 'preferences'>('info')

    const { error, data, isLoading } = useSWR(['User'], currentUserAction, {
        revalidateOnFocus: false
    })

    const {
        handleSubmit,
        register,
        formState: { errors }
    } = useForm<UpdateProfileInFormValues>({
        resolver: yupResolver(updateProfileFormSchema)
    })

    const { update, loading } = useUpdate()

    const onSubmit = async (formData: UpdateProfileInFormValues) => {
        update(formData)
    }

    // Mock data for stats (in real app, fetch from API)
    const stats = {
        totalOrders: 42,
        totalSpent: 285.5,
        memberSince: '2024',
        loyaltyPoints: 1250
    }

    return (
        <div className="profile-content">
            {/* Stats Cards */}
            <div className="profile-stats-grid">
                <div className="profile-stat-card profile-stat-orders">
                    <div className="profile-stat-icon">
                        <BiTrendingUp />
                    </div>
                    <div className="profile-stat-info">
                        <p className="profile-stat-value">{stats.totalOrders}</p>
                        <p className="profile-stat-label">{t('TotalOrders') || 'Total Orders'}</p>
                    </div>
                </div>

                <div className="profile-stat-card profile-stat-spent">
                    <div className="profile-stat-icon">
                        <BiDollar />
                    </div>
                    <div className="profile-stat-info">
                        <p className="profile-stat-value">${stats.totalSpent}</p>
                        <p className="profile-stat-label">{t('TotalSpent') || 'Total Spent'}</p>
                    </div>
                </div>

                <div className="profile-stat-card profile-stat-loyalty">
                    <div className="profile-stat-icon">
                        <BiStar />
                    </div>
                    <div className="profile-stat-info">
                        <p className="profile-stat-value">{stats.loyaltyPoints}</p>
                        <p className="profile-stat-label">
                            {t('LoyaltyPoints') || 'Loyalty Points'}
                        </p>
                    </div>
                </div>

                <div className="profile-stat-card profile-stat-member">
                    <div className="profile-stat-icon">
                        <MdVerified />
                    </div>
                    <div className="profile-stat-info">
                        <p className="profile-stat-value">{stats.memberSince}</p>
                        <p className="profile-stat-label">{t('MemberSince') || 'Member Since'}</p>
                    </div>
                </div>
            </div>

            {/* Profile Avatar & Name */}
            <div className="profile-user-card">
                <div className="profile-avatar">
                    <BiUser />
                </div>
                <div className="profile-user-info">
                    <h2 className="profile-user-name">{data?.user ? data?.user.name : '...'}</h2>
                    <p className="profile-user-email">
                        <BiEnvelope /> {data?.user?.email || 'user@example.com'}
                    </p>
                </div>
                <div className="profile-badge">
                    <MdVerified /> {t('Verified') || 'Verified'}
                </div>
            </div>

            {/* Tabs */}
            <div className="profile-tabs">
                <button
                    onClick={() => setActiveTab('info')}
                    className={`profile-tab ${activeTab === 'info' ? 'profile-tab-active' : ''}`}>
                    <BiUser /> {t('PersonalInfo') || 'Personal Info'}
                </button>
                <button
                    onClick={() => setActiveTab('security')}
                    className={`profile-tab ${activeTab === 'security' ? 'profile-tab-active' : ''}`}>
                    <BiShield /> {t('Security') || 'Security'}
                </button>
                <button
                    onClick={() => setActiveTab('preferences')}
                    className={`profile-tab ${activeTab === 'preferences' ? 'profile-tab-active' : ''}`}>
                    <BiStar /> {t('Preferences') || 'Preferences'}
                </button>
            </div>

            {/* Tab Content */}
            <div className="profile-tab-content">
                {activeTab === 'info' && (
                    <div className="profile-section">
                        <h3 className="profile-section-title">
                            {t('PersonalInfo') || 'Personal Information'}
                        </h3>
                        <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
                            <div className="profile-form-field-group">
                                <label className="profile-field-label">
                                    <BiUser /> {t('Name')}
                                </label>
                                <Input
                                    name="name"
                                    type="text"
                                    placeholder={t('Name')}
                                    register={register}
                                    errors={errors}
                                />
                            </div>

                            <Button
                                type="submit"
                                label={loading ? t('Updating') : t('SaveChanges') || 'Save Changes'}
                                className="profile-save-button"
                                disabled={loading}
                            />
                        </form>
                    </div>
                )}

                {activeTab === 'security' && (
                    <div className="profile-section">
                        <h3 className="profile-section-title">
                            {t('SecuritySettings') || 'Security Settings'}
                        </h3>
                        <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
                            <div className="profile-form-field-group">
                                <label className="profile-field-label">
                                    <BiLock /> {t('CurrentPassword')}
                                </label>
                                <Input
                                    name="currentPassword"
                                    type="password"
                                    placeholder={t('CurrentPassword')}
                                    register={register}
                                    errors={errors}
                                />
                            </div>

                            <div className="profile-form-field-group">
                                <label className="profile-field-label">
                                    <BiShield /> {t('NewPassword')}
                                </label>
                                <Input
                                    name="newPassword"
                                    type="password"
                                    placeholder={t('NewPassword')}
                                    register={register}
                                    errors={errors}
                                />
                            </div>

                            <div className="profile-form-field-group">
                                <label className="profile-field-label">
                                    <BiShield /> {t('ConfirmNewPassword')}
                                </label>
                                <Input
                                    name="confirmNewPassword"
                                    type="password"
                                    placeholder={t('ConfirmNewPassword')}
                                    register={register}
                                    errors={errors}
                                />
                            </div>

                            <Button
                                type="submit"
                                label={
                                    loading
                                        ? t('Updating')
                                        : t('UpdatePassword') || 'Update Password'
                                }
                                className="profile-save-button"
                                disabled={loading}
                            />
                        </form>
                    </div>
                )}

                {activeTab === 'preferences' && (
                    <div className="profile-section">
                        <h3 className="profile-section-title">
                            {t('YourPreferences') || 'Your Preferences'}
                        </h3>

                        <div className="profile-preferences">
                            <div className="profile-preference-item">
                                <div className="profile-preference-info">
                                    <p className="profile-preference-title">
                                        {t('EmailNotifications') || 'Email Notifications'}
                                    </p>
                                    <p className="profile-preference-desc">
                                        {t('EmailNotificationsDesc') ||
                                            'Receive notifications about your account activity'}
                                    </p>
                                </div>
                                <label className="profile-toggle">
                                    <input type="checkbox" defaultChecked />
                                    <span className="profile-toggle-slider"></span>
                                </label>
                            </div>

                            <div className="profile-preference-item">
                                <div className="profile-preference-info">
                                    <p className="profile-preference-title">
                                        {t('PromotionalEmails') || 'Promotional Emails'}
                                    </p>
                                    <p className="profile-preference-desc">
                                        {t('PromotionalEmailsDesc') ||
                                            'Get updates about deals, offers and new features'}
                                    </p>
                                </div>
                                <label className="profile-toggle">
                                    <input type="checkbox" defaultChecked />
                                    <span className="profile-toggle-slider"></span>
                                </label>
                            </div>

                            <div className="profile-preference-item">
                                <div className="profile-preference-info">
                                    <p className="profile-preference-title">
                                        {t('OrderUpdates') || 'Order Updates'}
                                    </p>
                                    <p className="profile-preference-desc">
                                        {t('OrderUpdatesDesc') ||
                                            'Receive updates about your orders and delivery'}
                                    </p>
                                </div>
                                <label className="profile-toggle">
                                    <input type="checkbox" defaultChecked />
                                    <span className="profile-toggle-slider"></span>
                                </label>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
