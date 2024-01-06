'use client';

import { useRouter } from 'next/navigation';

type LoginButtonProps = {
  children: React.ReactNode;
  mode?: 'modal' | 'redirect';
  asChild?: boolean;
};

export default function LoginButton({
  children,
  mode = 'redirect',
  asChild,
}: LoginButtonProps) {
  const router = useRouter();

  const handleOnClick = () => {
    router.push('/auth/login');
  };

  if (mode === 'modal') {
    return (
      <span className='text-red-500 animate-pulse text-2xl font-bold'>
        ¡¡TBD!!
      </span>
    );
  }

  return (
    <span className='cursor-pointer' onClick={handleOnClick}>
      {children}
    </span>
  );
}
