'use client';

import { FcGoogle } from 'react-icons/fc';
import { FaGithub } from 'react-icons/fa';

import { Button } from '@/components/ui/button';

type SocialProps = {};

export default function Social({}: SocialProps) {
  return (
    <div className='flex items-center w-full gap-x-2'>
      <Button
        size='lg'
        variant='outline'
        className='w-full'
        onClick={() => console.log('facebook')}
      >
        <FcGoogle className='w-6 h-6' />
      </Button>
      <Button
        size='lg'
        variant='outline'
        className='w-full'
        onClick={() => console.log('github')}
      >
        <FaGithub className='w-6 h-6' />
      </Button>
    </div>
  );
}
