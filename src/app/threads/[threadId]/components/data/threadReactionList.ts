export const reactionList = [
  {
    name: 'love',
    emoji: '😍',
  },
  {
    name: 'angry',
    emoji: '🤬',
  },
  {
    name: 'horror',
    emoji: '😱',
  },
  {
    name: 'smile',
    emoji: '🥹',
  },
] as const;

export type ReactionType = (typeof reactionList)[number]['name'];
