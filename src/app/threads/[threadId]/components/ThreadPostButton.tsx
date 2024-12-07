import { MessageSquareText } from 'lucide-react';
import type { FC } from 'react';

import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export const ThreadPostButton: FC = () => {
  return (
    // shadcnのDialogTriggerで動かなかったのでdivで対応
    <div
      className={cn(
        buttonVariants({ variant: 'default' }),
        'fixed right-4 bottom-[calc(env(safe-area-inset-bottom)+1rem)] p-0 rounded-full size-[60px]',
      )}
    >
      <MessageSquareText className="!size-6 text-white" />
    </div>
  );
};
