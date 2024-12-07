import { expect, test } from 'vitest';
import { splitTextWithMention } from './splitTextWithMention';

test('普通', () => {
  const input = 'あ\r\nい\r\n>> 1\r\nう';

  expect(splitTextWithMention(input)).toEqual(['あ\r\nい\r\n', '>> 1', '\r\nう']);
});

test('先頭改行1個', () => {
  const input = '\r\nあ\r\nい\r\n>> 1\r\nう';

  expect(splitTextWithMention(input)).toEqual(['\r\nあ\r\nい\r\n', '>> 1', '\r\nう']);
});

test('先頭改行2個', () => {
  const input = '\r\n\r\nあ\r\nい\r\n>> 1\r\nう';

  expect(splitTextWithMention(input)).toEqual(['\r\n\r\nあ\r\nい\r\n', '>> 1', '\r\nう']);
});

test('先頭改行2個、メンション複数', () => {
  const input = '\r\n\r\nあ\r\nい\r\n>> 1\r\n>> 2\r\nう';

  expect(splitTextWithMention(input)).toEqual([
    '\r\n\r\nあ\r\nい\r\n',
    '>> 1',
    '\r\n',
    '>> 2',
    '\r\nう',
  ]);
});

test('先頭改行2個、メンション複数改行無し', () => {
  const input = '\r\n\r\nあ\r\nい\r\n>> 1\r\n>> 2 >> 3\r\nう';

  expect(splitTextWithMention(input)).toEqual([
    '\r\n\r\nあ\r\nい\r\n',
    '>> 1',
    '\r\n',
    '>> 2',
    ' ',
    '>> 3',
    '\r\nう',
  ]);
});
