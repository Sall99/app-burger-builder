'use client'
import React from 'react'
import { Disclosure } from '@headlessui/react'
import { ChevronUpIcon } from '@heroicons/react/20/solid'

const helpData = [
    {
        title: 'How to Build Your Burger?',
        description: `
            To build your burger, start by selecting your desired ingredients from the list provided. Choose from a variety of options including fresh vegetables like lettuce, tomatoes, and onions, as well as cheeses, sauces, and premium toppings like avocado or bacon. Customize your burger to your liking by adding or removing ingredients as you go.
        `
    },
    {
        title: 'Customizing Your Burger',
        description: `
            Take customization to the next level by selecting the type of bun, from classic options like sesame or brioche to gluten-free alternatives. Adjust the number of patties and layer on additional toppings or sauces to create your perfect burger. Whether you prefer a single, double, or even triple patty, the choice is yours!
        `
    },
    {
        title: 'Reviewing Your Order',
        description: `
            Before placing your order, take a moment to review your burger creation. Ensure all selected ingredients are correct and make any necessary adjustments, such as changing quantities or removing items. Our review screen provides a clear summary of your choices to help you confirm your perfect burger before checkout.
        `
    },
    {
        title: 'Placing Your Order',
        description: `
            Once your burger is just right, proceed by clicking the "Place Order" button. You will be guided through our simple and secure checkout process, where you can enter your delivery details, choose a payment method, and finalize your order. Your burger will be on its way in no time!
        `
    },
    {
        title: 'Special Offers',
        description: `
            Don’t miss out on our special offers! Visit the promotions section to discover current discounts and exclusive deals available for your order. Whether it's a limited-time discount or a combo deal, there's always an opportunity to save on your next burger.
        `
    }
]

export default function Help() {
    return (
        <div className="px-4 md:px-8 lg:px-12 mx-auto">
            <h2 className="text-2xl font-bold mb-8 text-zinc-700">Help Center</h2>
            <div className="bg-white shadow-md rounded-lg p-4">
                {helpData.map(({ title, description }, index) => (
                    <Disclosure key={index} as="div" className="mt-4" defaultOpen={index === 0}>
                        {({ open }) => (
                            <>
                                <Disclosure.Button className="flex justify-between w-full px-4 py-3 text-sm font-medium text-left text-primary-700 bg-orange-50 rounded-md hover:bg-orange-100 focus:outline-none focus-visible:ring focus-visible:ring-orange-200 focus-visible:ring-opacity-75 transition-all">
                                    <span>{title}</span>
                                    <ChevronUpIcon
                                        className={`${
                                            open ? 'rotate-180 transform' : ''
                                        } h-5 w-5 text-primary-700`}
                                    />
                                </Disclosure.Button>
                                <Disclosure.Panel className="px-4 py-3 text-sm text-gray-600 leading-relaxed">
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
