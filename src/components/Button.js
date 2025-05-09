import styled from "styled-components";

const Button = styled.button`
  display: inline-block;
  min-width: 200px;
  font-size: var(--font-size-medium);
  padding: var(--spacing-medium) var(--spacing-large);
  margin: var(--spacing-medium) 0;
  background-color: var(--primary-color);
  color: white;
  border: none;
  border-radius: var(--border-radius);
  cursor: pointer;
  text-align: center;
  font-weight: bold;
  transition: background-color 0.3s;
  
  &:hover {
    background-color: var(--secondary-color);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  
  &.secondary {
    background-color: #666;
    
    &:hover {
      background-color: #444;
    }
  }
  
  &.large {
    font-size: var(--font-size-large);
    padding: var(--spacing-large);
  }
`;

export default Button;
