import { auth, signOut } from '@/auth';
import { Button } from '@/components/ui/button';

type SettingsPageProps = {};

export default async function SettingsPage({}: SettingsPageProps) {
  const session = await auth();

  return (
    <div>
      <h1>Settings</h1>
      <p>Logged in as {JSON.stringify(session)}</p>
      <form
        action={async () => {
          'use server';
          await signOut();
        }}
      >
        <Button type='submit' variant='outline'>
          Sign out
        </Button>
      </form>
    </div>
  );
}
