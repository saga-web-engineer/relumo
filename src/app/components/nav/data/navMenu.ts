import {
  BookOpenText,
  ClipboardPen,
  Handshake,
  History,
  LucideProps,
  UserRoundPlus,
} from 'lucide-react';
import { ForwardRefExoticComponent, RefAttributes } from 'react';

interface NavMenu {
  label: string;
  href: string;
  icon: ForwardRefExoticComponent<Omit<LucideProps, 'ref'> & RefAttributes<SVGSVGElement>>;
}

export const navList: NavMenu[] = [
  {
    label: '投稿',
    href: '/threads',
    icon: ClipboardPen,
  },
  {
    label: 'マイページ',
    href: '/mypage',
    icon: BookOpenText,
  },
  {
    label: 'フレンド招待',
    href: '/invite',
    icon: UserRoundPlus,
  },
  // {
  //   label: 'お問い合わせ',
  //   href: '/contact',
  //   icon: Mail,
  // },
  {
    label: '更新履歴',
    href: '/history',
    icon: History,
  },
  {
    label: 'プライバシーポリシー',
    href: '/policy',
    icon: Handshake,
  },
];
