'use client';

import { getFormProps, getInputProps, useForm } from '@conform-to/react';
import { getZodConstraint, parseWithZod } from '@conform-to/zod';
import { Loader2 } from 'lucide-react';
import type { FC } from 'react';
import { useActionState } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

import { getUserByInviteCode } from '@/app/license/actions';
import { inviteCodeSchema } from '@/app/license/schema';

export const InviteCodeForm: FC = () => {
  const [lastResult, formAction, isPending] = useActionState(getUserByInviteCode, null);

  const [form, fields] = useForm({
    lastResult,

    onValidate({ formData }) {
      return parseWithZod(formData, { schema: inviteCodeSchema });
    },

    constraint: getZodConstraint(inviteCodeSchema),

    shouldValidate: 'onBlur',
    shouldRevalidate: 'onInput',
  });

  return (
    <form action={formAction} {...getFormProps(form)} className="mt-6">
      <Input {...getInputProps(fields.inviteCode, { type: 'text' })} key={fields.inviteCode.key} />
      <p className="text-sm text-red-500">{fields.inviteCode.errors}</p>
      {isPending ? (
        <Button
          className="flex items-center w-[min(100%,320px)] mx-auto py-3 mt-6 md:text-lg md:py-4 !h-auto text-foreground cursor-not-allowed disabled:pointer-events-auto hover:bg-primary"
          disabled
        >
          <Loader2 className="size-4 mr-2 sm:size-5 animate-spin" />
          招待コード確認中
        </Button>
      ) : (
        <Button
          className={cn(
            {
              'cursor-not-allowed disabled:pointer-events-auto hover:bg-primary': !form.valid,
            },
            'block w-[min(100%,320px)] mx-auto py-3 mt-6 md:text-lg md:py-4 !h-auto text-foreground',
          )}
          disabled={!form.valid}
        >
          招待コードを送信
        </Button>
      )}
    </form>
  );
};
