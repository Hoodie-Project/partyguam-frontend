import styled from '@emotion/styled';

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

export { SChildContainer, SContainer, SForm, SHomeContainer, SMargin };
