'use client'

import { Fragment, useEffect, useRef } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { X } from 'lucide-react'

import { announce, trapFocus } from '@/lib/accessibility'

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
        } else if (previousFocusRef.current) {
            previousFocusRef.current.focus()
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
                    enter="ease-out duration-200"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-150"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0">
                    <div
                        className="fixed inset-0 bg-zinc-950/40 backdrop-blur-sm"
                        aria-hidden="true"
                    />
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
                            <Dialog.Panel
                                ref={modalRef}
                                className="relative w-full max-w-lg transform overflow-hidden rounded-2xl border border-zinc-200/80 bg-white text-left align-middle shadow-elevated transition-all"
                                role="dialog"
                                aria-modal="true">
                                <div className="flex items-center justify-between border-b border-zinc-100 px-6 py-4">
                                    <Dialog.Title
                                        id="modal-title"
                                        as="h2"
                                        className="text-base font-semibold tracking-tight text-zinc-950 pr-6">
                                        {title}
                                    </Dialog.Title>
                                    <button
                                        type="button"
                                        onClick={handleClose}
                                        className="flex h-8 w-8 items-center justify-center rounded-lg text-zinc-400 hover:bg-zinc-100 hover:text-zinc-950 focus:outline-none focus-visible:ring-2 focus-visible:ring-zinc-950 transition-colors"
                                        aria-label="Close dialog">
                                        <X size={16} aria-hidden="true" />
                                    </button>
                                </div>

                                <div id="modal-description" className="p-6">
                                    {content}
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    )
}
