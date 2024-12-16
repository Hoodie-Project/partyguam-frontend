import styled from '@emotion/styled';

const SFlexRow = styled.div`
  display: flex;
  flex-direction: row;
`;

const SFlexColumn = styled.div`
  display: flex;
  flex-direction: column;
`;

const SFlexRowFull = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
`;

const SFlexColumnFull = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const SFlexRowCenter = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
`;

const SFlexRowJustifyBetween = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const SFlexColumnCenter = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const SFlexRowCenterFull = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  width: 100%;
`;

const SFlexColumnCenterFull = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
`;

export {
  SFlexColumn,
  SFlexColumnCenter,
  SFlexColumnCenterFull,
  SFlexColumnFull,
  SFlexRow,
  SFlexRowCenter,
  SFlexRowCenterFull,
  SFlexRowFull,
  SFlexRowJustifyBetween,
};
