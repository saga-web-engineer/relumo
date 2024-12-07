import { AtSign, BadgeCheck, CalendarDays, Frown, Reply, UserRound } from 'lucide-react';
import type { FC } from 'react';

import { Button } from '@/components/ui/button';

import prisma from '@/app/lib/db';
import { ThreadConversationContent } from '@/app/threads/[threadId]/components/ThreadConversationContent';
import { ThreadPostDrawer } from '@/app/threads/[threadId]/components/ThreadPostDrawer';
import { ThreadPostPagination } from '@/app/threads/[threadId]/components/ThreadPostPagination';
import { ThreadReactionList } from '@/app/threads/[threadId]/components/ThreadReactionList';
import dayjs from '@/app/utils/dayjs';
import { SHOW_PAGES } from '@/app/utils/siteSettings';

interface Props {
  threadId: string;
  currentPage: number; // 現在のページ番号
  postsPerPage: number; // 1ページの投稿表示数
}

export const ThreadConversationList: FC<Props> = async ({
  threadId,
  currentPage,
  postsPerPage,
}) => {
  const totalPosts = await prisma.post.count({
    where: { threadId },
  });

  const posts = await prisma.post.findMany({
    where: {
      threadId: threadId,
    },
    orderBy: {
      createdAt: 'desc',
    },
    include: {
      user: true,
    },
    skip: (currentPage - 1) * postsPerPage,
    take: postsPerPage,
  });

  return (
    <>
      <ol className="mt-6">
        {posts.length === 0 ? (
          <li className="flex items-center gap-2">
            投稿がありません
            <Frown size={'1em'} />
            {'< ﾋﾟｴﾝ'}
          </li>
        ) : (
          posts.map((post, index) => (
            <li className="relative border-t last-of-type:border-b p-4 pt-2" key={post.id}>
              <ThreadPostDrawer
                threadId={threadId}
                replyNumber={totalPosts - (currentPage - 1) * postsPerPage - index}
              >
                <Button size="icon" className="absolute right-2 top-2 size-6 rounded-full">
                  <Reply color="white" />
                </Button>
              </ThreadPostDrawer>

              <div className="grid gap-1">
                <div className="flex items-center gap-4">
                  <div className="text-sm text-muted-foreground">
                    #{totalPosts - (currentPage - 1) * postsPerPage - index}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <CalendarDays size={'1em'} />
                    {dayjs(post.createdAt).tz().format('YYYY-MM-DD HH:mm')}
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <UserRound size={'1rem'} />
                  <span className="flex items-center gap-1">
                    {post.user.name}
                    {post.user.isDeveloper && (
                      <BadgeCheck className="text-primary" size={'0.75rem'} />
                    )}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <AtSign size={'1rem'} />
                  *****{post.user.id.slice(-10)}
                </div>
                <div className="mt-4">
                  <ThreadConversationContent threadId={threadId} text={post.content} />
                </div>
                <ThreadReactionList postId={post.id} />
              </div>
            </li>
          ))
        )}
      </ol>
      <div className="mt-10">
        <ThreadPostPagination
          threadId={threadId}
          currentPage={currentPage}
          postsPerPage={postsPerPage}
          totalPosts={totalPosts}
          showPages={SHOW_PAGES}
        />
      </div>
    </>
  );
};
