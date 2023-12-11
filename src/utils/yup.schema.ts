import * as yup from 'yup'

export const signUpFormSchema = yup.object().shape({
    fullName: yup
        .string()
        .min(3, 'Full name must be at least 3 characters long')
        .max(20, 'Full name must be at most 20 characters long')
        .required('Full name is required'),
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
