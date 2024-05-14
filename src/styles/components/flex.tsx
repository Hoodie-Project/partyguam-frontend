import styled from '@emotion/styled';

const SFlexRow = styled.div`
  display: flex;
  flex-direction: row;
`;

const SFlexColumn = styled.div`
  display: flex;
  flex-direction: column;
`;

const SFlexRowCenter = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
`;

const SFlexColumnCenter = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

export { SFlexColumn, SFlexColumnCenter, SFlexRow, SFlexRowCenter };
