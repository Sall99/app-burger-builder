'use client'
import React from 'react'
import { BiUser } from 'react-icons/bi'
import { useTranslations } from 'next-intl'

import { UpdateProfileForm } from '@/components/ui'

const Content = () => {
    const t = useTranslations('UpdateProfile')

    return (
        <div className="profile-container">
            <div className="profile-header">
                <BiUser className="profile-header-icon" />
                <div className="profile-header-content">
                    <h1 className="profile-header-title">
                        {t('ProfileSettings') || 'Profile Settings'}
                    </h1>
                    <p className="profile-header-subtitle">
                        {t('ManageYourAccount') || 'Manage your account information'}
                    </p>
                </div>
            </div>

            <UpdateProfileForm />
        </div>
    )
}

export default Content
