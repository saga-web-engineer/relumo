import type { FC } from 'react';

import { ThreadReactionButton } from '@/app/threads/[threadId]/components/ThreadReactionButton';
import prisma from '@/app/lib/db';
import { auth } from '@/app/lib/auth';
import { reactionList } from '@/app/threads/[threadId]/components/data/threadReactionList';

interface Props {
  postId: string;
}

export const ThreadReactionList: FC<Props> = async ({ postId }) => {
  const session = await auth();
  const currentUser = session?.user;

  const post = await prisma.post.findUnique({
    where: { id: postId },
    include: {
      love: {
        select: { id: true },
      },
      angry: {
        select: { id: true },
      },
      horror: {
        select: { id: true },
      },
      smile: {
        select: { id: true },
      },
    },
  });

  if (!post) return;

  return (
    <>
      <div className="flex gap-4 mt-4">
        {reactionList.map((reaction) => (
          <ThreadReactionButton
            name={reaction.name}
            currentUser={currentUser}
            post={post}
            key={reaction.name}
          >
            {reaction.emoji}
          </ThreadReactionButton>
        ))}
      </div>
    </>
  );
};
