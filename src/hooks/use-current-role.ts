import { useCurrentUser } from '@/hooks/use-current-user';

export const useCurrentRole = () => {
  const user = useCurrentUser();

  return user?.role;
};
