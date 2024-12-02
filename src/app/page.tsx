import { Metadata } from 'next';
import { redirect } from 'next/navigation';

import { ButtonGoogleAuth } from '@/app/components/button/ButtonGoogleAuth';
import { ButtonTwitterAuth } from '@/app/components/button/ButtonTwitterAuth';
import { Logo } from '@/app/components/Logo';
import { auth, signIn } from '@/app/lib/auth';
import { metadata as defaultMetadata } from '@/app/utils/metadata';
import { SITE_NAME } from '@/app/utils/siteSettings';

export const metadata: Metadata = {
  ...defaultMetadata,
};

export default async function Home() {
  const session = await auth();

  // 招待コード入力済みのログインユーザーはスレッド一覧ページへリダイレクト
  if (session?.user.isLicense) redirect('/threads');

  // 招待コードを入力していないログインユーザーは招待コード入力ページへリダイレクト
  if (session?.user && !session.user.isLicense) redirect('/license');

  return (
    <>
      <div className="pb-2 pt-12 flex flex-col h-full md:pt-24">
        <Logo width={200} height={47} className="mx-auto w-4/5 max-w-md" />
        <p className="[word-break:keep-all] [overflow-wrap:anywhere] my-auto pt-8 text-2xl leading-relaxed sm:leading-[1.85] sm:text-4xl">
          {SITE_NAME}へ
          <wbr />
          ようこそ。
          <wbr />
          Relumoは、
          <wbr />
          招待された人だけが
          <wbr />
          参加できる
          <wbr />
          プライベートな
          <wbr />
          掲示板アプリ。
          <wbr />
          仕事の話や
          <wbr />
          何気ない雑談も、
          <wbr />
          気ままにシェア。
          <wbr />
          もっと自由に、
          <wbr />
          もっと開放的に。
          <wbr />
          安心して心を開ける
          <wbr />
          プライベートな空間を
          <wbr />
          提供します。
        </p>
        <div className="grid gap-6 py-6 my-auto">
          <form
            className="w-full sm:max-w-[420px] sm:mx-auto"
            action={async () => {
              'use server';
              await signIn('twitter');
            }}
          >
            <ButtonTwitterAuth />
          </form>
          <form
            className="w-full sm:max-w-[420px] sm:mx-auto"
            action={async () => {
              'use server';
              await signIn('google');
            }}
          >
            <ButtonGoogleAuth />
          </form>
        </div>
      </div>
    </>
  );
}
