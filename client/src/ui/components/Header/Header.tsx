import styled from '@emotion/styled';

const HeaderWrapper = styled.header`
  background-color: #000000;
  width: 100%;
  height: 64px;
  padding: 0 24px;
  display: flex;
  align-items: center;
  color: #ffffff;
`;

const Logo = styled.div`
  cursor: pointer;
  display: flex;
  align-items: center;

  h1 {
    font-size: 20px;
    font-weight: 800;
  }

  img {
    width: 32px;
    height: 32px;
  }
`;

interface HeaderProps {
  onLogoClick?: () => void;
  iconSrc?: string;
}

export const Header = ({ onLogoClick, iconSrc }: HeaderProps) => {
  return (
    <HeaderWrapper>
      <Logo onClick={onLogoClick}>
        {iconSrc ? (
          <img src={iconSrc} alt="헤더 아이콘" />
        ) : (
          <h1>SHOP</h1>
        )}
      </Logo>
    </HeaderWrapper>
  );
};
