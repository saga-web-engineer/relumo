import { Metadata } from 'next';

import { HeadingPage } from '@/app/components/heading/HeadingPage';
import { LayoutPadding } from '@/app/components/layout/LayoutPadding';
import { PolicyContent } from '@/app/policy/components/PolicyContent';
import { metadata as defaultMetadata } from '@/app/utils/metadata';
import { SITE_NAME, SITE_URL } from '@/app/utils/siteSettings';

export const metadata: Metadata = {
  ...defaultMetadata,
  title: `プライバシーポリシー | ${SITE_NAME}`,
  description: 'Relumoのプライバシーポリシーページです。ご一読ください。',
  openGraph: {
    ...defaultMetadata.openGraph,
    url: `${SITE_URL}/history`,
  },
};

export default function Page() {
  return (
    <LayoutPadding>
      <HeadingPage>プライバシーポリシー</HeadingPage>
      <div className="mt-6 grid gap-12">
        <PolicyContent />
      </div>
    </LayoutPadding>
  );
}
