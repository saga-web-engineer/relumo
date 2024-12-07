'use client';

import { Post } from '@prisma/client';
import { Session } from 'next-auth';
import { useOptimistic, type FC } from 'react';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

import { updateReaction } from '@/app/threads/[threadId]/actions';
import { ReactionType } from '@/app/threads/[threadId]/components/data/threadReactionList';

interface Props {
  name: ReactionType;
  currentUser: Session['user'] | undefined;
  post: {
    [key in ReactionType]: {
      id: string;
    }[];
  } & Post;
  children: React.ReactNode;
}

export const ThreadReactionButton: FC<Props> = ({
  name: reactionName,
  currentUser,
  post,
  children,
}) => {
  const [optimisticReactionUsers, addOptimistic] = useOptimistic(
    post[reactionName],
    // updateFn
    (currentState, optimisticValue) => {
      if (!currentUser?.id) return currentState;
      if (optimisticValue === 'true') {
        return [...currentState, { id: currentUser.id }];
      } else {
        return currentState.filter((user) => user.id !== currentUser.id);
      }
    }
  );

  // 自分がリアクションをしているかどうか
  const optimisticReactionState = optimisticReactionUsers.some(
    (user) => user.id === currentUser?.id
  );

  return (
    <form
      action={async (formData: FormData) => {
        updateReaction(formData);
        addOptimistic(formData.get('state'));
      }}
    >
      <input type="hidden" name="postId" value={post.id} />
      <input type="hidden" name="reactionName" value={reactionName} />
      {/* booleanは渡せないのでStringにする */}
      <input type="hidden" name="state" value={String(!optimisticReactionState)} />
      <Button
        variant="outline"
        className={cn('rounded-full h-auto px-2 py-0', {
          'bg-primary text-white hover:bg-primary hover:text-white': optimisticReactionState,
        })}
      >
        <span className="text-lg">{children}</span> {optimisticReactionUsers.length}
      </Button>
    </form>
  );
};
