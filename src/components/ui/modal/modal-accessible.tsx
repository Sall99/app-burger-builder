'use client'

import { Fragment, useEffect, useRef } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { X } from 'lucide-react'

interface ModalAccessibleProps {
    isOpen: boolean
    setIsOpen: (open: boolean) => void
    title: string
    content: React.ReactNode
    closeOnClickOutside?: boolean
}

export function ModalAccessible({
    isOpen,
    setIsOpen,
    title,
    content,
    closeOnClickOutside = true
}: ModalAccessibleProps) {
    const modalRef = useRef<HTMLDivElement>(null)
    const previousFocusRef = useRef<HTMLElement | null>(null)

    useEffect(() => {
        if (isOpen) {
            previousFocusRef.current = document.activeElement as HTMLElement

            announce(`${title} dialog opened`, 'polite')

            if (modalRef.current) {
                const cleanup = trapFocus(modalRef.current)
                return cleanup
            }
        } else {
            if (previousFocusRef.current) {
                previousFocusRef.current.focus()
            }
        }
    }, [isOpen, title])

    const handleClose = () => {
        setIsOpen(false)
        announce('Dialog closed', 'polite')
    }

    return (
        <Transition appear show={isOpen} as={Fragment}>
            <Dialog
                as="div"
                className="relative z-50"
                onClose={closeOnClickOutside ? handleClose : () => {}}
                aria-labelledby="modal-title"
                aria-describedby="modal-description">
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0">
                    <div className="fixed inset-0 bg-black/50" aria-hidden="true" />
                </Transition.Child>

                <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4 text-center">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95">
                            <Dialog.Panel
                                ref={modalRef}
                                className="modal-content relative w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all"
                                role="dialog"
                                aria-modal="true">
                                <button
                                    onClick={handleClose}
                                    className="absolute right-4 top-4 p-2 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-400 transition-colors"
                                    aria-label="Close dialog">
                                    <X size={20} aria-hidden="true" />
                                </button>

                                <Dialog.Title
                                    id="modal-title"
                                    as="h2"
                                    className="text-lg font-semibold text-gray-900 mb-4 pr-8">
                                    {title}
                                </Dialog.Title>

                                <div id="modal-description">{content}</div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    )
}
function announce(arg0: string, arg1: string) {
    throw new Error('Function not implemented.')
}
function trapFocus(current: HTMLDivElement) {
    throw new Error('Function not implemented.')
}
