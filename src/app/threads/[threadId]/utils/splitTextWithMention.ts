/**
 * textを「>> （数字）」で区切る
 * @example
 * const result = splitTextWithMention("あいう>> 2えお>> 3かき")
 * // result = ['あいう','>> 2','えお','>> 3','かき']
 */
export const splitTextWithMention = (text: string) => {
  // 正規表現で「>> 数字」を含む部分を分割
  const regex = /([\s\S\r\n]*?)(>> \d+)/g;

  // 分割結果を格納する配列
  const result: string[] = [];

  // 正規表現でマッチしながら処理
  let match;
  let lastIndex = 0;
  while ((match = regex.exec(text)) !== null) {
    lastIndex = regex.lastIndex;
    result.push(match[1]); // 「>> 数字」前の部分
    result.push(match[2]); // 「>> 数字」
  }

  // 最後の余り部分を追加（余った文字列）
  const remainingText = text.slice(lastIndex);
  if (remainingText) {
    result.push(remainingText);
  }

  return result;
};
