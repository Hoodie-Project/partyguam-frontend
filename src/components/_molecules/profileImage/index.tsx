'use client';
import React from 'react';
import Image from 'next/image';
import styled from '@emotion/styled';
import FlagIcon from '@mui/icons-material/Flag';
import Avatar from 'boring-avatars';

type OwnProps = {
  imageUrl?: string;
  size: number;
  authority?: 'master' | 'deputy' | 'member';
  children?: React.ReactNode;
  flagWrapperStyle?: React.CSSProperties;
  flagIconStyle?: React.CSSProperties;
};

export type Props = OwnProps & React.HTMLAttributes<HTMLDivElement>;

function ProfileImage({
  imageUrl,
  size,
  children,
  authority,
  flagWrapperStyle,
  flagIconStyle,
  ...divAttributes
}: Props) {
  return (
    <ImageWrapper size={size} {...divAttributes}>
      {Boolean(imageUrl) ? (
        <Image
          src={imageUrl || ''}
          width={size}
          height={size}
          alt="파티원 프로필 이미지"
          style={{ borderRadius: '50%' }}
        />
      ) : (
        <Avatar name="sacagawea" variant="beam" size={size} colors={['#7ff4df', '#00c2ff']} />
      )}
      {authority != 'member' && (
        <TagWrapper type={authority} style={flagWrapperStyle}>
          <FlagIcon style={flagIconStyle || { width: '18px', height: '18px', color: 'white' }} />
        </TagWrapper>
      )}
      {children}
    </ImageWrapper>
  );
}

const ImageWrapper = styled.div<{ size: number }>`
  position: relative;
  width: ${({ size }) => `${size}px`};
  height: ${({ size }) => `${size}px`};
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  border: 1px solid #e5e5ec;
`;

const TagWrapper = styled.div<{ type?: 'master' | 'deputy' | 'member' }>`
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
  bottom: 0;
  right: 0;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background-color: ${({ type }) => (type === 'master' ? '#21ECC7' : '#A0A0A0')};
  z-index: 5;
`;

export default ProfileImage;
