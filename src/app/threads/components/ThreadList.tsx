import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import { BadgeCheck, CalendarDays, Frown, MessageCircle, UserRound } from 'lucide-react';
import Link from 'next/link';
import type { FC } from 'react';

import prisma from '@/app/lib/db';
import { ThreadPagination } from '@/app/threads/components/ThreadPagination';
import { getBadge } from '@/app/threads/components/utils/getBadge';
import { getThreads } from '@/app/threads/components/utils/getThreads';
import { SHOW_PAGES } from '@/app/utils/siteSettings';

interface Props {
  currentPage: number; // 現在のページ番号
  threadsPerPage: number; // 1ページのスレッド表示数
}

// UTCプラグインを読み込み
dayjs.extend(utc);
// timezoneプラグインを読み込み
dayjs.extend(timezone);
// タイムゾーンのデフォルトをJST化
dayjs.tz.setDefault('Asia/Tokyo');

export const ThreadList: FC<Props> = async ({ currentPage, threadsPerPage }) => {
  const threads = await getThreads({ currentPage, threadsPerPage });

  const totalThreads = await prisma.thread.count();

  return (
    <>
      <ul className="mt-6">
        {totalThreads === 0 ? (
          <li className="flex items-center gap-2">
            スレッドがありません
            <Frown size={'1em'} />
            {'< ﾋﾟｴﾝ'}
          </li>
        ) : (
          await Promise.all(
            threads.map(async (thread) => {
              // isDeveloper を取得
              const badge = await getBadge(thread.userId);
              const isDeveloper = badge?.isDeveloper;

              return (
                <li key={thread.id} className="border-t last:border-b">
                  <Link
                    className="grid gap-2 p-4 hover:bg-muted transition-colors"
                    href={`/threads/${thread.id}`}
                  >
                    <h2 className="font-bold text-lg">{thread.title}</h2>
                    <p className="text-sm text-muted-foreground">{thread.bio}</p>
                    <p className="flex items-center gap-2 text-sm text-muted-foreground">
                      <UserRound size={'1rem'} />
                      <span className="flex items-center gap-1">
                        {thread.userName}
                        {isDeveloper && <BadgeCheck className="text-primary" size={'0.75rem'} />}
                      </span>
                    </p>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <p className="flex items-center gap-2">
                        <MessageCircle size={'1em'} />
                        {thread.postCount}
                      </p>
                      <p className="flex items-center gap-2">
                        <CalendarDays size={'1em'} />
                        {dayjs(thread.latestDate).tz('Asia/Tokyo').format('YYYY-MM-DD HH:mm')}
                      </p>
                    </div>
                  </Link>
                </li>
              );
            })
          )
        )}
      </ul>
      <div className="mt-10">
        <ThreadPagination
          currentPage={currentPage}
          threadsPerPage={threadsPerPage}
          totalThreads={totalThreads}
          showPages={SHOW_PAGES}
        />
      </div>
    </>
  );
};
