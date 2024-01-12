'use server';

import { currentRole } from '@/lib/auth';
import { UserRole } from '@prisma/client';

export const admin = async () => {
  const role = await currentRole();

  if (role === UserRole.ADMIN) {
    return { success: 'You are allowed to invoke this action' };
  }
  return { error: 'You are not allowed to invoke this action' };
};
