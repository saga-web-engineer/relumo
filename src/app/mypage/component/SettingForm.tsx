'use client';

import { getFormProps, getInputProps, useForm } from '@conform-to/react';
import { getZodConstraint, parseWithZod } from '@conform-to/zod';
import { Loader2 } from 'lucide-react';
import { FC, useActionState } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

import { updateUser } from '@/app/mypage/actions';
import { settingSchema } from '@/app/mypage/schema';

interface Props {
  defaultValue?: {
    name?: string | null;
  };
}

export const SettingForm: FC<Props> = ({ defaultValue }) => {
  const [lastResult, action, isPending] = useActionState(
    async (prev: unknown, action: FormData) => {
      try {
        const result = await updateUser(prev, action);

        toast.success('設定を更新しました');

        return result;
      } catch (error) {
        toast.error('設定の更新に失敗しました');
        console.log(error);
      }
    },
    null,
  );
  const [form, fields] = useForm({
    lastResult,

    onValidate({ formData }) {
      return parseWithZod(formData, { schema: settingSchema });
    },

    defaultValue,

    constraint: getZodConstraint(settingSchema),

    shouldValidate: 'onBlur',
    shouldRevalidate: 'onInput',
  });

  return (
    <form action={action} {...getFormProps(form)} className="mt-6 max-w-[800px]">
      <Label className="text-base leading-relaxed" htmlFor="name">
        名前
      </Label>
      <div className="flex flex-start gap-x-4 min-w-0">
        <div className="w-[80%]">
          <Input
            {...getInputProps(fields.name, { type: 'text' })}
            key={fields.name.key}
            defaultValue={fields.name.initialValue}
          />
          <p className="text-sm text-red-500">{fields.name.errors}</p>
          <p className="text-sm text-muted-foreground">30文字以内</p>
        </div>
        <Button
          className={cn(
            {
              'cursor-not-allowed disabled:pointer-events-auto hover:bg-primary':
                !form.valid || isPending,
            },
            'md:text-lg text-foreground w-[20%] flex items-center justify-center',
          )}
          disabled={!form.valid || isPending}
        >
          {isPending ? <Loader2 className="size-4 mr-2 sm:size-5 animate-spin" /> : '登録'}
        </Button>
      </div>
    </form>
  );
};
