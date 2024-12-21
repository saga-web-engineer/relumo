import type { FC } from 'react';

import { policyContents } from '@/app/policy/data/policyContent';

export const PolicyContent: FC = () => {
  return (
    <>
      {policyContents.map((policyContent) => (
        <section key={policyContent.title}>
          <h2 className="text-lg font-bold">{policyContent.title}</h2>
          <p className="mt-2">{policyContent.read}</p>
          <ul className="grid gap-2 list-disc pl-[1.25em] mt-4">
            {policyContent.contents &&
              policyContent.contents.map((content) => <li key={content}>{content}</li>)}
          </ul>
        </section>
      ))}
    </>
  );
};
