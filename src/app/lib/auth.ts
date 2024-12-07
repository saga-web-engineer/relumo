import { PrismaAdapter } from '@auth/prisma-adapter';
import Google from 'next-auth/providers/google';
import Twitter from 'next-auth/providers/twitter';
import NextAuth, { DefaultSession, User } from 'next-auth';

import prisma from '@/app/lib/db';
declare module 'next-auth' {
  interface Session {
    user: User &
      DefaultSession['user'] & {
        isLicense: boolean;
      };
  }
}

export const { handlers, signIn, signOut, auth, unstable_update } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [Google, Twitter],
  callbacks: {
    // sessionにisLicense（招待コードを入力したか）の情報を含める
    async session({ session }) {
      const user = await prisma.user.findUnique({
        where: {
          id: session.userId,
        },
        select: {
          isLicense: true,
        },
      });
      session.user.isLicense = !!user?.isLicense; // nullの場合はfalseとしてsessionに含める
      return session;
    },
  },
});
