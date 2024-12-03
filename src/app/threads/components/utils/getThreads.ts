import prisma from '@/app/lib/db';

interface Thread {
  title: string;
  id: string;
  bio: string;
  userName: string;
  userId: string;
  latestDate: string;
  postCount: number;
}

interface Args {
  currentPage: number;
  threadsPerPage: number;
}

export const getThreads = async ({ currentPage, threadsPerPage }: Args) => {
  return await prisma.$queryRaw<Thread[]>`
    SELECT
      t.id,
      t.title,
      t.bio,
      t."userId",
      COALESCE(MAX(p."createdAt"), t."createdAt") AS "latestDate",
      COUNT(p.id) AS "postCount",
      u.name AS "userName"
    FROM
      "Thread" t
    LEFT JOIN
      "Post" p ON t.id = p."threadId"
    LEFT JOIN
      "User" u ON t."userId" = u.id
    GROUP BY
      t.id, t.title, t.bio, t."createdAt", t."userId", u.name
    ORDER BY
      "latestDate" DESC
    LIMIT ${threadsPerPage}
    OFFSET ${(currentPage - 1) * threadsPerPage};
  `;
};
