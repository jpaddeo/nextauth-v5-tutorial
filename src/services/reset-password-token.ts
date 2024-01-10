import { randomUUID } from 'node:crypto';

import { db } from '@/lib/db';

export const resetPasswordTokenSvc = {
  resetPasswordTokenByToken: async (token: string) => {
    try {
      const resetPasswordToken = await db.passwordResetToken.findUnique({
        where: { token },
      });
      return resetPasswordToken;
    } catch {
      return null;
    }
  },
  resetPasswordTokenByEmail: async (email: string) => {
    try {
      const resetPasswordToken = await db.passwordResetToken.findFirst({
        where: { email },
      });
      return resetPasswordToken;
    } catch {
      return null;
    }
  },
  deleteResetPasswordTokenById: async (id: string) => {
    await db.passwordResetToken.delete({ where: { id } });
  },
  createResetPasswordTokenEmail: async (email: string) => {
    const token = randomUUID();
    const expires = new Date(new Date().getTime() + 30 * 60 * 1000);  // 30 minutes
    const resetPasswordToken = await db.passwordResetToken.create({
      data: {
        token,
        email,
        expires,
      },
    });
    return resetPasswordToken;
  },
  generateResetPasswordToken: async (email: any) => {
    const existingResetPasswordToken =
      await resetPasswordTokenSvc.resetPasswordTokenByEmail(email);

    if (existingResetPasswordToken) {
      await resetPasswordTokenSvc.deleteResetPasswordTokenById(
        existingResetPasswordToken.id
      );
    }

    return await resetPasswordTokenSvc.createResetPasswordTokenEmail(email);
  },
};
