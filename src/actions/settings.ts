'use server';

import * as z from 'zod';
import bcrypt, { hash } from 'bcryptjs';

import { SettingsSchema } from '@/schemas';

import { db } from '@/lib/db';
import { userSvc } from '@/services/user';
import { currentUser } from '@/lib/auth';
import { verificationTokenSvc } from '@/services/verification-token';
import { sendVerificationTokenEmail } from '@/lib/mail';
import { getRandomValues } from 'crypto';

export const settings = async (data: z.infer<typeof SettingsSchema>) => {
  const user = await currentUser();
  if (!user) return { error: 'Unauthorized' };

  const dbUser = await userSvc.userById(user.id);
  if (!dbUser) return { error: 'Unauthorized' };

  if (user.isOAuth) {
    data.email = undefined;
    data.password = undefined;
    data.newPassword = undefined;
    data.isTwoFactorEnabled = undefined;
  }

  if (data.email && data.email !== dbUser.email) {
    const existingUserWithEmail = await userSvc.userByEmail(data.email);
    if (existingUserWithEmail && existingUserWithEmail.id !== user.id)
      return { error: 'Email already in use' };

    const verificationToken =
      await verificationTokenSvc.generateVerificationToken(data.email);

    await sendVerificationTokenEmail(
      verificationToken.email,
      verificationToken.token
    );
    return { success: 'Verificaiton email sent!' };
  }

  if (data.password && data.newPassword && dbUser.password) {
    const passwordMatches = await bcrypt.compare(
      data.password,
      dbUser.password
    );
    if (!passwordMatches) return { error: 'Invalid password' };

    const hashesNewPassword = await bcrypt.hash(data.newPassword, 10);
    data.password = hashesNewPassword;
    data.newPassword = undefined;
  }

  const validData = SettingsSchema.safeParse(data);
  if (!validData.success) return { error: 'Invalid fields and data' };

  await db.user.update({
    where: {
      id: dbUser.id,
    },
    data: {
      ...validData.data,
    },
  });
  return { success: 'Settings updated' };
};
