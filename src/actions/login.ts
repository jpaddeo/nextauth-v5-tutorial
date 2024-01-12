'use server';

import * as z from 'zod';

import { LoginSchema } from '@/schemas';

import { signIn } from '@/auth';
import { DEFAULT_LOGIN_REDIRECT } from '@/routes';
import { AuthError } from 'next-auth';
import { userSvc } from '@/services/user';
import { verificationTokenSvc } from '@/services/verification-token';
import {
  sendVerificationTokenEmail,
  sendTwoFactorTokenEmail,
} from '@/lib/mail';
import { twoFactorTokenSvc } from '@/services/two-factor-token';
import { twoFactorConfirmationSvc } from '@/services/two-factor-confirmation';

export const login = async (
  data: z.infer<typeof LoginSchema>,
  callbackUrl?: string | null
) => {
  const validateData = LoginSchema.safeParse(data);

  if (!validateData.success) {
    return { error: 'Login error' };
  }
  const { email, password, code } = validateData.data;

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

  if (existingUser.isTwoFactorEnabled && existingUser.email) {
    if (code) {
      const twoFactorToken = await twoFactorTokenSvc.twoFactorTokenByEmail(
        existingUser.email
      );
      if (!twoFactorToken || twoFactorToken.token !== code) {
        return { error: 'Invalid 2FA code!' };
      }
      const twoFactorTokenExpíred =
        new Date(twoFactorToken.expires) < new Date();
      if (twoFactorTokenExpíred) {
        return { error: '2FA code expired!' };
      }
      await twoFactorTokenSvc.deleteTwoFactorTokenById(twoFactorToken.id);

      const existingTwoFactorConfirmation =
        await twoFactorConfirmationSvc.twoFactorConfirmationByUserId(
          existingUser.id
        );
      if (existingTwoFactorConfirmation) {
        await twoFactorConfirmationSvc.deleteTwoFactorConfirmationById(
          existingTwoFactorConfirmation.id
        );
      }
      await twoFactorConfirmationSvc.createTwoFactorConfirmationUserId(
        existingUser.id
      );
    } else {
      const twoFactorToken = await twoFactorTokenSvc.generateTwoFactorToken(
        existingUser.email
      );
      await sendTwoFactorTokenEmail(twoFactorToken.email, twoFactorToken.token);
      return { twoFactor: true };
    }
  }

  try {
    await signIn('credentials', {
      email,
      password,
      redirectTo: callbackUrl || DEFAULT_LOGIN_REDIRECT,
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
