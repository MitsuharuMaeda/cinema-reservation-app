import { useState, useRef, useEffect } from "react";
import styled from "styled-components";

const HelpContainer = styled.div`
  position: relative;
  display: inline-block;
  margin-left: var(--spacing-small);
  vertical-align: middle;
`;

const HelpIcon = styled.button`
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background-color: #f0f0f0;
  color: var(--primary-color);
  border: 2px solid var(--primary-color);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  cursor: pointer;
  font-size: 16px;
  
  &:hover {
    background-color: var(--primary-color);
    color: white;
  }
`;

const HelpContent = styled.div`
  position: absolute;
  z-index: 9999;
  width: 300px;
  background-color: white;
  border: 2px solid var(--primary-color);
  border-radius: var(--border-radius);
  padding: var(--spacing-medium);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  font-size: var(--font-size-small);
  color: #333333;
  top: 100%;
  transform: translateY(10px);
  right: 0;
  left: auto;
  
  @media (max-width: 768px) {
    width: 280px;
    right: -20px;
  }
  
  @media (min-width: 768px) {
    &.flip-left {
      right: auto;
      left: 0;
    }
  }
  
  &:before {
    content: '';
    position: absolute;
    top: -8px;
    right: 12px;
    width: 0;
    height: 0;
    border-left: 8px solid transparent;
    border-right: 8px solid transparent;
    border-bottom: 8px solid var(--primary-color);
  }
`;

const CloseButton = styled.button`
  position: absolute;
  top: 5px;
  right: 5px;
  background: none;
  border: none;
  font-size: 18px;
  cursor: pointer;
  color: #333333;
  
  &:hover {
    color: var(--primary-color);
  }
`;

const HelpTitle = styled.h4`
  margin-top: 0;
  margin-bottom: var(--spacing-small);
  color: var(--primary-color);
`;

const HelpText = styled.div`
  line-height: 1.5;
  color: #333333;
  
  ul {
    padding-left: var(--spacing-large);
    margin: var(--spacing-small) 0;
  }
  
  p {
    margin: var(--spacing-small) 0;
    color: #333333;
  }
`;

const HelpTip = ({ title, children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [shouldFlip, setShouldFlip] = useState(false);
  const helpContentRef = useRef(null);
  
  useEffect(() => {
    if (isOpen && helpContentRef.current) {
      const rect = helpContentRef.current.getBoundingClientRect();
      const isOffScreen = rect.right > window.innerWidth;
      setShouldFlip(isOffScreen);
    }
  }, [isOpen]);
  
  const toggleHelp = () => {
    setIsOpen(!isOpen);
  };
  
  const closeHelp = () => {
    setIsOpen(false);
  };
  
  return (
    <HelpContainer>
      <HelpIcon 
        onClick={toggleHelp}
        aria-label={isOpen ? "ヘルプを閉じる" : "ヘルプを開く"}
        title="クリックでヘルプを表示"
      >
        ?
      </HelpIcon>
      
      {isOpen && (
        <HelpContent 
          ref={helpContentRef}
          className={shouldFlip ? "flip-left" : ""}
        >
          <CloseButton onClick={closeHelp} aria-label="閉じる">×</CloseButton>
          <HelpTitle>{title}</HelpTitle>
          <HelpText>{children}</HelpText>
        </HelpContent>
      )}
    </HelpContainer>
  );
};

export default HelpTip;
