'use client';

import Link from 'next/link';

import { Button } from '@/components/ui/button';

type BackButtonProps = {
  label: string;
  href: string;
};

export default function BackButton({ label, href }: BackButtonProps) {
  return (
    <Button size='sm' variant='link' className='font-normal w-full' asChild>
      <Link href={href}>{label}</Link>
    </Button>
  );
}
