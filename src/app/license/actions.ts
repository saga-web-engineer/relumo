'use server';

import { auth, unstable_update } from '@/app/lib/auth';
import prisma from '@/app/lib/db';
import { parseWithZod } from '@conform-to/zod';
import { redirect } from 'next/navigation';
import { inviteCodeSchema } from './schema';

export const getUserByInviteCode = async (_prevState: unknown, formData: FormData) => {
  const session = await auth();

  if (!session) redirect('/');

  const submission = parseWithZod(formData, { schema: inviteCodeSchema });

  if (submission.status !== 'success') return submission.reply();

  try {
    const inviter = await prisma.user.findUnique({
      where: {
        inviteCode: submission.value.inviteCode,
      },
    });

    if (!inviter) {
      return submission.reply({
        fieldErrors: {
          inviteCode: ['入力された招待コードは存在しません。もう一度お友達に聞いてみてね！'],
        },
      });
    }

    await prisma.user.update({
      where: {
        id: session.user?.id,
      },
      data: {
        isLicense: true,
        inviterId: inviter.id,
      },
    });

    // session情報を更新
    unstable_update({
      user: {
        isLicense: true,
      },
    });
  } catch (error) {
    console.log(error);
    return submission.reply();
  }

  redirect('/threads');
};
