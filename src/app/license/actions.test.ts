import { test, expect, vi, describe, beforeEach } from 'vitest';
import prisma from '../lib/db';
import { execSync } from 'child_process';
import { getUserByInviteCode } from './actions';
import { Prisma } from '@prisma/client';

const INVITER_ID = 'inviterId'; // 招待コードの持ち主のID
const NEW_USER_ID = 'newUserId'; // 招待コードを入力する人のID

vi.mock('../lib/auth', () => ({
  // 招待コードを入力する人がログインしている
  auth: () => ({ user: { id: NEW_USER_ID } }),
}));

/**
 * ユーザーを作成するPromise
 */
class UserFactory {
  static create(attr: Partial<Prisma.UserCreateInput> = {}) {
    return prisma.user.create({
      data: {
        name: 'testUser',
        email: `${Math.floor(Math.random() * 100000)}@example.com`, // ランダムなemailアドレスを指定
        ...attr,
      },
    });
  }
}

describe('招待コード', () => {
  beforeEach(async () => {
    vi.resetAllMocks();
    // テスト用DBをリセットする
    execSync('npm run migrate:test');
  });
  describe('存在するコードを入力する', () => {
    beforeEach(async () => {
      // 招待コードの持ち主
      const { inviteCode } = await UserFactory.create({ id: INVITER_ID });
      // 招待コードを入力する人
      await UserFactory.create({ id: NEW_USER_ID });

      const formData = new FormData();
      formData.append('inviteCode', inviteCode);

      await getUserByInviteCode(null, formData);
    });

    test('isLicenseがtrueになる', async () => {
      // 招待コードを入力するユーザー
      const { isLicense } =
        (await prisma.user.findUnique({
          where: {
            id: NEW_USER_ID,
          },
        })) || {};

      // isLicenseがtrue
      expect(isLicense).toBe(true);
    });
    test('招待したユーザーのinviteeに登録される', async () => {
      // 招待したユーザー
      const { invitee } =
        (await prisma.user.findUnique({
          where: {
            id: INVITER_ID,
          },
          include: {
            invitee: true,
          },
        })) || {};

      // isLicenseがtrue
      expect(invitee?.some((user) => user.id === NEW_USER_ID)).toBe(true);
    });
  });
  describe('存在しないコードを入力する', () => {
    beforeEach(async () => {
      // 招待コードの持ち主
      const { inviteCode } = await UserFactory.create({ id: INVITER_ID });
      // 招待コードを入力する人
      await UserFactory.create({ id: NEW_USER_ID });

      const formData = new FormData();
      formData.append('inviteCode', `${inviteCode}a`); //存在しない招待コード

      await getUserByInviteCode(null, formData);
    });

    test('isLicenseはfalseのまま', async () => {
      // 招待コードを入力するユーザー
      const { isLicense } =
        (await prisma.user.findUnique({
          where: {
            id: NEW_USER_ID,
          },
        })) || {};

      // isLicenseがfalse
      expect(isLicense).toBe(false);
    });
    test('招待したユーザーのinviteeに登録されない', async () => {
      // 招待したユーザー
      const { invitee } =
        (await prisma.user.findUnique({
          where: {
            id: INVITER_ID,
          },
          include: {
            invitee: true,
          },
        })) || {};

      // isLicenseがtrue
      expect(invitee?.some((user) => user.id === NEW_USER_ID)).toBe(false);
    });
  });
});
