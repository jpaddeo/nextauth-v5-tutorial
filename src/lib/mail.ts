import email from 'next-auth/providers/email';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendVerificationTokenEmail = async (
  email: string,
  token: string
) => {
  const confirmationLink = `${
    process.env.APP_URL || 'http://localhost:3000'
  }/auth/verify-token?token=${token}`;

  await resend.emails.send({
    from: 'onboarding@resend.dev',
    to: email,
    subject: '[FlaGo Zone] - Confirm your email',
    html: `<p>Click <a href="${confirmationLink}">here</a> to confirm your email.</p>`,
  });
};

export const sendResetPasswordTokenEmail = async (
  email: string,
  token: string
) => {
  const resetLink = `${
    process.env.APP_URL || 'http://localhost:3000'
  }/auth/reset?token=${token}`;

  await resend.emails.send({
    from: 'onboarding@resend.dev',
    to: email,
    subject: '[FlaGo Zone] - Reset your password',
    html: `<p>Click <a href="${resetLink}">here</a> to reset your password.</p>`,
  });
};
