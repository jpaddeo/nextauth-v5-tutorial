const publicRoutes = ['/', '/auth/verify-token'];
const authRoutes = [
  '/auth/login',
  '/auth/register',
  '/auth/error',
  '/auth/reset',
];
const apiAuthPrefix = '/api/auth';
const DEFAULT_LOGIN_REDIRECT = '/settings';

export { publicRoutes, authRoutes, apiAuthPrefix, DEFAULT_LOGIN_REDIRECT };
