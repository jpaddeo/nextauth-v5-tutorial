'use server';

import { userSvc } from '@/services/user';
import { verificationTokenSvc } from '@/services/verification-token';

export const verificateToken = async (token: string) => {
  const existingToken = await verificationTokenSvc.verificationTokenByToken(
    token
  );

  if (!existingToken) return { error: 'Token does not exists!' };

  const tokenExpired = new Date(existingToken.expires) < new Date();
  if (tokenExpired) return { error: 'Token expired!' };

  const existingUser = await userSvc.userByEmail(existingToken.email);
  if (!existingUser) return { error: 'User does not exists!' };

  await userSvc.userUpdateById(existingUser.id, {
    emailVerified: new Date(),
    email: existingToken.email,
  });

  await verificationTokenSvc.deleteVerificationTokenById(existingToken.id);

  return { success: 'Email verified!' };
};
