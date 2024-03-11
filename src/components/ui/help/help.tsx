import React from 'react'
import { Disclosure } from '@headlessui/react'
import { ChevronUpIcon } from '@heroicons/react/20/solid'

const helpData = [
    {
        title: 'How to Build Your Burger ?',
        description:
            'To build your burger, select the ingredients you want from the ingredient list on the left. You can add multiple ingredients such as lettuce, cheese, tomatoes, and more.'
    },
    {
        title: 'Customizing Your Burger',
        description:
            'You can customize your burger by selecting the type of bun, the number of patties, and any additional toppings or sauces.'
    },
    {
        title: 'Reviewing Your Order',
        description:
            'Before finalizing your order, review your burger to ensure all selected ingredients are correct. You can also adjust quantities or remove ingredients if needed.'
    },
    {
        title: 'Placing Your Order',
        description:
            'Once you are satisfied with your burger, click on the "Place Order" button to proceed to checkout. Fill in your details and complete the payment process.'
    },
    {
        title: 'Special Offers',
        description:
            'Check out our special offers section to see if there are any discounts or promotions available for your order.'
    },
    {
        title: 'Contact Support',
        description:
            'If you encounter any issues or have questions about your order, feel free to contact our support team for assistance.'
    },
    {
        title: 'Nutritional Information',
        description:
            'View the nutritional information for each ingredient and burger option to make informed choices based on your dietary preferences.'
    },
    {
        title: 'Delivery and Pickup Options',
        description:
            'Choose between delivery or pickup options based on your preference. You can also specify any special instructions for delivery.'
    },
    {
        title: 'Payment Methods',
        description:
            'We accept various payment methods including credit/debit cards, PayPal, and mobile payment apps. Choose the option that works best for you.'
    },
    {
        title: 'Track Your Order',
        description:
            'Once your order is confirmed, you can track its status in real-time. Check the status updates to know when your burger will be delivered or ready for pickup.'
    },
    {
        title: 'Feedback and Reviews',
        description:
            'We value your feedback! Share your experience with us by leaving a review or rating. Your feedback helps us improve our service and offerings.'
    },
    {
        title: 'Allergen Information',
        description:
            'If you have any allergies or dietary restrictions, please review the allergen information for each ingredient to ensure your safety.'
    },
    {
        title: 'Catering Services',
        description:
            "Planning an event or party? Explore our catering services for large orders and special events. We'll take care of the food while you enjoy the celebration."
    },
    {
        title: 'Membership Benefits',
        description:
            'Join our loyalty program to enjoy exclusive benefits such as discounts, rewards, and special offers. Sign up today and start earning points with every order.'
    },
    {
        title: 'Community Events',
        description:
            'Stay updated on upcoming community events and promotions. Join us for special burger nights, fundraisers, and charity events.'
    },
    {
        title: 'Burger of the Month',
        description:
            "Discover our featured burger of the month, crafted with unique ingredients and flavors. Don't miss out on the opportunity to try our latest creation!"
    },
    {
        title: 'Social Media',
        description:
            'Follow us on social media for news, updates, and exclusive offers. Connect with our burger-loving community and share your burger experiences.'
    },
    {
        title: 'Refund Policy',
        description:
            "Review our refund policy for information on returns, exchanges, and refunds. We strive to provide excellent service, but if you're not satisfied, we'll make it right."
    },
    {
        title: 'FAQs',
        description:
            "Browse our frequently asked questions section for answers to common queries. If you can't find what you're looking for, feel free to reach out to our support team."
    }
]

export default function Help() {
    return (
        <div className="px-4 w-_776">
            <h2 className="text-xl font-semibold mb-16 text-zinc-600">Help Center</h2>
            <div className="mx-auto w-full rounded-2xl bg-white p-2">
                {helpData.map(({ title, description }, index) => (
                    <Disclosure key={index} as="div" className="mt-4" defaultOpen={index === 0}>
                        {({ open }) => (
                            <>
                                <Disclosure.Button className="flex w-full justify-between rounded-sm bg-opacity-70 bg-orange-100 px-4 py-4 text-left text-sm font-medium text-primary-100 hover:bg-orange-200 focus:outline-none focus-visible:ring focus-visible:ring-purple-500/75">
                                    <span>{title}</span>
                                    <ChevronUpIcon
                                        className={`${
                                            open ? 'rotate-180 transform' : ''
                                        } h-5 w-5 text-primary-100`}
                                    />
                                </Disclosure.Button>
                                <Disclosure.Panel className="px-4 pb-2 pt-4 text-sm text-gray-500">
                                    {description}
                                </Disclosure.Panel>
                            </>
                        )}
                    </Disclosure>
                ))}
            </div>
        </div>
    )
}
