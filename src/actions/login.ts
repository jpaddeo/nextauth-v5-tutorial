'use server';

import * as z from 'zod';

import { LoginSchema } from '@/schemas';

import { signIn } from '@/auth';
import { DEFAULT_LOGIN_REDIRECT } from '@/routes';
import { AuthError } from 'next-auth';

export const login = async (data: z.infer<typeof LoginSchema>) => {
  const validateData = LoginSchema.safeParse(data);

  if (!validateData.success) {
    return { error: 'Login error' };
  }
  const { email, password } = validateData.data;

  try {
    await signIn('credentials', {
      email,
      password,
      redirectTo: DEFAULT_LOGIN_REDIRECT,
    });
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return { error: 'Invalid credentials!' };
        default:
          return { error: 'Login error!' };
      }
    }
    throw error;
  }
};
