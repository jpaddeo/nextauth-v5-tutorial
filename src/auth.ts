import NextAuth from 'next-auth';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { PrismaClient, UserRole } from '@prisma/client';

import authConfig from '@/auth.config';
import { userSvc } from '@/services/user';
import { twoFactorConfirmationSvc } from '@/services/two-factor-confirmation';
import { accountSvc } from '@/services/account';

const prisma = new PrismaClient();

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: 'jwt' },
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider !== 'credentials') return true;

      const existingUser = await userSvc.userById(user.id);
      if (!existingUser || !existingUser?.emailVerified) return false;

      if (existingUser.isTwoFactorEnabled) {
        const twoFactorConfirmation =
          await twoFactorConfirmationSvc.twoFactorConfirmationByUserId(
            existingUser.id
          );
        if (!twoFactorConfirmation) return false;

        await twoFactorConfirmationSvc.deleteTwoFactorConfirmationById(
          twoFactorConfirmation.id
        );
      }
      return true;
    },
    async jwt({ token }) {
      if (!token.sub) return token;

      const existingUser = await userSvc.userById(token.sub);
      if (!existingUser) return token;

      const existingAccount = await accountSvc.accountByUserId(existingUser.id);

      token.isOAuth = !!existingAccount;
      token.role = existingUser.role;
      token.name = existingUser.name;
      token.email = existingUser.email;
      token.isTwoFactorEnabled = existingUser.isTwoFactorEnabled;
      return token;
    },
    async session({ token, session }) {
      if (token.sub && session.user) {
        session.user.id = token.sub;
      }
      if (token.role && session.user) {
        session.user.role = token.role as UserRole;
      }
      if (token.isTwoFactorEnabled && session.user) {
        session.user.isTwoFactorEnabled = token.isTwoFactorEnabled as boolean;
      }
      if (session.user) {
        session.user.name = token.name as string;
        session.user.email = token.email as string;
        session.user.isOAuth = token.isOAuth as boolean;
      }
      return session;
    },
  },
  pages: {
    signIn: '/auth/login',
    error: '/auth/error',
  },
  events: {
    async linkAccount({ user }) {
      // para OAuth providers verificamos automáticamente basado en la verficación de cada uno
      await userSvc.userUpdateById(user.id, { emailVerified: new Date() });
    },
  },
  ...authConfig,
});
