'use client';

import { AvatarFallback } from '@radix-ui/react-avatar';
import * as VisuallyHidden from '@radix-ui/react-visually-hidden';
import { LogOut, UserCircle2 } from 'lucide-react';
import { Session } from 'next-auth';
import Image from 'next/image';
import Link from 'next/link';
import { useState, type FC } from 'react';

import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';

import { signOutAuth } from '@/app/components/menu/actions';
import { NavMenu } from '@/app/components/nav/NavMenu';
import { SYSTEM_VERSION } from '@/app/utils/siteSettings';

interface Props {
  currentUser: Session['user'] | undefined;
}

export const MenuSlide: FC<Props> = ({ currentUser }) => {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger>
        <Avatar className="grid place-items-center">
          <AvatarImage src={currentUser?.image || undefined} />
          <AvatarFallback>
            <UserCircle2 />
          </AvatarFallback>
        </Avatar>
      </SheetTrigger>
      <SheetContent className="!max-w-[320px] overflow-y-auto flex flex-col">
        <SheetHeader>
          <VisuallyHidden.Root asChild>
            <SheetTitle>メニュー</SheetTitle>
          </VisuallyHidden.Root>
          <Avatar className="grid place-items-center">
            <AvatarImage src={currentUser?.image || undefined} />
            <AvatarFallback>
              <UserCircle2 />
            </AvatarFallback>
          </Avatar>
          <p className="text-left break-all sm:text-xl">{currentUser?.name}</p>
        </SheetHeader>
        <NavMenu setOpen={setOpen} />
        <form className="w-full" action={signOutAuth}>
          <button className="w-full text-left flex items-center gap-3 text-muted-foreground py-2 px-3 transition-colors hover:text-primary sm:gap-5 sm:text-xl">
            <LogOut className="size-4 sm:size-5" />
            ログアウト
          </button>
        </form>
        <div className="mt-auto flex items-center justify-between">
          <div className="flex gap-4">
            <Link
              href="https://twitter.com/saga_engineer"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Image
                className="w-4 sm:w-5"
                src="/img/twitter.svg"
                alt="Twitterロゴ"
                width={20}
                height={20}
              />
            </Link>
            <Link
              href="https://github.com/saga-web-engineer/relumo"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Image
                className="w-4 sm:w-5"
                src="/img/github.svg"
                alt="GitHubロゴ"
                width={20}
                height={20}
              />
            </Link>
          </div>
          <small>Ver.{SYSTEM_VERSION}</small>
        </div>
      </SheetContent>
    </Sheet>
  );
};
