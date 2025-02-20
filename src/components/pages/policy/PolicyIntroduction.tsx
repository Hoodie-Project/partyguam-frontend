'use client';
import React from 'react';

import { PolicyLayout, SContainer, SemiTItle, SMargin, Text } from '@/styles/components';

import PolicyNav from './PolicyNav';

function PolicyIntroduction() {
  return (
    <SContainer>
      <PolicyLayout>
        <PolicyNav />
        <SemiTItle>&ldquo;파티구함&ldquo;은 프로젝트 구성원을 쉽고 효율적으로 모집할 수 있는 플랫폼입니다.</SemiTItle>
        <SMargin margin="20px 0px 0px 0px" />

        <Text>프로젝트를 진행하는 그룹을 &ldquo;파티&ldquo;라고 지칭하며, 이를 바탕으로 서비스를 설계했습니다. </Text>

        <SMargin margin="20px 0px 0px 0px" />
        <Text>
          현실에서 프로젝트를 성공적으로 수행하려면 적합한 팀원을 찾는 것이 무엇보다 중요합니다.
          <br />
          &ldquo;파티구함&ldquo;은 모든 직군에서 필요한 인원을 모집하고, 잘 맞는 사람들과 협력할 수 있는 기회를 제공하며
          프로젝트뿐만 아니라 스터디, 해커톤 등 다양한 목표에 맞춘 팀 구성을 지원합니다.
        </Text>

        <SMargin margin="20px 0px 0px 0px" />
        <Text>
          세심하게 팀원을 선택해 구성한 팀은 목표를 효과적으로 달성하고 더 나은 결과를 만들어냅니다
          <br />
          반대로. 무작위로 팀을 구성한 경우에는 목표 달성에 어려움을 겪거나 불필요한 갈등으로 와해되는 일이 발생하기도
          합니다
        </Text>

        <SMargin margin="60px 0px 0px 0px" />
        <SemiTItle>&ldquo;파티구함&ldquo;은 이 자유를 실현할 수 있는 플랫폼입니다.</SemiTItle>
        <SMargin margin="20px 0px 0px 0px" />
        <Text>
          회사에서는 내가 원하는 사람과 일할 기회가 제한적일 때가 많지만, 프로젝트에서는 내가 원하는 팀원들과 함께
          목표를 이룰 수 있는 자유가 주어집니다.
          <br />
          적합한 팀원을 만나고, 자신의 목표와 성향에 맞는 프로젝트를 성공적으로 수행할 수 있도록 돕는 데 초점을
          맞췄습니다.
          <br />
        </Text>
        <Text style={{ marginLeft: '12px' }}>
          · 다양한 모집 옵션: 프로젝트, 스터디, 해커톤 등 목적에 맞는 다양한 팀 구성 가능
        </Text>
        <br />
        <Text style={{ marginLeft: '12px' }}>· 효율적 매칭: 팀원의 세부 정보를 확인해 적합한 인원을 선택</Text>
        <br />
        <Text style={{ marginLeft: '12px' }}>· 협력 중심 설계: 팀워크의 중요성을 기반으로 성공적인 협업 지원</Text>
      </PolicyLayout>
    </SContainer>
  );
}

export default PolicyIntroduction;
