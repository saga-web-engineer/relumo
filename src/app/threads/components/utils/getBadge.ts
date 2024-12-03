import prisma from '@/app/lib/db';

export const getBadge = async (userId: string): Promise<{ isDeveloper: boolean } | null> => {
  return await prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      isDeveloper: true,
    },
  });
};
