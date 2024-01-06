import { Poppins } from 'next/font/google';

import { cn } from '@/lib/utils';

type HeaderProps = {
  label: string;
};

const poppinsFont = Poppins({
  subsets: ['latin'],
  weight: ['600'],
});

export default function Header({ label }: HeaderProps) {
  return (
    <div className='w-full flex flex-col gap-y-4 items-center justify-center'>
      <h1 className={cn('text-3xl font-semibold', poppinsFont.className)}>
        🛅 Auth
      </h1>
      <p className='text-muted-foreground text-sm'>{label}</p>
    </div>
  );
}
