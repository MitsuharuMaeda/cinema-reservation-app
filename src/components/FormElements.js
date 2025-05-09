import styled from "styled-components";

export const Label = styled.label`
  display: block;
  font-weight: bold;
  margin-bottom: var(--spacing-small);
  font-size: var(--font-size-medium);
  color: #333333;
`;

export const Input = styled.input`
  width: 100%;
  padding: var(--spacing-medium);
  border: 2px solid #ccc;
  border-radius: var(--border-radius);
  font-size: var(--font-size-medium);
  
  &:focus {
    border-color: var(--primary-color);
    outline: none;
  }
`;

export const Select = styled.select`
  width: 100%;
  padding: var(--spacing-medium);
  border: 2px solid #ccc;
  border-radius: var(--border-radius);
  font-size: var(--font-size-medium);
  
  &:focus {
    border-color: var(--primary-color);
    outline: none;
  }
`;
