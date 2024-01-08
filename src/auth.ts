import NextAuth from 'next-auth';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { PrismaClient, UserRole } from '@prisma/client';

import authConfig from '@/auth.config';
import { userSvc } from '@/services/user';

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
    async signIn({ user }) {
      // const existingUser = await userSvc.userById(user.id);
      // if (!existingUser || !existingUser?.emailVerified || !existingUser.active) return false;
      return true;
    },
    async jwt({ token }) {
      if (!token.sub) return token;

      const existingUser = await userSvc.userById(token.sub);
      if (!existingUser) return token;

      token.role = existingUser.role;
      return token;
    },
    async session({ token, session }) {
      if (token.sub && session.user) {
        session.user.id = token.sub;
      }
      if (token.role && session.user) {
        session.user.role = token.role as UserRole;
      }
      return session;
    },
  },
  ...authConfig,
});
