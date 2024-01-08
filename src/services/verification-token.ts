import { randomUUID } from 'node:crypto';

import { db } from '@/lib/db';

export const verificationTokenSvc = {
  verificationTokenByToken: async (token: string) => {
    try {
      const verificationToken = await db.verificationToken.findUnique({
        where: { token },
      });
      return verificationToken;
    } catch (error) {
      return null;
    }
  },
  verificationTokenByEmail: async (email: string) => {
    try {
      const verificationToken = await db.verificationToken.findFirst({
        where: { email },
      });
      return verificationToken;
    } catch (error) {
      return null;
    }
  },
  deleteVerificationTokenById: async (id: string) => {
    await db.verificationToken.delete({ where: { id } });
  },
  createVerificationTokenEmail: async (email: string) => {
    const token = randomUUID();
    const expires = new Date(new Date().getTime() + 3600 * 1000);
    const verificationToken = await db.verificationToken.create({
      data: {
        token,
        email,
        expires,
      },
    });
    return verificationToken;
  },
  generateVerificationToken: async (email: any) => {
    const existingVerificationToken =
      await verificationTokenSvc.verificationTokenByEmail(email);

    if (existingVerificationToken) {
      await verificationTokenSvc.deleteVerificationTokenById(
        existingVerificationToken.id
      );
    }

    return await verificationTokenSvc.createVerificationTokenEmail(email);
  },
};
