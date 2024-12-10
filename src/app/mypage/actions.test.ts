import { Prisma } from '@prisma/client';
import { execSync } from 'child_process';
import { beforeEach, describe, expect, test, vi } from 'vitest';
import prisma from '../lib/db';
import { updateUser } from './actions';

const USER_ID = 'newUserId';
const USER_NAME = 'user name';

vi.mock('../lib/auth', () => ({
  // ログインしている
  auth: () => ({ user: { id: USER_ID } }),
}));
vi.mock('next/cache');

/**
 * ユーザーを作成するPromise
 */
class UserFactory {
  static create(attr: Partial<Prisma.UserCreateInput> = {}) {
    return prisma.user.create({
      data: {
        name: USER_NAME,
        email: `${Math.floor(Math.random() * 100000)}@example.com`, // ランダムなemailアドレスを指定
        ...attr,
      },
    });
  }
}

describe('設定', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    // テスト用DBをリセットする
    execSync('npm run migrate:test');
  });
  describe('正常系', () => {
    beforeEach(async () => {
      await UserFactory.create({ id: USER_ID, name: USER_NAME });
    });
    test('名前を入力すると登録される', async () => {
      const NEW_NAME = 'new name';

      const formData = new FormData();
      formData.append('name', NEW_NAME);

      await updateUser(null, formData);

      const user = await prisma.user.findUnique({
        where: { id: USER_ID },
        select: { name: true },
      });

      expect(user).toEqual({ name: NEW_NAME });
    });
  });
  describe('異常系', () => {
    beforeEach(async () => {
      await UserFactory.create({ id: USER_ID, name: USER_NAME });
    });
    test('名前が長いときは更新されない', async () => {
      const NEW_NAME = 'a'.repeat(31); //31文字

      const formData = new FormData();
      formData.append('name', NEW_NAME);

      await updateUser(null, formData);

      const user = await prisma.user.findUnique({
        where: { id: USER_ID },
        select: { name: true },
      });

      expect(user?.name).toBe(USER_NAME);
    });
    test('名前に禁止ワード「リルモ」が含まれているとき', async () => {
      const NEW_NAME = 'リルモ';

      const formData = new FormData();
      formData.append('name', NEW_NAME);

      await updateUser(null, formData);

      const user = await prisma.user.findUnique({
        where: { id: USER_ID },
        select: { name: true },
      });

      expect(user?.name).toBe(USER_NAME);
    });
    test('名前に禁止ワード「リルモ」が含まれていて且つ平仮名とカタカナが混在', async () => {
      const NEW_NAME = 'リるモ';

      const formData = new FormData();
      formData.append('name', NEW_NAME);

      await updateUser(null, formData);

      const user = await prisma.user.findUnique({
        where: { id: USER_ID },
        select: { name: true },
      });

      expect(user?.name).toBe(USER_NAME);
    });
    test('名前に禁止ワード「Relumo」が含まれているとき', async () => {
      const NEW_NAME = 'Relumo';

      const formData = new FormData();
      formData.append('name', NEW_NAME);

      await updateUser(null, formData);

      const user = await prisma.user.findUnique({
        where: { id: USER_ID },
        select: { name: true },
      });

      expect(user?.name).toBe(USER_NAME);
    });
  });
});
