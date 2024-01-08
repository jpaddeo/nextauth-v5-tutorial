'use client';

import { useCallback, useEffect, useState } from 'react';

import { useSearchParams } from 'next/navigation';

import { verificateToken } from '@/actions/verificate-token';

import CardWrapper from '@/components/auth/card-wrapper';
import FormError from '@/components/ui/form-error';
import FormSuccess from '@/components/ui/form-success';

type VerifyTokenFormProps = {};

export default function VerifyTokenForm({}: VerifyTokenFormProps) {
  const [error, setError] = useState<string | undefined>('');
  const [success, setSuccess] = useState<string | undefined>('');

  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const handleSubmit = useCallback(() => {
    if (success || error) return;
    if (!token) {
      setError('Missing Token');
      return;
    }

    verificateToken(token).then((response) => {
      setError(response?.error);
      setSuccess(response?.success);
    });
  }, [token, success, error]);

  useEffect(() => {
    handleSubmit();
  }, [handleSubmit]);

  return (
    <CardWrapper
      headerLabel='Confirming your email...'
      backButtonLabel='Back to login'
      backButtonHref='/auth/login'
    >
      <div className='w-full flex flex-col items-center justify-center'>
        {!error && !success && <p className='animate-pulse'>Verifying....</p>}
        <FormSuccess message={success} />
        {!success && <FormError message={error} />}
      </div>
    </CardWrapper>
  );
}
