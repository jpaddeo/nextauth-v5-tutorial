'use client';

import { useCurrentUser } from '@/hooks/use-current-user';
import { useCurrentRole } from '@/hooks/use-current-role';

import { Card, CardContent, CardHeader } from '@/components/ui/card';

type AdminPageProps = {};

export default function AdminPage({}: AdminPageProps) {
  const user = useCurrentUser();
  const role = useCurrentRole();

  return (
    <Card>
      <CardHeader>
        <p className='text-2xl font-bold text-center'>🔐 Admin</p>
      </CardHeader>
      <CardContent></CardContent>
    </Card>
  );
}
