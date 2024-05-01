import { User } from '@prisma/client'

export interface IngredientTypes {
    [key: string]: string | number
}
export interface BuilderProps {
    ingredients: IngredientTypes
}

export type SafeUser = Omit<User, 'emailVerified' | 'updatedAt'> & { createdAt: Date | string }
