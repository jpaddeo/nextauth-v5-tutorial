import { db } from '@/lib/db';

export const twoFactorConfirmationSvc = {
  twoFactorConfirmationByUserId: async (userId: string) => {
    try {
      const twoFactorConfirmation = await db.twoFactorConfirmation.findUnique({
        where: { userId },
      });
      return twoFactorConfirmation;
    } catch {
      return null;
    }
  },
  deleteTwoFactorConfirmationById: async (id: string) => {
    await db.twoFactorConfirmation.delete({ where: { id } });
  },
  createTwoFactorConfirmationUserId: async (userId: string) => {
    const twoFactorConfirmation = await db.twoFactorConfirmation.create({
      data: {
        userId,
      },
    });
    return twoFactorConfirmation;
  },
};
