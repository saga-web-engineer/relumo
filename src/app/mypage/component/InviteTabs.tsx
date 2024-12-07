import { User } from '@prisma/client';
import { AtSign, BadgeCheck, CalendarDays, UserCircle2, UserRound } from 'lucide-react';
import type { FC } from 'react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';

import dayjs from '@/app/utils/dayjs';

interface Props {
  invitee: User[] | undefined;
  inviter: User | undefined | null;
}

export const InviteTabs: FC<Props> = ({ invitee, inviter }) => {
  return (
    <Tabs defaultValue="invitee" className="max-w-[800px] mx-auto mt-16">
      <TabsList className="w-full">
        <TabsTrigger className="w-1/2" value="invitee">
          招待したお友達
        </TabsTrigger>
        <TabsTrigger className="w-1/2" value="inviter">
          自分を招待したお友達
        </TabsTrigger>
      </TabsList>
      <TabsContent value="invitee" className="border rounded-lg">
        <ul>
          {Array.isArray(invitee) && invitee.length > 0 ? (
            invitee?.map((inviteeItem) => (
              <li
                key={inviteeItem.id}
                className={cn(invitee.length >= 2 && '[&:not(:last-child)]:border-b', 'p-4')}
              >
                <Avatar className="grid place-items-center">
                  <AvatarImage src={inviteeItem?.image || undefined} />
                  <AvatarFallback>
                    <UserCircle2 />
                  </AvatarFallback>
                </Avatar>
                <p className="flex items-center gap-2">
                  <UserRound className="min-w-4" size={'1rem'} />
                  <span className="flex items-center gap-1">
                    <span className="[-webkit-line-clamp:1] [display:-webkit-box] [-webkit-box-orient:vertical] overflow-hidden overflow-ellipsis">
                      {inviteeItem?.name}
                    </span>
                    {inviteeItem?.isDeveloper && (
                      <BadgeCheck className="text-primary min-w-3" size={'0.75rem'} />
                    )}
                  </span>
                </p>
                <p className="flex items-center gap-2">
                  <AtSign className="min-w-4" size={'1rem'} />
                  *****{inviteeItem?.id?.slice(-10)}
                </p>
                <p className="flex items-center gap-2">
                  <CalendarDays className="min-w-4" size={'1em'} />
                  {dayjs(inviteeItem.createdAt).tz().format('YYYY-MM-DD')}
                </p>
              </li>
            ))
          ) : (
            <li className="p-4">まだ招待したお友達がいません。ぜひお友達をRelumoに誘ってね！</li>
          )}
        </ul>
      </TabsContent>
      <TabsContent value="inviter" className="border rounded-lg">
        <ul>
          <li className="p-4">
            <Avatar className="grid place-items-center">
              <AvatarImage src={inviter?.image || undefined} />
              <AvatarFallback>
                <UserCircle2 />
              </AvatarFallback>
            </Avatar>
            <p className="flex items-center gap-2">
              <UserRound className="min-w-4" size={'1rem'} />
              <span className="flex items-center gap-1">
                <span className="[-webkit-line-clamp:1] [display:-webkit-box] [-webkit-box-orient:vertical] overflow-hidden overflow-ellipsis">
                  {inviter?.name}
                </span>
                {inviter?.isDeveloper && (
                  <BadgeCheck className="text-primary min-w-3" size={'0.75rem'} />
                )}
              </span>
            </p>
            <p className="flex items-center gap-2">
              <AtSign className="min-w-4" size={'1rem'} />
              *****{inviter?.id?.slice(-10)}
            </p>
          </li>
        </ul>
      </TabsContent>
    </Tabs>
  );
};
