import { randomInt } from 'node:crypto';

import { db } from '@/lib/db';

export const twoFactorTokenSvc = {
  twoFactorTokenByToken: async (token: string) => {
    try {
      const twoFactorToken = await db.twoFactorToken.findUnique({
        where: { token },
      });
      return twoFactorToken;
    } catch {
      return null;
    }
  },
  twoFactorTokenByEmail: async (email: string) => {
    try {
      const twoFactorToken = await db.twoFactorToken.findFirst({
        where: { email },
      });
      return twoFactorToken;
    } catch {
      return null;
    }
  },
  deleteTwoFactorTokenById: async (id: string) => {
    await db.twoFactorToken.delete({ where: { id } });
  },
  createTwoFactorTokenEmail: async (email: string) => {
    const token = randomInt(100_000, 1_000_000).toString();
    const expires = new Date(new Date().getTime() + 5 * 60 * 1000); // 15 minutes
    const twoFactorToken = await db.twoFactorToken.create({
      data: {
        token,
        email,
        expires,
      },
    });
    return twoFactorToken;
  },
  generateTwoFactorToken: async (email: any) => {
    const existingtwoFactorToken =
      await twoFactorTokenSvc.twoFactorTokenByEmail(email);

    if (existingtwoFactorToken) {
      await twoFactorTokenSvc.deleteTwoFactorTokenById(
        existingtwoFactorToken.id
      );
    }

    return await twoFactorTokenSvc.createTwoFactorTokenEmail(email);
  },
};
