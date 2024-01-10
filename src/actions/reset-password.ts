'use server';

import * as z from 'zod';
import bcrypt from 'bcryptjs';

import { userSvc } from '@/services/user';
import { NewPasswordSchema } from '@/schemas';
import { resetPasswordTokenSvc } from '@/services/reset-password-token';

export const resetPassword = async (
  data: z.infer<typeof NewPasswordSchema>,
  token?: string
) => {
  if (!token) return { error: 'Missing reset token!' };

  const existingToken = await resetPasswordTokenSvc.resetPasswordTokenByToken(
    token
  );

  if (!existingToken) return { error: 'Reset token does not exists!' };

  const tokenExpired = new Date(existingToken.expires) < new Date();
  if (tokenExpired) return { error: 'Reset token expired!' };

  const existingUser = await userSvc.userByEmail(existingToken.email);
  if (!existingUser) return { error: 'User does not exists!' };

  const validateData = NewPasswordSchema.safeParse(data);

  if (!validateData.success) {
    return { error: 'Reset password error' };
  }

  const { password } = validateData.data;
  const hashedPassword = await bcrypt.hash(password, 10);

  await userSvc.userUpdateById(existingUser.id, {
    password: hashedPassword,
  });

  await resetPasswordTokenSvc.deleteResetPasswordTokenById(existingToken.id);

  return { success: 'Password changed!' };
};
