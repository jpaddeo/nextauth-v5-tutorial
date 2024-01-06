'use client';

import { useState, useTransition } from 'react';

import * as z from 'zod';
import { useForm } from 'react-hook-form';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

import { zodResolver } from '@hookform/resolvers/zod';

import { register } from '@/actions/register';

import { RegisterSchema } from '@/schemas';

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

type RegisterFormProps = {};

export default function RegisterForm({}: RegisterFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | undefined>('');
  const [successMessage, setSuccessMessage] = useState<string | undefined>('');

  const [isPending, startTransition] = useTransition();
  const form = useForm<z.infer<typeof RegisterSchema>>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      password_confirmation: '',
    },
  });

  const toogleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const onSubmit = (data: z.infer<typeof RegisterSchema>) => {
    setErrorMessage('');
    setSuccessMessage('');

    startTransition(() => {
      register(data).then((response) => {
        setErrorMessage(response.error);
        setSuccessMessage(response.success);
      });
    });
  };

  return (
    <CardWrapper
      headerLabel='Please fill the form to register'
      backButtonLabel='Already has an account?'
      backButtonHref='/auth/login'
      showSocial
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
          <div className='space-y-4'>
            <FormField
              control={form.control}
              name='name'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={isPending}
                      placeholder='User ComposeIT'
                      type='text'
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
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
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='password_confirmation'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm password</FormLabel>
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
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormSuccess message={successMessage} />
          <FormError message={errorMessage} />
          <Button type='submit' className='w-full' disabled={isPending}>
            Register
          </Button>
        </form>
      </Form>
    </CardWrapper>
  );
}
