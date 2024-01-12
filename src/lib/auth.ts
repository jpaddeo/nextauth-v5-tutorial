import { auth } from '@/auth';

const currentUser = async () => {
  const session = await auth();
  return session?.user;
};

const currentRole = async () => {
  const user = await currentUser();
  return user?.role;
};

export { currentUser, currentRole };
