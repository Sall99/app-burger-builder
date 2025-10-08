'use client'

import { BiArrowBack, BiError, BiHelpCircle } from 'react-icons/bi'
import Link from 'next/link'
import { useTranslations } from 'next-intl'

export default function CancelPage() {
    const t = useTranslations('Cancel')

    return (
        <div className="max-w-6xl mx-auto my-8 min-h-screen px-8 sm:px-16">
            <div className="flex items-center gap-4 mb-8 p-6 bg-gradient-to-r from-orange-400 to-orange-500 rounded-lg shadow-md">
                <BiError className="text-4xl text-white" />
                <div>
                    <h1 className="text-2xl font-bold text-white">
                        {t('title') || 'Payment Cancelled'}
                    </h1>
                    <p className="text-sm text-white opacity-90">
                        {t('subtitle') || 'Your payment has been cancelled'}
                    </p>
                </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <div className="flex items-start gap-4 mb-6">
                    <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <BiHelpCircle className="w-6 h-6 text-orange-600" />
                    </div>
                    <div className="flex-1">
                        <h2 className="text-lg font-semibold text-gray-900 mb-2">
                            {t('message') ||
                                'No charges were made to your account. Your burger order was not completed.'}
                        </h2>
                        <p className="text-sm text-gray-600">
                            {t('help') ||
                                'If you experienced any issues during checkout, please contact our support team.'}
                        </p>
                    </div>
                </div>

                <div className="bg-orange-50 rounded-lg p-4 mb-6">
                    <p className="text-sm font-medium text-gray-900 mb-3">
                        {t('whatHappened') || 'What happened?'}
                    </p>
                    <ul className="space-y-2 text-sm text-gray-700">
                        <li className="flex items-start gap-2">
                            <span className="text-orange-500 mt-0.5">•</span>
                            <span>
                                {t('reason1') ||
                                    'You clicked the back button or cancelled the payment'}
                            </span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-orange-500 mt-0.5">•</span>
                            <span>{t('reason2') || 'The payment session may have expired'}</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-orange-500 mt-0.5">•</span>
                            <span>
                                {t('reason3') ||
                                    'There was a technical issue with the payment processor'}
                            </span>
                        </li>
                    </ul>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Link
                        href="/"
                        className="bg-primary-200 hover:bg-primary-600 text-white font-medium py-2 px-5 rounded text-sm transition-colors text-center flex items-center justify-center gap-2">
                        <BiArrowBack className="w-4 h-4" />
                        {t('tryAgain') || 'Try Again'}
                    </Link>
                    <Link
                        href="/help"
                        className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-5 rounded text-sm transition-colors text-center flex items-center justify-center gap-2">
                        <BiHelpCircle className="w-4 h-4" />
                        {t('getHelp') || 'Get Help'}
                    </Link>
                </div>
            </div>

            <div className="text-center">
                <p className="text-sm text-gray-500">
                    {t('needHelp') || 'Still need help?'}{' '}
                    <Link
                        href="/help"
                        className="text-primary-200 hover:text-primary-600 font-medium">
                        {t('contactSupport') || 'Contact Support'}
                    </Link>
                </p>
            </div>
        </div>
    )
}
