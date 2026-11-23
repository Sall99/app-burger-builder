'use client'

import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { yupResolver } from '@hookform/resolvers/yup'
import { AxiosError } from 'axios'
import { Shield, Sliders, User } from 'lucide-react'
import { useSession } from 'next-auth/react'
import { useLocale, useTranslations } from 'next-intl'
import useSWR, { mutate } from 'swr'

import { updateProfileAction } from '@/actions/auth'
import { currentUserAction } from '@/actions/users'
import { Button, Input } from '@/components/ui'
import { UpdateProfileInFormValues } from '@/types'
import { updateProfileFormSchema } from '@/utils/yup.schema'

export const UpdateProfileForm = () => {
    const t = useTranslations('UpdateProfile')
    const locale = useLocale()
    const isFr = locale === 'fr'
    const { update: updateSession } = useSession()
    const [activeTab, setActiveTab] = useState<'info' | 'security' | 'preferences'>('info')
    const [loading, setLoading] = useState(false)

    const { data } = useSWR(['User'], currentUserAction, {
        revalidateOnFocus: false
    })

    const {
        handleSubmit,
        register,
        reset,
        formState: { errors }
    } = useForm<UpdateProfileInFormValues>({
        resolver: yupResolver(updateProfileFormSchema)
    })

    useEffect(() => {
        if (data?.user?.name) {
            reset({ name: data.user.name })
        }
    }, [data?.user?.name, reset])

    const onSubmit = async (formData: UpdateProfileInFormValues) => {
        setLoading(true)
        try {
            await updateProfileAction(formData)
            if (formData.name) {
                await updateSession({ name: formData.name })
            }
            toast.success(t('ProfileUpdated'))
            mutate(['User'])
            mutate(['userStats'])
            if (formData.newPassword) {
                reset({
                    name: formData.name || data?.user?.name || '',
                    currentPassword: '',
                    newPassword: '',
                    confirmNewPassword: ''
                })
            }
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

    const tabs = [
        { id: 'info' as const, label: t('PersonalInfo') || 'Personal Info', icon: User },
        { id: 'security' as const, label: t('Security') || 'Security', icon: Shield },
        { id: 'preferences' as const, label: t('Preferences') || 'Preferences', icon: Sliders }
    ]

    return (
        <div className="space-y-5">
            {/* Segmented Tabs */}
            <div className="inline-flex flex-wrap gap-1 rounded-xl bg-zinc-100 p-1">
                {tabs.map(({ id, label, icon: Icon }) => (
                    <button
                        key={id}
                        type="button"
                        onClick={() => setActiveTab(id)}
                        className={`inline-flex items-center justify-center gap-2 rounded-lg px-3.5 py-2 text-xs font-medium transition-all ${
                            activeTab === id
                                ? 'bg-white text-zinc-950 shadow-sm'
                                : 'text-zinc-500 hover:text-zinc-950'
                        }`}>
                        <Icon size={14} />
                        <span>{label}</span>
                    </button>
                ))}
            </div>

            {/* Tab Panels */}
            <div>
                {activeTab === 'info' && (
                    <form
                        onSubmit={handleSubmit(onSubmit)}
                        autoComplete="off"
                        className="max-w-lg space-y-2">
                        <h3 className="text-sm font-semibold text-zinc-950 mb-3">
                            {t('PersonalInfo') || 'Personal Information'}
                        </h3>
                        <Input
                            name="name"
                            type="text"
                            placeholder={t('Name')}
                            register={register}
                            errors={errors}
                        />
                        {data?.user?.email && (
                            <div className="mb-4">
                                <label className="mb-1.5 block text-xs font-medium text-zinc-500">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    value={data.user.email}
                                    disabled
                                    className="block w-full rounded-xl border border-zinc-200 bg-zinc-50 px-3.5 py-2.5 text-sm text-zinc-400 cursor-not-allowed"
                                />
                            </div>
                        )}
                        <Button
                            type="submit"
                            label={
                                loading
                                    ? t('Updating')
                                    : t('SaveChanges') || (isFr ? 'Enregistrer' : 'Save Changes')
                            }
                            className="py-2.5 px-5"
                            disabled={loading}
                            loading={loading}
                        />
                    </form>
                )}

                {activeTab === 'security' && (
                    <form
                        onSubmit={handleSubmit(onSubmit)}
                        autoComplete="off"
                        className="max-w-lg space-y-2">
                        <h3 className="text-sm font-semibold text-zinc-950 mb-3">
                            {t('SecuritySettings') || 'Security Settings'}
                        </h3>
                        <Input
                            name="currentPassword"
                            type="password"
                            placeholder={t('CurrentPassword')}
                            register={register}
                            errors={errors}
                        />
                        <Input
                            name="newPassword"
                            type="password"
                            placeholder={t('NewPassword')}
                            register={register}
                            errors={errors}
                        />
                        <Input
                            name="confirmNewPassword"
                            type="password"
                            placeholder={t('ConfirmNewPassword')}
                            register={register}
                            errors={errors}
                        />
                        <Button
                            type="submit"
                            label={
                                loading
                                    ? t('Updating')
                                    : t('UpdatePassword') || 'Update Password'
                            }
                            className="py-2.5 px-5"
                            disabled={loading}
                            loading={loading}
                        />
                    </form>
                )}

                {activeTab === 'preferences' && (
                    <div>
                        <h3 className="text-sm font-semibold text-zinc-950 mb-3">
                            {t('YourPreferences') || 'Your Preferences'}
                        </h3>
                        <div className="divide-y divide-zinc-100 rounded-xl border border-zinc-200/80">
                            {[
                                {
                                    title: t('EmailNotifications') || 'Email Notifications',
                                    desc:
                                        t('EmailNotificationsDesc') ||
                                        'Receive notifications about your account activity'
                                },
                                {
                                    title: t('PromotionalEmails') || 'Promotional Emails',
                                    desc:
                                        t('PromotionalEmailsDesc') ||
                                        'Get updates about deals, offers and new features'
                                },
                                {
                                    title: t('OrderUpdates') || 'Order Updates',
                                    desc:
                                        t('OrderUpdatesDesc') ||
                                        'Receive updates about your orders and delivery'
                                }
                            ].map((pref) => (
                                <label
                                    key={pref.title}
                                    className="flex items-center justify-between gap-4 p-4 cursor-pointer hover:bg-zinc-50/70 transition-colors">
                                    <div>
                                        <p className="text-sm font-medium text-zinc-950">
                                            {pref.title}
                                        </p>
                                        <p className="text-xs text-zinc-500">{pref.desc}</p>
                                    </div>
                                    <input
                                        type="checkbox"
                                        defaultChecked
                                        className="h-4 w-4 accent-zinc-950 rounded cursor-pointer"
                                    />
                                </label>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
