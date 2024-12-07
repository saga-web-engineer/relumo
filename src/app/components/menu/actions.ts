'use server';

import { signOut } from '@/app/lib/auth';

export const signOutAuth = async () => {
  await signOut();
};
