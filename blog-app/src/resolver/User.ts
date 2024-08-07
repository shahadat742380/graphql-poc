import { Context } from "../index";

interface UserParentType {
  id: number;
}

export const User = {
    post: async (
    parent: UserParentType,
    __: any,
    { prisma, userInfo }: Context
  ) => {
    const isOwnProfile = parent.id === userInfo?.userId;

    if (isOwnProfile) {
      return prisma.post.findMany({
        where: {
          authorId: parent.id,
        },
        orderBy: {
          createAt: "desc",
        },
      });
    } else {
      return prisma.post.findMany({
        where: {
          authorId: parent.id,
          published: true,
        },
        orderBy: {
          createAt: "desc",
        },
      });
    }
  },
};
