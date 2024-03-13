import * as yup from 'yup'

export const signUpFormSchema = yup.object().shape({
    name: yup
        .string()
        .min(3, 'Name must be at least 3 characters long')
        .max(60, 'Name must be at most 20 characters long')
        .required('Name is required'),
    email: yup.string().email().required('Email is required'),
    password: yup
        .string()
        .min(8, 'Password must be at least 8 characters long')
        .max(32, 'Password must be at most 32 characters long')
        .required('Password is required'),
    confirmPassword: yup
        .string()
        .oneOf([yup.ref('password'), undefined], 'Passwords must match')
        .required('Confirm password is required')
})

export const signInFormSchema = yup.object().shape({
    email: yup.string().email().required('Email is required'),
    password: yup
        .string()
        .min(8, 'Password must be at least 8 characters long')
        .max(32, 'Password must be at most 32 characters long')
        .required('Password is required')
})

export const updateProfileFormSchema = yup.object().shape({
    name: yup.string().min(3, 'Name must be at least 3 characters long').nullable(),

    password: yup
        .string()
        .transform((value, originalValue) => (originalValue.trim() === '' ? undefined : value))
        .min(8, 'Password must be at least 8 characters long')
        .max(32, 'Password must be at most 32 characters long')
        .nullable()
})

export const shippingAddressFormSchema = yup.object().shape({
    firstName: yup
        .string()
        .min(3, 'First name must be at least 3 characters long')
        .max(60, 'First name must be at most 20 characters long')
        .required('First name is required'),
    lastName: yup
        .string()
        .min(3, 'Last name must be at least 3 characters long')
        .max(60, 'Last name must be at most 20 characters long')
        .required('Last name is required'),

    streetAddress: yup
        .string()
        .min(3, 'Street address must be at least 3 characters long')
        .max(60, 'Street address must be at most 20 characters long')
        .required('Street address is required'),
    town: yup
        .string()
        .min(3, 'Town must be at least 3 characters long')
        .max(60, 'Town must be at most 20 characters long')
        .required('Town is required')
})
