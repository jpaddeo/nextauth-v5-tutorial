'use server';

import * as z from 'zod';
import { ResetSchema } from '@/schemas';
import { userSvc } from '@/services/user';

export const reset = async (data: z.infer<typeof ResetSchema>) => {
  const validatedData = ResetSchema.safeParse(data);

  if (!validatedData.success) return { error: 'Invalid data / field!' };

  const { email } = validatedData.data;

  const existingUser = await userSvc.userByEmail(email);
  if (!existingUser) return { error: 'Email does not exists!' };

  // TODO: generate token and send emial

  return { success: 'Reset email was sent!' };
};
