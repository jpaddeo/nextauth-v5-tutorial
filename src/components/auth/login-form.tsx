'use client';

import { useState, useTransition } from 'react';

import * as z from 'zod';
import { useForm } from 'react-hook-form';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

import { zodResolver } from '@hookform/resolvers/zod';

import { LoginSchema } from '@/schemas';

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
import { login } from '@/actions/login';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

type LoginFormProps = {};

export default function LoginForm({}: LoginFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | undefined>('');
  const [successMessage, setSuccessMessage] = useState<string | undefined>('');

  const searchParams = useSearchParams();
  const paramsError =
    searchParams.get('error') === 'OAuthAccountNotLinked'
      ? 'Email already in use with different provider!'
      : '';

  const [isPending, startTransition] = useTransition();
  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const toogleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const onSubmit = (data: z.infer<typeof LoginSchema>) => {
    setErrorMessage('');
    setSuccessMessage('');

    startTransition(() => {
      login(data).then((response) => {
        setErrorMessage(response?.error);
        setSuccessMessage(response?.success);
      });
    });
  };

  return (
    <CardWrapper
      headerLabel='Welcome, please login'
      backButtonLabel='Do not have an account?'
      backButtonHref='/auth/register'
      showSocial
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
            <FormField
              control={form.control}
              name='password'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <div className='flex flex-row items-center justify-center'>
                      <Input
                        {...field}
                        disabled={isPending}
                        type={showPassword ? 'text' : 'password'}
                        placeholder='********'
                      />
                      {showPassword ? (
                        <FaEyeSlash
                          className='w-6 h-6 ml-2 text-gray-400'
                          onClick={toogleShowPassword}
                        />
                      ) : (
                        <FaEye
                          className='w-6 h-6 ml-2 text-gray-400'
                          onClick={toogleShowPassword}
                        />
                      )}
                    </div>
                  </FormControl>
                  <Link href='/auth/forgot-password'>
                    <span className='text-sm text-gray-500 hover:underline'>
                      Forgot password?
                    </span>
                  </Link>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormSuccess message={successMessage} />
          <FormError message={errorMessage || paramsError} />
          <Button type='submit' className='w-full' disabled={isPending}>
            Login
          </Button>
        </form>
      </Form>
    </CardWrapper>
  );
}
