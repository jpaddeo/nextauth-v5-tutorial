'use client';

import { logout } from '@/actions/logout';

import { useCurrentUser } from '@/hooks/use-current-user';

import { Button } from '@/components/ui/button';

type SettingsPageProps = {};

export default function SettingsPage({}: SettingsPageProps) {
  const user = useCurrentUser();

  const handleLogout = async () => {
    await logout();
  };

  return (
    <section>
      <form action={handleLogout}>
        <Button type='submit' variant='outline'>
          Sign out
        </Button>
      </form>
    </section>
  );
}
