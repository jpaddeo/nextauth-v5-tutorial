'use client';

import { useState, useTransition } from 'react';

import * as z from 'zod';
import { useForm } from 'react-hook-form';

import { zodResolver } from '@hookform/resolvers/zod';

import { ResetSchema } from '@/schemas';

import { reset } from '@/actions/reset';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import FormError from '@/components/ui/form-error';
import FormSuccess from '@/components/ui/form-success';
import CardWrapper from '@/components/auth/card-wrapper';

type ResetFormProps = {};

export default function ResetForm({}: ResetFormProps) {
  const [errorMessage, setErrorMessage] = useState<string | undefined>('');
  const [successMessage, setSuccessMessage] = useState<string | undefined>('');

  const [isPending, startTransition] = useTransition();
  const form = useForm<z.infer<typeof ResetSchema>>({
    resolver: zodResolver(ResetSchema),
    defaultValues: {
      email: '',
    },
  });

  const onSubmit = (data: z.infer<typeof ResetSchema>) => {
    setErrorMessage('');
    setSuccessMessage('');

    startTransition(() => {
      reset(data).then((response) => {
        setErrorMessage(response?.error);
        setSuccessMessage(response?.success);
      });
    });
  };

  return (
    <CardWrapper
      headerLabel='Forgot your password?'
      backButtonLabel='Back to login'
      backButtonHref='/auth/login'
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
          <div className='space-y-4'>
            <FormField
              control={form.control}
              name='email'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={isPending}
                      placeholder='user@composeit.ar'
                      type='email'
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormSuccess message={successMessage} />
          <FormError message={errorMessage} />
          <Button type='submit' className='w-full' disabled={isPending}>
            Request reset
          </Button>
        </form>
      </Form>
    </CardWrapper>
  );
}
