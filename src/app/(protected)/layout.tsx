import { SessionProvider } from 'next-auth/react';

import { auth } from '@/auth';
import Navbar from './_components/navbar';

type ProtectedLayoutProps = {
  children: React.ReactNode;
};

export default async function ProtectedLayout({
  children,
}: ProtectedLayoutProps) {
  const session = await auth();
  return (
    <SessionProvider session={session}>
      <main className='h-full flex flex-col items-center justify-center gap-y-4 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-sky-400 to-blue-800'>
        <Navbar />
        {children}
      </main>
    </SessionProvider>
  );
}
