import type { PropsWithChildren } from 'react';
import React from 'react';

export default function MyApplyLayout({ children }: PropsWithChildren) {
  return <main>{children}</main>;
}
