import type { PropsWithChildren } from 'react';
import React from 'react';

export default function MyPartyLayout({ children }: PropsWithChildren) {
  return <main>{children}</main>;
}
