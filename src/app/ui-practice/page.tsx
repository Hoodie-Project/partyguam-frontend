import React from 'react';

import { Button, Input, Txt } from '@/components/atoms';

export default function Home() {
  return (
    <main>
      {/*  */}
      <Button label="정상 버튼" />
      <div style={{ margin: '10px' }} />
      <Button color="white" label="white 버튼" />
      <div style={{ margin: '10px' }} />
      <Button disabled label="disabled 버튼" />
      <div style={{ margin: '10px' }} />
      <Input placeholder="일반 input" />
      <div style={{ margin: '10px' }} />
      <Input placeholder="disabled input" disabled />
      <div style={{ margin: '10px' }} />
      <Input placeholder="value input" value="hi" />
      <div style={{ margin: '10px' }} />
      <Input placeholder="value input" value="warn" inputState="warn" bottomMessage="warn메세지 출력할거임" />
      <div style={{ margin: '10px' }} />
      <Input placeholder="value input" value="success" inputState="success" bottomMessage="success메세지 출력할거임" />
      <div style={{ margin: '10px' }} />
      <Txt fontWeight="normal" fontSize={24} color="--success-green">
        regular
      </Txt>
      <div style={{ margin: '10px' }} />
      <Txt fontWeight="bold">bold</Txt>
      <div style={{ margin: '10px' }} />
      <Txt fontWeight="semibold">semibold</Txt>
    </main>
  );
}
