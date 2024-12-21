import { Metadata } from 'next';

import { HeadingPage } from '@/app/components/heading/HeadingPage';
import { LayoutPadding } from '@/app/components/layout/LayoutPadding';
import { HistoryList } from '@/app/history/components/HistoryList';
import { metadata as defaultMetadata } from '@/app/utils/metadata';
import { SITE_NAME, SITE_URL } from '@/app/utils/siteSettings';

export const metadata: Metadata = {
  ...defaultMetadata,
  title: `更新履歴 | ${SITE_NAME}`,
  description: 'Relumoの更新履歴ページです。新機能や不具合修正の内容を閲覧いただけます。',
  openGraph: {
    ...defaultMetadata.openGraph,
    url: `${SITE_URL}/history`,
  },
};

export default function History() {
  return (
    <LayoutPadding>
      <HeadingPage>更新履歴</HeadingPage>
      <div className="mt-6 grid gap-12">
        <HistoryList />
      </div>
    </LayoutPadding>
  );
}
