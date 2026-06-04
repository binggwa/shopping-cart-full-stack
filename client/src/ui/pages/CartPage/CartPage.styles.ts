import styled from '@emotion/styled';

export const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  background-color: #f5f5f5;
  min-height: 100vh;
`;

export const MainContent = styled.main`
  display: flex;
  flex-direction: column;
  padding: 36px 24px 0 24px;
  flex: 1;
  padding-bottom: 104px;
`;

export const TitleSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
  margin-bottom: 36px;
`;

export const PageTitle = styled.p`
  font-size: 24px;
  font-weight: 700;
  color: #000000;
  margin: 0;
`;

export const SubTitle = styled.p`
  font-size: 12px;
  font-weight: 500;
  color: #0a0d13;
  margin: 0;
`;

export const SelectAllRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 20px;
`;

export const CheckboxLabel = styled.p`
  font-size: 12px;
  font-weight: 500;
  color: #0a0d13;
`;

export const CartListContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-bottom: 52px;
`;

export const ItemWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

export const EmptyStateWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex: 1;
  font-size: 16px;
  font-weight: 400;
  color: #0a0d13;
`;

export const BottomSection = styled.div`
  position: fixed;
  bottom: 0;
  width: 100%;
`;

export const OrderButton = styled.button`
  width: 100%;
  height: 64px;
  background-color: #000000;
  color: #ffffff;
  font-size: 16px;
  font-weight: 700;
  border: none;
  cursor: pointer;

  &:disabled {
    background-color: #bebebe;
    color: #ffffff;
    cursor: not-allowed;
  }
`;
