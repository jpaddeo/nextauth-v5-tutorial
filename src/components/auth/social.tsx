'use client';

import { FcGoogle } from 'react-icons/fc';
import { FaGithub } from 'react-icons/fa';

import { signIn } from 'next-auth/react'; // client side function

import { Button } from '@/components/ui/button';
import { DEFAULT_LOGIN_REDIRECT } from '@/routes';
import { useSearchParams } from 'next/navigation';

type SocialProps = {};

export default function Social({}: SocialProps) {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || DEFAULT_LOGIN_REDIRECT;
  const handleOnClick = (provider: 'google' | 'github') => {
    signIn(provider, { callbackUrl });
  };

  return (
    <div className='flex items-center w-full gap-x-2'>
      <Button
        size='lg'
        variant='outline'
        className='w-full'
        onClick={() => handleOnClick('google')}
      >
        <FcGoogle className='w-6 h-6' />
      </Button>
      <Button
        size='lg'
        variant='outline'
        className='w-full'
        onClick={() => handleOnClick('github')}
      >
        <FaGithub className='w-6 h-6' />
      </Button>
    </div>
  );
}
