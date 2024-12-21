import type { FC } from 'react';

import { historyInfoList } from '@/app/history/data/historyInfo';

export const HistoryList: FC = () => {
  return (
    <>
      {historyInfoList.map((historyInfo) => (
        <div key={historyInfo.version}>
          <div className="flex items-center gap-4">
            <time>{historyInfo.date}</time>
            <span>{historyInfo.version}</span>
          </div>
          <ul className="grid gap-2 list-disc pl-[1.25em] mt-4">
            {historyInfo.contents.map((historyContent) => (
              <li key={historyContent}>{historyContent}</li>
            ))}
          </ul>
        </div>
      ))}
    </>
  );
};
