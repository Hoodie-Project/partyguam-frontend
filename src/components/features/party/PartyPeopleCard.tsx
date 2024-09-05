import Image from 'next/image';
import styled from '@emotion/styled';
import FlagIcon from '@mui/icons-material/Flag';

import Emergency from '@/assets/icon/emergency.svg';
import { Square, Txt } from '@/components/_atoms';
import { useAuthStore } from '@/stores/auth';
import { SFlexRow } from '@/styles/components';

type Props = {
  authority?: 'master' | 'deputy' | 'member';
  position?: {
    main: string;
    sub: string;
  };
  user?: {
    id: number;
    nickname: string;
    image: string;
  };
};

const PARTY_AUTHORITY_MAP = (authority?: 'master' | 'deputy' | 'member') => {
  return {
    master: '파티장',
    deputy: '부파티장',
    member: '파티원',
  }[authority!];
};

function PartyPeopleCard({ authority, position, user }: Props) {
  const userId = useAuthStore(state => state.id);

  return (
    <StyledSquare
      width="100%"
      height="136px"
      shadowKey="shadow1"
      backgroundColor="white"
      radiusKey="base"
      borderColor="grey200"
    >
      <CardWrapper>
        <ImageWrapper>
          <Image
            src="/images/zzz.png"
            width={72}
            height={72}
            alt="파티원 프로필 이미지"
            style={{ borderRadius: '50%' }}
          />
          {authority != 'member' && (
            <TagWrapper type={authority}>
              <FlagIcon style={{ width: '18px', height: '18px', color: 'white' }} />
            </TagWrapper>
          )}
        </ImageWrapper>

        <UserInfoContainer>
          <UserPositionWrapper>
            {authority != 'member' && (
              <SFlexRow style={{ alignItems: 'center' }}>
                <Txt fontSize={14} fontColor="greenDark100" fontWeight="semibold">
                  {PARTY_AUTHORITY_MAP(authority)}
                </Txt>
                <ColumnLine />
              </SFlexRow>
            )}

            <Txt fontSize={14} fontColor="black" fontWeight="semibold">
              {position?.main}
            </Txt>
            <Txt fontSize={14} fontColor="black" fontWeight="semibold">
              {position?.sub}
            </Txt>
          </UserPositionWrapper>
          <UserNameWrapper>
            <MeTag>나</MeTag>
            <Txt
              fontSize={16}
              fontColor="black"
              fontWeight="normal"
              style={{
                width: '200px',
                overflow: 'hidden',
                whiteSpace: 'nowrap',
                textOverflow: 'ellipsis',
              }}
            >
              {user?.nickname}
            </Txt>
          </UserNameWrapper>
        </UserInfoContainer>
        <Emergency />
      </CardWrapper>
    </StyledSquare>
  );
}

export default PartyPeopleCard;

const StyledSquare = styled(Square)`
  padding: 32px 0 32px 24px;
  display: flex;
  justify-content: flex-start;
`;

const ImageWrapper = styled.div`
  position: relative;
  width: 72px;
  height: 72px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  border: 1px solid #e5e5ec;
`;

const CardWrapper = styled.div`
  position: relative;
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const UserInfoContainer = styled.div`
  padding: 13px 0px 13px 16px;
`;

const UserPositionWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  gap: 6px;
  margin-bottom: -8px;
`;

const UserNameWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 227px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
`;

const MeTag = styled.div`
  width: 20px;
  height: 20px;
  background-color: black;
  border-radius: 50%;
  color: white;
  font-size: 12px;
  font-weight: bold;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-right: 4px;
`;

const ColumnLine = styled.div`
  width: 1px;
  height: 10px;
  margin-left: 6px;
  border-right: 1px solid #d4d4d4;
`;

const TagWrapper = styled.div<{ type?: 'master' | 'deputy' }>`
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
  bottom: 0;
  right: 0;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background-color: ${({ type }) => (type == 'master' ? '#21ECC7' : '#a0a0a05ec')};
  z-index: 5;
`;
