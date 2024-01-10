'use client';

import { logout } from '@/actions/logout';
import { Button } from '../ui/button';

type LogoutButtonProps = {
  children?: React.ReactNode;
};

export default function LogoutButton({ children }: LogoutButtonProps) {
  const handleLogout = async () => {
    await logout();
  };

  return (
    <Button variant='outline' onClick={handleLogout}>
      {children}
    </Button>
  );
}
