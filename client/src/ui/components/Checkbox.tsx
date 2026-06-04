// src/ui/components/common/Checkbox.tsx
import styled from '@emotion/styled';

const StyledCheckboxBox = styled.div<{ isChecked: boolean }>`
  width: 24px;
  height: 24px;
  border-radius: 8px;
  border: 1px solid ${({ isChecked }) => (isChecked ? '#000000' : '#0000001A')};
  background-color: ${({ isChecked }) => (isChecked ? '#000000' : '#FFFFFF')};
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;

  &::after {
    content: '';
    display: block;
    width: 6px;
    height: 12px;
    border: solid ${({ isChecked }) => (isChecked ? '#FFFFFF' : '#0000001A')};
    border-width: 0 2px 2px 0;
    transform: rotate(45deg);
    margin-bottom: 2px;
  }
`;

interface CheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
}

export const Checkbox = ({ checked, onChange }: CheckboxProps) => {
  return (
    <StyledCheckboxBox
      isChecked={checked}
      onClick={() => onChange(!checked)}
      role="checkbox"
      aria-checked={checked}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onChange(!checked);
        }
      }}
    />
  );
};
