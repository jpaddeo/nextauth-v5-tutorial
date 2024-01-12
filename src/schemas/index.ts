import { UserRole } from '@prisma/client';
import * as z from 'zod';

const LoginSchema = z.object({
  email: z.string().email({
    message: 'Email is required',
  }),
  password: z.string().min(1, {
    message: 'Password is required',
  }),
  code: z.optional(z.string()),
});

const RegisterSchema = z
  .object({
    name: z.string().min(1, {
      message: 'Name is required',
    }),
    email: z.string().email({
      message: 'Email is required',
    }),
    password: z.string().min(6, {
      message: 'Password is required and it must be at least 6 characters',
    }),
    password_confirmation: z.string(),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: 'Passwords must match',
    path: ['password_confirmation'],
  });

const ResetSchema = z.object({
  email: z.string().email({
    message: 'Email is required',
  }),
});

const NewPasswordSchema = z
  .object({
    password: z.string().min(6, {
      message: 'Password is required and it must be at least 6 characters',
    }),
    password_confirmation: z.string(),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: 'Passwords must match',
    path: ['password_confirmation'],
  });

const SettingsSchema = z
  .object({
    name: z.string().min(1, {
      message: 'Name is required',
    }),
    isTwoFactorEnabled: z.optional(z.boolean()),
    role: z.enum([UserRole.USER, UserRole.ADMIN]),
    email: z.optional(z.string().email()),
    password: z.optional(z.string().min(6)),
    newPassword: z.optional(z.string().min(6)),
  })
  .refine(
    (data) => {
      if (!data.password && data.newPassword) {
        return false;
      }
      return true;
    },
    {
      message:
        'Current password is required if you want to change your password',
      path: ['password'],
    }
  );

export {
  LoginSchema,
  RegisterSchema,
  ResetSchema,
  NewPasswordSchema,
  SettingsSchema,
};
