'use server';

import * as z from 'zod';

import { LoginSchema } from '@/schemas';

import { signIn } from '@/auth';
import { DEFAULT_LOGIN_REDIRECT } from '@/routes';
import { AuthError } from 'next-auth';
import { userSvc } from '@/services/user';
import { verificationTokenSvc } from '@/services/verification-token';
import { sendVerificationTokenEmail } from '@/lib/mail';

export const login = async (data: z.infer<typeof LoginSchema>) => {
  const validateData = LoginSchema.safeParse(data);

  if (!validateData.success) {
    return { error: 'Login error' };
  }
  const { email, password } = validateData.data;

  const existingUser = await userSvc.userByEmail(email);

  if (!existingUser || !existingUser.email || !existingUser.password)
    return { error: 'Email does not exists!' };

  if (!existingUser.emailVerified) {
    const verificationToken =
      await verificationTokenSvc.generateVerificationToken(existingUser.email);

    await sendVerificationTokenEmail(
      verificationToken.email,
      verificationToken.token
    );
    return { success: 'Confirmation email sent!' };
  }

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
