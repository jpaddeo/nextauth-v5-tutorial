'use client';

import { UserRole } from '@prisma/client';

import { useCurrentRole } from '@/hooks/use-current-role';

import FormError from '@/components/ui/form-error';

type RoleGateProps = {
  children: React.ReactNode;
  allowedRoles: UserRole[];
};

export default function RoleGate({ children, allowedRoles }: RoleGateProps) {
  const role = useCurrentRole();

  if (!allowedRoles.includes(role!)) {
    return <FormError message='You are not authorized to view this page!' />;
  }

  return <>{children}</>;
}
