'use client';
import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import styled from '@emotion/styled';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import FlagIcon from '@mui/icons-material/Flag';
import Avatar from 'boring-avatars';

type OwnProps = {
  imageUrl?: string;
  size: number;
  authority?: 'master' | 'deputy' | 'member';
  editMode?: boolean;
  setImage?: React.Dispatch<React.SetStateAction<File | null>>;
  children?: React.ReactNode;
  flagWrapperStyle?: React.CSSProperties;
  flagIconStyle?: React.CSSProperties;
};

export type Props = OwnProps & React.HTMLAttributes<HTMLDivElement>;

const isDev = process.env.NEXT_PUBLIC_ENV === 'dev';
const BASE_URL = isDev ? process.env.NEXT_PUBLIC_DEV_IMAGE_URL : process.env.NEXT_PUBLIC_IMAGE_URL;

function ProfileImage({
  imageUrl,
  size,
  children,
  authority,
  editMode,
  setImage,
  flagWrapperStyle,
  flagIconStyle,
  ...divAttributes
}: Props) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [previewImage, setPreviewImage] = useState<string | undefined>(undefined);

  const handleEditClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const objectUrl = URL.createObjectURL(file); // 파일의 임시 URL 생성
      setPreviewImage(objectUrl); // 미리 보기 이미지 업데이트

      if (setImage) {
        setImage(file); // 부모 상태 업데이트
      }
    }
  };

  useEffect(() => {
    console.log('previewImg > ', previewImage);
  }, [previewImage]);

  const getImageSrc = (previewImage?: string, imageUrl?: string, BASE_URL?: string) => {
    if (previewImage) return previewImage; // 미리보기 이미지가 존재하면 사용
    if (!imageUrl) return '/default-profile.png'; // 기본 이미지 처리 (선택 사항)
    if (imageUrl.startsWith('http')) return imageUrl; // 절대 URL이면 그대로 사용
    return `${BASE_URL}/${imageUrl}`; // 상대 경로일 경우 BASE_URL과 결합
  };

  return (
    <ImageWrapper size={size} {...divAttributes}>
      {Boolean(imageUrl) || Boolean(previewImage) ? (
        <Image
          src={getImageSrc(previewImage, imageUrl, BASE_URL)}
          width={size}
          height={size}
          alt="파티원 프로필 이미지"
          style={{ borderRadius: '50%' }}
        />
      ) : (
        <Avatar name="sacagawea" variant="beam" size={size} colors={['#7ff4df', '#00c2ff']} />
      )}
      {editMode && (
        <>
          <EditWrapper onClick={handleEditClick}>
            <EditOutlinedIcon style={{ width: '20.25px', height: '20.25px', color: 'white' }} />
          </EditWrapper>
          <HiddenFileInput type="file" accept="image/*" ref={fileInputRef} onChange={handleFileChange} />
        </>
      )}
      {authority && authority != 'member' && (
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

const EditWrapper = styled.div`
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
  bottom: 0;
  right: 0;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: 2px solid white;
  background-color: #21ecc7;
  z-index: 0.5;
  cursor: pointer;
`;

const HiddenFileInput = styled.input`
  display: none;
`;

export default ProfileImage;
