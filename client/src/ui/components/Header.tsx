import styled from '@emotion/styled';

const HeaderWrapper = styled.header`
  background-color: #000000;
  height: 64px;
  padding: 24px;
  display: flex;
  align-items: center;
  color: #ffffff;
`;

const Logo = styled.div`
  cursor: pointer;

  h1 {
    font-size: 20px;
    font-weight: 800;
  }
`;

interface HeaderProps {
  onLogoClick?: () => void;
}

export const Header = ({ onLogoClick }: HeaderProps) => {
  return (
    <HeaderWrapper>
      <Logo onClick={onLogoClick}>
        <h1>SHOP</h1>
      </Logo>
    </HeaderWrapper>
  );
};
