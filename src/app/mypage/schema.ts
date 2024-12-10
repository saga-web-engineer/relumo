import { z } from 'zod';

// 禁止ワードリスト
const prohibitedPatterns = [
  /[リり][ルる][モも]/i, // "リルモ", "リるモ", "リルも", "リるも" など
  /Relumo/i, // 大文字・小文字の "Relumo"
];

export const settingSchema = z.object({
  name: z
    .string({ required_error: '名前を入力してください' })
    .max(30, '30文字以内で入力してください')
    .refine((name) => !prohibitedPatterns.some((pattern) => pattern.test(name)), {
      message:
        '禁止ワードが含まれています。「リルモ」や「Relumo」など当アプリケーション名は使用できません',
    }),
});
