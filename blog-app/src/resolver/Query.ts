import { Context } from "..";

export const Query = {
  me: async (_: any, __: any, { prisma, userInfo }: Context) => {
    if (!userInfo) return null;

    const me = await prisma.user.findUnique({
      where: {
        id: userInfo.userId,
      },
    });

    return me;
  },
  profile: async(_: any, {userId}: {userId: string}, {prisma}: Context)=>{
    const profile = await prisma.profile.findUnique({
      where: {
        userId: Number(userId)
      }
    })

    return profile;
  },
  post: async (_: any, args: any, { prisma }: Context) => {
    const post = await prisma.post.findMany({
      where: {
        published: true
      },
      orderBy: [
        {
          createAt: "desc",
        },
      ],
    });

    return post;
  },
};
