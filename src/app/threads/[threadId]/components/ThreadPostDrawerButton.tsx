import { Plus } from 'lucide-react';
import type { FC } from 'react';

import { Button } from '@/components/ui/button';

export const ThreadPostDrawerButton: FC = () => {
  return (
    <Button className="fixed right-4 bottom-[calc(env(safe-area-inset-bottom)+1rem)] p-0 rounded-full size-[60px]">
      <Plus className="!size-7 text-white" />
    </Button>
  );
};
