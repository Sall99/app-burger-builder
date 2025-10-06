'use client'
import React from 'react'
import { BiUser } from 'react-icons/bi'
import { useTranslations } from 'next-intl'

import { UpdateProfileForm } from '@/components/ui'

const Content = () => {
    const t = useTranslations('UpdateProfile')

    return (
        <section className="profile-page-container">
            {/* Header */}
            <div className="profile-page-header">
                <BiUser className="profile-page-icon" />
                <div>
                    <h1 className="profile-page-title">
                        {t('ProfileSettings') || 'Profile Settings'}
                    </h1>
                    <p className="profile-page-subtitle">
                        {t('ManageYourAccount') || 'Manage your account information'}
                    </p>
                </div>
            </div>

            {/* Form */}
            <UpdateProfileForm />
        </section>
    )
}

export default Content
