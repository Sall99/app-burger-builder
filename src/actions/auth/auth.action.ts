import { instance } from '@/config';
import { SignupFormValues } from '@/types';

export const signupAction = async (values: SignupFormValues) => {
    const { data } = await instance.post('/auth/sign-up', values);

    return data;
};
