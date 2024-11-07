import React, { useEffect, useState } from 'react';
import styled from '@emotion/styled';
import ArrowUpwardRoundedIcon from '@mui/icons-material/ArrowUpwardRounded';

export default function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(true);

  const toggleVisibility = () => {
    // TODO list data들어왔을 때 어느정도 스크롤 내려야 보여지게 할 것인지
    if (window.scrollY > 10) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  useEffect(() => {
    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  return (
    <StyledButton onClick={scrollToTop} style={{ display: isVisible ? 'block' : 'none' }}>
      <ArrowUpwardRoundedIcon fontSize="large" />
    </StyledButton>
  );
}

const StyledButton = styled.button`
  position: fixed;
  bottom: 80px;
  right: 80px;
  width: 80px;
  height: 80px;
  border-radius: 50%;
  border: none;
  background-color: #ffffff;
  box-shadow: 0px 2px 10px -1px rgba(17, 17, 17, 0.16);
  cursor: pointer;
  font-size: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #333;

  &:hover {
    background-color: #f0f0f0;
  }
`;
