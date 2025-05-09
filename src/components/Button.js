import styled from "styled-components";

const Button = styled.button`
  background-color: #8B0000;
  color: #fff;
  border: 2px dashed #FFD700;
  border-radius: 8px;
  padding: 15px 25px;
  font-size: 18px;
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;
  min-width: 180px;
  
  &:before {
    content: '';
    position: absolute;
    top: -2px;
    left: -2px;
    right: -2px;
    bottom: -2px;
    z-index: -1;
    background: repeating-linear-gradient(
      45deg,
      #FFD700,
      #FFD700 10px,
      #8B0000 10px,
      #8B0000 20px
    );
    opacity: 0;
    transition: opacity 0.3s ease;
  }
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.3);
    background-color: #a00000;
    
    &:before {
      opacity: 0.1;
    }
  }
  
  &:active {
    transform: translateY(1px);
  }
  
  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
  
  &.secondary {
    background-color: rgba(0, 0, 0, 0.6);
    
    &:hover {
      background-color: #8B0000;
    }
  }
  
  &.large {
    font-size: var(--font-size-large);
    padding: var(--spacing-large);
  }
`;

export default Button;
