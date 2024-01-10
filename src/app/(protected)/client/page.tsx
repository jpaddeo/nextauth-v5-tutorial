'use client';

import { useCurrentUser } from '@/hooks/use-current-user';

import UserInfo from '@/components/user-info';

type ClientPageProps = {};

export default function ClientPage({}: ClientPageProps) {
  const user = useCurrentUser();

  return <UserInfo user={user} label='🌎 Client Page' />;
}
