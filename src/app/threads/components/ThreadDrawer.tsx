'use client';

import { getFormProps, getInputProps, getTextareaProps, useForm } from '@conform-to/react';
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
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';

import { createThread } from '@/app/threads/actions';
import { ThreadsNewSchema } from '@/app/threads/schema';

export const ThreadDrawer: FC = () => {
  const [lastResult, action, isPending] = useActionState(createThread, null);
  const [form, fields] = useForm({
    lastResult,

    onValidate({ formData }) {
      return parseWithZod(formData, { schema: ThreadsNewSchema });
    },

    constraint: getZodConstraint(ThreadsNewSchema),

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
            <DrawerTitle className="md:text-2xl">スレッドを新規作成</DrawerTitle>
            <DrawerClose className="size-8">
              <X className="size-8" />
            </DrawerClose>
          </DrawerHeader>
          <form action={action} {...getFormProps(form)} className="grid gap-6">
            <div>
              <Input
                {...getInputProps(fields.title, { type: 'text' })}
                key={fields.title.key}
                className="!text-base h-12 md:!text-lg"
                placeholder="スレッドのタイトルを入力"
              />
              <p className="text-sm text-red-500">{fields.title.errors}</p>
              <p className="text-sm text-muted-foreground">30文字以内</p>
            </div>
            <div>
              <Textarea
                {...getTextareaProps(fields.bio)}
                key={fields.bio.key}
                className="min-h-[160px] max-h-[300px] text-base resize-none [field-sizing:content] md:!text-lg"
                placeholder="スレッドの説明を入力"
              />
              <p className="text-sm text-red-500">{fields.bio.errors}</p>
              <p className="text-sm text-muted-foreground">140文字以内</p>
            </div>
            <Button
              className={cn(
                { 'cursor-not-allowed': !form.valid || isPending },
                'block w-[min(100%,320px)] mx-auto py-3 md:text-lg md:py-4 md:mt-6 !h-auto text-foreground'
              )}
              disabled={!form.valid || isPending}
            >
              スレッドを作成する
            </Button>
          </form>
        </div>
      </DrawerContent>
    </Drawer>
  );
};
