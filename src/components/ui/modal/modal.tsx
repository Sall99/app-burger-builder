'use client'

import React, { Fragment, ReactNode } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { X } from 'lucide-react'

interface ModalProps {
    isOpen: boolean
    setIsOpen: (isOpen: boolean) => void
    title?: string
    content: ReactNode
}

export function Modal({ isOpen, setIsOpen, title, content }: ModalProps) {
    function closeModal() {
        setIsOpen(false)
    }

    return (
        <Transition appear show={isOpen} as={Fragment}>
            <Dialog as="div" className="relative z-50" onClose={closeModal}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-200"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-150"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0">
                    <div className="fixed inset-0 bg-zinc-950/40 backdrop-blur-sm" />
                </Transition.Child>

                <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4 text-center">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-200"
                            enterFrom="opacity-0 scale-95 translate-y-2"
                            enterTo="opacity-100 scale-100 translate-y-0"
                            leave="ease-in duration-150"
                            leaveFrom="opacity-100 scale-100 translate-y-0"
                            leaveTo="opacity-0 scale-95 translate-y-2">
                            <Dialog.Panel className="w-full max-w-lg transform overflow-hidden rounded-2xl border border-zinc-200/80 bg-white p-6 text-left align-middle shadow-elevated transition-all">
                                <div className="flex items-center justify-between gap-4 pb-4 border-b border-zinc-100">
                                    {title ? (
                                        <Dialog.Title
                                            as="h3"
                                            className="text-base font-semibold tracking-tight text-zinc-950">
                                            {title}
                                        </Dialog.Title>
                                    ) : (
                                        <span />
                                    )}
                                    <button
                                        type="button"
                                        onClick={closeModal}
                                        aria-label="Close modal"
                                        className="flex h-8 w-8 items-center justify-center rounded-lg text-zinc-400 hover:bg-zinc-100 hover:text-zinc-900 transition-colors">
                                        <X size={16} />
                                    </button>
                                </div>
                                <div className="mt-5">{content}</div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    )
}
