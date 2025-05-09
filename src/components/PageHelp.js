import { useState } from "react";
import styled from "styled-components";

const HelpContainer = styled.div`
  background-color: rgba(0, 0, 0, 0.7);
  border: 1px solid #FFD700;
  border-radius: var(--border-radius);
  padding: var(--spacing-medium);
  margin: var(--spacing-large) 0;
`;

const HelpHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  padding: var(--spacing-small) 0;
`;

const HelpTitle = styled.h3`
  margin: 0;
  color: #FFD700;
  display: flex;
  align-items: center;
  
  svg {
    margin-right: var(--spacing-small);
    fill: #FFD700;
  }
`;

const HelpIcon = styled.span`
  font-size: 24px;
  transition: transform 0.3s;
  transform: ${props => props.isOpen ? 'rotate(180deg)' : 'rotate(0)'};
`;

const HelpContent = styled.div`
  max-height: ${props => props.isOpen ? '1000px' : '0'};
  overflow: hidden;
  transition: max-height 0.5s ease-in-out;
  opacity: ${props => props.isOpen ? '1' : '0'};
  transition: opacity 0.3s, max-height 0.5s;
`;

const HelpSection = styled.div`
  margin: var(--spacing-medium) 0;
`;

const HelpSectionTitle = styled.h4`
  color: #FFD700;
  margin-bottom: var(--spacing-small);
  border-bottom: 1px solid rgba(255, 215, 0, 0.3);
  padding-bottom: 5px;
`;

const HelpText = styled.div`
  line-height: 1.6;
  font-size: var(--font-size-medium);
  color: #FFFFFF;
  
  ul, ol {
    padding-left: var(--spacing-large);
    margin: var(--spacing-small) 0;
  }
  
  li {
    margin-bottom: var(--spacing-small);
    color: #FFFFFF;
  }
  
  p {
    margin: var(--spacing-small) 0;
    color: #FFFFFF;
  }
  
  strong {
    color: #FFD700;
    font-weight: bold;
  }
  
  a {
    color: #ADD8E6;
    text-decoration: underline;
    
    &:hover {
      color: #FFD700;
    }
  }
`;

const PageHelp = ({ title, children }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  const toggleHelp = () => {
    setIsOpen(!isOpen);
  };
  
  return (
    <HelpContainer>
      <HelpHeader onClick={toggleHelp}>
        <HelpTitle>
          <svg 
            width="24" 
            height="24" 
            viewBox="0 0 24 24" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <path 
              d="M12 22C6.477 22 2 17.523 2 12C2 6.477 6.477 2 12 2C17.523 2 22 6.477 22 12C22 17.523 17.523 22 12 22ZM12 20C16.418 20 20 16.418 20 12C20 7.582 16.418 4 12 4C7.582 4 4 7.582 4 12C4 16.418 7.582 20 12 20ZM12 17C11.448 17 11 16.552 11 16C11 15.448 11.448 15 12 15C12.552 15 13 15.448 13 16C13 16.552 12.552 17 12 17ZM12 7C14.21 7 16 8.79 16 11C16 11.862 15.722 12.33 15.268 12.864C14.819 13.393 14.28 13.9 13.732 14.419C13.257 14.867 13 15.42 13 16H11C11 14.954 11.366 14.246 12.025 13.627C12.66 13.031 13.209 12.507 13.521 12.132C13.791 11.81 14 11.459 14 11C14 9.895 13.105 9 12 9C10.895 9 10 9.895 10 11H8C8 8.79 9.79 7 12 7Z" 
              fill="currentColor"
            />
          </svg>
          {title}
        </HelpTitle>
        <HelpIcon isOpen={isOpen}>▼</HelpIcon>
      </HelpHeader>
      
      <HelpContent isOpen={isOpen}>
        {children}
      </HelpContent>
    </HelpContainer>
  );
};

export const HelpSectionBlock = ({ title, children }) => {
  return (
    <HelpSection>
      <HelpSectionTitle>{title}</HelpSectionTitle>
      <HelpText>{children}</HelpText>
    </HelpSection>
  );
};

export default PageHelp;
