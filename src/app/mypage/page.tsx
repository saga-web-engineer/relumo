import { Metadata } from 'next';
import { redirect } from 'next/navigation';

import { HeadingPage } from '@/app/components/heading/HeadingPage';
import { LayoutPadding } from '@/app/components/layout/LayoutPadding';
import { auth } from '@/app/lib/auth';
import prisma from '@/app/lib/db';
import { InviteTabs } from '@/app/mypage/component/InviteTabs';
import { SettingForm } from '@/app/mypage/component/SettingForm';
import dayjs from '@/app/utils/dayjs';
import { metadata as defaultMetadata } from '@/app/utils/metadata';
import { SITE_NAME, SITE_URL } from '@/app/utils/siteSettings';

export const metadata: Metadata = {
  ...defaultMetadata,
  title: `マイページ | ${SITE_NAME}`,
  description: 'Relumoのユーザー情報を設定できます。',
  openGraph: {
    ...defaultMetadata.openGraph,
    url: `${SITE_URL}/mypage`,
  },
};

export default async function Setting() {
  const session = await auth();
  if (!session?.user.isLicense) redirect('/');

  const user = await prisma.user.findUnique({
    where: {
      id: session.user.id,
    },
    select: { name: true, id: true, createdAt: true, invitee: true, inviter: true },
  });

  const { name, id, createdAt, invitee, inviter } = user || {};

  return (
    <LayoutPadding>
      <HeadingPage>マイページ</HeadingPage>
      <div className="grid gap-8">
        <SettingForm defaultValue={{ name }} />
        <div className="px-1 pb-1 border-b">
          <p className="font-medium">ID</p>
          <p>{id}</p>
        </div>
        <div className="px-1 pb-1 border-b">
          <p className="font-medium">アカウント作成日</p>
          <p>{dayjs(createdAt).tz().format('YYYY-MM-DD')}</p>
        </div>
      </div>
      <InviteTabs invitee={invitee} inviter={inviter} />
    </LayoutPadding>
  );
}
