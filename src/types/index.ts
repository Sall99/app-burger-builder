import { User } from '@prisma/client'

export interface IngredientTypes {
    [key: string]: string | number
}
export interface BuilderProps {
    ingredients: IngredientTypes
}

export type SafeUser = Omit<User, 'createdAt' | 'updatedAt' | 'emailVerified'> & {
    createdAt: string | null
    updatedAt: string | null
    emailVerified: string | null
}
