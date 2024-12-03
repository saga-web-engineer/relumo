'use client';

import { getFormProps, getTextareaProps, useForm } from '@conform-to/react';
import { getZodConstraint, parseWithZod } from '@conform-to/zod';
import { Plus, X } from 'lucide-react';
import { useActionState, type FC } from 'react';

import { Button } from '@/components/ui/button';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';

import { sendMessage } from '@/app/threads/[threadId]/actions';
import { threadConversationSchema } from '@/app/threads/[threadId]/schema';

export const ThreadPostDrawer: FC<{ threadId: string }> = ({ threadId }) => {
  const [lastResult, action, isPending] = useActionState(
    async (_prev: unknown, action: FormData) => {
      await sendMessage(_prev, action);
      return null;
    },
    null
  );

  const [form, fields] = useForm({
    lastResult,

    onValidate({ formData }) {
      return parseWithZod(formData, { schema: threadConversationSchema });
    },

    constraint: getZodConstraint(threadConversationSchema),

    shouldValidate: 'onBlur',
    shouldRevalidate: 'onInput',
  });

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button className="fixed right-4 bottom-[calc(env(safe-area-inset-bottom)+1rem)] p-0 rounded-full size-[60px]">
          <Plus className="!size-7 text-white" />
        </Button>
      </DrawerTrigger>
      <DrawerContent className="h-full">
        <div className="w-[min(90%,600px)] mx-auto">
          <DrawerHeader className="flex justify-between items-center px-0">
            <DrawerTitle className="md:text-2xl">投稿内容</DrawerTitle>
            <DrawerClose className="size-8">
              <X className="size-8" />
            </DrawerClose>
          </DrawerHeader>
          <form {...getFormProps(form)} action={action}>
            <Textarea
              {...getTextareaProps(fields.post)}
              key={fields.post.key}
              className="min-h-[160px] max-h-[300px] resize-none [field-sizing:content]"
            />
            <p className="text-sm text-red-500">{fields.post.errors}</p>
            <p className="text-sm text-muted-foreground">140文字以内</p>
            <input type="hidden" name="threadId" value={threadId} />
            <Button
              className={cn(
                { 'cursor-not-allowed': !form.valid || isPending },
                'block w-[min(100%,320px)] mt-4 mx-auto py-3 md:text-lg md:py-4 md:mt-6 !h-auto text-foreground'
              )}
              disabled={!form.valid || isPending}
            >
              投稿する
            </Button>
          </form>
        </div>
      </DrawerContent>
    </Drawer>
  );
};
