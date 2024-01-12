'use client';

import { settings } from '@/actions/settings';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardHeader,
  CardFooter,
  CardContent,
} from '@/components/ui/card';
import { useSession } from 'next-auth/react';
import { useTransition } from 'react';

type SettingsPageProps = {};

export default function SettingsPage({}: SettingsPageProps) {
  const { update: updateSession } = useSession();
  const [isPending, startTransition] = useTransition();

  const handleUpdateClick = () => {
    startTransition(() => {
      settings({
        name: 'PC Service ABT',
      }).then(() => {
        updateSession();
      });
    });
  };
  return (
    <Card className='w-[600px]'>
      <CardHeader>
        <p className='text-2xl text-center font-bold'>🧵 Settings</p>
      </CardHeader>
      <CardContent>
        <Button disabled={isPending} onClick={handleUpdateClick}>
          Update
        </Button>
      </CardContent>
    </Card>
  );
}
