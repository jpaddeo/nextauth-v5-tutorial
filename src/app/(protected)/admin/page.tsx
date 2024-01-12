'use client';

import { UserRole } from '@prisma/client';

import { Card, CardContent, CardHeader } from '@/components/ui/card';
import RoleGate from '@/components/auth/role-gate';
import FormSuccess from '@/components/ui/form-success';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { admin } from '@/actions/admin';

type AdminPageProps = {};

export default function AdminPage({}: AdminPageProps) {
  const onAdminApiRouteClick = () => {
    fetch('/api/admin').then((response) => {
      if (response.ok) {
        toast({
          title: 'Success',
          description: 'Admin API Route is working!',
        });
      } else {
        console.error('NOT OK');
        toast({
          variant: 'destructive',
          title: 'Error',
          description:
            'You does not have privileges to invoke it or something went wrong!',
        });
      }
    });
  };

  const onAdminServerActionClick = () => {
    admin().then((data) => {
      if (data.error) {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: data.error,
        });
      }
      if (data.success) {
        toast({
          title: 'Success',
          description: data.success,
        });
      }
    });
  };

  return (
    <Card>
      <CardHeader>
        <p className='text-2xl font-bold text-center'>🔐 Admin</p>
      </CardHeader>
      <CardContent className='flex flex-col gap-y-4'>
        <RoleGate allowedRoles={[UserRole.ADMIN]}>
          <FormSuccess message='You are authorized to view this page!' />
        </RoleGate>
        <div className='flex flex-row items-center justify-between rounded-lg border p-3 shadow-md'>
          <p className='text-sm font-medium'>Admin-only API Route</p>
          <Button onClick={onAdminApiRouteClick}>Click to test</Button>
        </div>
        <div className='flex flex-row items-center justify-between rounded-lg border p-3 shadow-md'>
          <p className='text-sm font-medium'>Admin-only Server Action</p>
          <Button onClick={onAdminServerActionClick}>Click to test</Button>
        </div>
      </CardContent>
    </Card>
  );
}
