'use server';

import * as z from 'zod';

import { SettingsSchema } from '@/schemas';

import { db } from '@/lib/db';
import { userSvc } from '@/services/user';
import { currentUser } from '@/lib/auth';

export const settings = async (data: z.infer<typeof SettingsSchema>) => {
  const user = await currentUser();
  if (!user) return { error: 'Unauthorized' };

  const dbUser = await userSvc.userById(user.id);
  if (!dbUser) return { error: 'Unauthorized' };

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
};