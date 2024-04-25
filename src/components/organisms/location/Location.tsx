'use client';

import React from 'react';
import Cities from './Cities';
import Provinces from './Provinces';
import styled from '@emotion/styled';

export default function Location() {
  return (
    <Container>
      <Provinces/>
      <Cities/>
    </Container>
  );
}

const Container = styled.section`
  disaplay: flex;
  flex-wrap: wrap;
  gap: 42px;
`
