import type { PropsWithChildren } from 'react';
import React from 'react';

export default function HomeLayout({ children }: PropsWithChildren) {
  return <main>{children}</main>;
}
