'use server';

import * as z from 'zod';
import bcrypt from 'bcryptjs';

import { db } from '@/lib/db';
import { userSvc } from '@/services/user';

import { RegisterSchema } from '@/schemas';

export const register = async (data: z.infer<typeof RegisterSchema>) => {
  const validateData = RegisterSchema.safeParse(data);

  if (!validateData.success) {
    return { error: 'Register error' };
  }

  const { name, email, password } = validateData.data;
  const hashedPassword = await bcrypt.hash(password, 10);

  const existingUser = await userSvc.userByEmail(email);

  if (existingUser) return { error: 'Email already in use!' };

  await db.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
    },
  });

  // TODO: send verification token email

  return { success: 'User created!' };
};
