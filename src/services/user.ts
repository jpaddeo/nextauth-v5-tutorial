import { db } from '@/lib/db';

export const userSvc = {
  userById: async (id: string) => {
    try {
      const user = await db.user.findUnique({ where: { id } });
      return user;
    } catch {
      return null;
    }
  },
  userByEmail: async (email: string) => {
    try {
      const user = await db.user.findUnique({ where: { email } });
      return user;
    } catch {
      return null;
    }
  },
  userUpdateById: async (id: string, data: any) => {
    await db.user.update({ where: { id }, data: { ...data } });
  },
};
