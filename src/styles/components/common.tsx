import styled from '@emotion/styled';

const SContainer = styled.section`
  width: 100%;
  height: 100vh;
  padding-top: 5.25rem;
  display: flex;
  flex-direction: column;
  align-items: center;
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

export { SContainer, SForm, SMargin };
