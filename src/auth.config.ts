import type { NextAuthConfig } from 'next-auth';

import GitHub from 'next-auth/providers/github';
import Credentials from 'next-auth/providers/credentials';

import bcrypt from 'bcryptjs';

import { LoginSchema } from '@/schemas';
import { userSvc } from './services/user';

export default {
  providers: [
    Credentials({
      async authorize(credentials) {
        const validatedData = LoginSchema.safeParse(credentials);

        if (validatedData.success) {
          const { email, password } = validatedData.data;
          const user = await userSvc.userByEmail(email);
          if (!user || !user.password) return null;
          const passwordMatch = await bcrypt.compare(password, user.password);
          if (passwordMatch) return user;
        }

        return null;
      },
    }),
    GitHub,
  ],
} satisfies NextAuthConfig;
