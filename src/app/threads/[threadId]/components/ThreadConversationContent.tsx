'use client';

import { FC } from 'react';

import { ThreadContentDialog } from '@/app/threads/[threadId]/components/ThreadContentDialog';
import { splitTextWithMention } from '@/app/threads/[threadId]/utils/splitTextWithMention';

interface Props {
  threadId: string;
  text: string;
}

export const ThreadConversationContent: FC<Props> = ({ threadId, text }) => {
  const splittedText = splitTextWithMention(text);

  return (
    <pre className="whitespace-pre-wrap break-all text-lg">
      {splittedText.map((part, index) => {
        if (part.match(/(.*?)(>> \d+)/)) {
          const replyNumber = Number(part.match(/(.*?>> )(\d+)/)?.[2]);
          return <ThreadContentDialog key={index} threadId={threadId} replyNumber={replyNumber} />;
        } else {
          return <span key={index}>{part}</span>;
        }
      })}
    </pre>
  );
};
