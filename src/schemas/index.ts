import * as z from 'zod';

const LoginSchema = z.object({
  email: z.string().email({
    message: 'Email is required',
  }),
  password: z.string().min(1, {
    message: 'Password is required',
  }),
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
export { LoginSchema, RegisterSchema, ResetSchema };
