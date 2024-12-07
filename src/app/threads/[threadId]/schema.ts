import { z } from 'zod';

export const threadConversationSchema = z.object({
  post: z
    .string({ required_error: 'メッセージを入力してください' })
    .min(1)
    .max(140, '140字以内で入力してください'),
  threadId: z.string({ required_error: '不正です、悪さをしないでください' }).min(1),
});

export const updateReactionSchema = z.object({
  postId: z.string(),
  reactionName: z.string(),
  state: z.preprocess((val) => (val === 'true' ? true : false), z.boolean()),
});
