import Link from 'next/link';
import type { FC } from 'react';

import { Logo } from '@/app/components/Logo';
import { Wrapper } from '@/app/components/Wrapper';
import { MenuSlide } from '@/app/components/menu/MenuSlide';
import { ThemeToggle } from '@/app/components/theme/ThemeToggle';
import { auth } from '@/app/lib/auth';

export const Header: FC = async () => {
  const session = await auth();
  const currentUser = session?.user;

  return (
    <header className="sticky py-4 top-0 border-b backdrop-blur bg-background/50 z-10">
      <Wrapper className="flex justify-between items-center">
        <h1>
          <Link href="/">
            <Logo width={100} height={23} />
          </Link>
        </h1>
        <div className="flex items-center gap-4">
          <ThemeToggle />
          {currentUser?.isLicense && <MenuSlide currentUser={currentUser} />}
        </div>
      </Wrapper>
    </header>
  );
};
