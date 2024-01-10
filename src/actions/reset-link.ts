'use server';

import * as z from 'zod';
import { ResetSchema } from '@/schemas';
import { userSvc } from '@/services/user';
import { resetPasswordTokenSvc } from '@/services/reset-password-token';
import { sendResetPasswordTokenEmail } from '@/lib/mail';

export const resetLink = async (data: z.infer<typeof ResetSchema>) => {
  const validatedData = ResetSchema.safeParse(data);

  if (!validatedData.success) return { error: 'Invalid data / field!' };

  const { email } = validatedData.data;

  const existingUser = await userSvc.userByEmail(email);
  if (!existingUser) return { error: 'Email does not exists!' };

  const resetPasswordToken =
    await resetPasswordTokenSvc.generateResetPasswordToken(email);
  await sendResetPasswordTokenEmail(
    resetPasswordToken.email,
    resetPasswordToken.token
  );

  return { success: 'Reset email was sent!' };
};
