'use server';

import { signOut } from '@/auth';

export const logout = async () => {
  // add some server stuff if you need
  await signOut();
};
