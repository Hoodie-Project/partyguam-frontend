import React from 'react';

type Menu = {
  대메뉴: string;
  소메뉴: string[];
};

type OwnProps = {
  menu: Menu[];
};

type Props = OwnProps & React.HTMLAttributes<HTMLDivElement>;

export default function FloatingMenu({ menu, ...divAttributes }: Props) {
  return <div {...divAttributes}>ㅎㅇ</div>;
}
