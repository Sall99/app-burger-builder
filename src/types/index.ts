import { Address, Order, User } from '@prisma/client'

export interface IngredientTypes {
    [key: string]: string | number
}
export interface BuilderProps {
    ingredients: IngredientTypes
}

export type SignupFormValues = {
    name: string
    email: string
    password: string
    confirmPassword: string
    placeholder?: string
    type?: string
}

export type SignInFormValues = {
    email: string
    password: string
}

export type UpdateProfileInFormValues = {
    name?: string
    currentPassword?: string
    newPassword?: string
    confirmNewPassword?: string
}

export type shippingAddressFormValues = {
    firstName: string
    lastName: string
    streetAddress: string
    town: string
}

export interface PaymentActionValues {
    amount: number
    shippingAddress: shippingAddressFormValues
}

export interface OrderWithShippingAddress extends Order {
    shippingAdresse?: Address
}

export enum OrderStatus {
    PENDING,
    PROCESSING,
    COMPLETED,
    DELIVERED,
    CANCELLED
}

export type SafeUser = Omit<User, 'emailVerified' | 'updatedAt'> & { createdAt: Date | string }
