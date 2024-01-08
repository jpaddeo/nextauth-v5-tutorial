import { ExclamationTriangleIcon } from '@radix-ui/react-icons';

import CardWrapper from '@/components/auth/card-wrapper';

type ErrorCardProps = {};

export default function ErrorCard({}: ErrorCardProps) {
  return (
    <CardWrapper
      headerLabel='Opps! Something went wrong!'
      backButtonLabel='Back to login'
      backButtonHref='/auth/login'
    >
      <div className='w-full flex items-center justify-center'>
        <ExclamationTriangleIcon className='text-destructive w-8 h-8' />
      </div>
    </CardWrapper>
  );
}
