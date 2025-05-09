import { useState } from "react";
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
  z-index: 100;
  width: 300px;
  background-color: white;
  border: 2px solid var(--primary-color);
  border-radius: var(--border-radius);
  padding: var(--spacing-medium);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  font-size: var(--font-size-small);
  color: #333333;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  margin-top: var(--spacing-small);
  
  @media (max-width: 768px) {
    width: 250px;
    left: auto;
    right: 0;
    transform: none;
  }
  
  &:before {
    content: '';
    position: absolute;
    top: -8px;
    left: 50%;
    transform: translateX(-50%);
    width: 0;
    height: 0;
    border-left: 8px solid transparent;
    border-right: 8px solid transparent;
    border-bottom: 8px solid var(--primary-color);
    
    @media (max-width: 768px) {
      left: auto;
      right: 8px;
      transform: none;
    }
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
  
  // クリック以外の方法でもヘルプを開けるようにする（アクセシビリティ対応）
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
        <HelpContent>
          <CloseButton onClick={closeHelp} aria-label="閉じる">×</CloseButton>
          <HelpTitle>{title}</HelpTitle>
          <HelpText>{children}</HelpText>
        </HelpContent>
      )}
    </HelpContainer>
  );
};

export default HelpTip;
