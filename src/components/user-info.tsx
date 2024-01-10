import { ExtendedUser } from '@/next-auth';

import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from './ui/badge';

type UserInfoProps = {
  label: string;
  user?: ExtendedUser;
};

type UserInfoItemProps = {
  label: string;
  value?: string;
  badge?: React.ReactNode;
};

const UserInfoItem = ({
  label,
  value = '',
  badge = null,
}: UserInfoItemProps) => {
  return (
    <div className='flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm'>
      <p className='text-sm font-medium'>{label}</p>
      {badge}
      {!badge && (
        <p className='truncate text-xs max-w-[180px] font-mono p-1 bg-slate-100 rounded-md'>
          {value || ''}
        </p>
      )}
    </div>
  );
};

export default function UserInfo({ user, label }: UserInfoProps) {
  return (
    <Card className='w-[600px] shadow-md'>
      <CardHeader>
        <p className='text-2xl font-bold text-center'>{label}</p>
      </CardHeader>
      <CardContent className='space-y-4'>
        <UserInfoItem label='ID' value={user?.id || ''} />
        <UserInfoItem label='Name' value={user?.name || ''} />
        <UserInfoItem label='Email' value={user?.email || ''} />
        <UserInfoItem label='Role' value={user?.role || ''} />
        <UserInfoItem
          label='2FA Enabled'
          badge={
            <Badge
              variant={user?.isTwoFactorEnabled ? 'success' : 'destructive'}
            >
              {user?.isTwoFactorEnabled ? 'ON' : 'OFF'}
            </Badge>
          }
        />
      </CardContent>
    </Card>
  );
}
