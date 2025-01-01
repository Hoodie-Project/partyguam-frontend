import styled from '@emotion/styled';

import { Txt } from '@/components/_atoms';

/**
 * /home 랜딩 페이지 컨테이너
 */

const SHomeContainer = styled.section`
  width: 77.5rem;
  height: 100%;
  margin-top: 50px;
`;

/**
 * 모든 페이지 컴포넌트를 감싸주는 컴포넌트
 */
const SContainer = styled.section`
  width: 100%;
  height: 100%;
  padding-top: 5.25rem;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

/**
 * 전체 화면이 아닌 컨텐츠가 들어갈 컨테이너
 * ex. 모집편집 화면에서 PageHeader하위의 공간
 */
const SChildContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 51.25rem;
  height: auto;
  margin-top: calc(3.125rem + 3.5rem);
`;

const SForm = styled.form`
  display: flex;
  padding-top: 5rem;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 77.75rem;
`;

const SMargin = styled.div<{ margin: string }>`
  margin: ${props => props.margin};
`;

/**
 * 개발자 | 프론트엔드
 * -> |에 해당하는 컴포넌트
 */
const Divider = styled.div`
  width: 1.5px;
  height: 10px;
  background-color: #999999;
  border-radius: 9px;
  margin: 0px 6px 0px 6px;
`;

/** policy 페이지 컴포넌트 **/
const PolicyLayout = styled.section`
  width: 1200px;
  height: auto;
  margin-top: 120px;
`;

const SemiTItle = styled(Txt)`
  line-height: 160%;
  letter-spacing: -0.025em;
  font-weight: 600;
  font-size: 16px;
`;

const Text = styled(Txt)`
  line-height: 160%;
  letter-spacing: -0.025em;
  font-weight: normal;
  font-size: 14px;
`;

export { Divider, PolicyLayout, SChildContainer, SContainer, SemiTItle, SForm, SHomeContainer, SMargin, Text };
