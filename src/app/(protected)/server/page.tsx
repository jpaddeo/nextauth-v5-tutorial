import { auth } from '@/auth';
import UserInfo from '@/components/user-info';

type ServerPageProps = {};

export default async function ServerPage({}: ServerPageProps) {
  const session = await auth();

  return <UserInfo user={session?.user} label='💻 Server Page' />;
}
