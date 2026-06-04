import styled from '@emotion/styled';

export const ItemContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 20px 0;
`;

export const Divider = styled.div`
  width: 100%;
  height: 1px;
  background-color: #0000001a;
  margin-bottom: 12px;
`;

export const TopRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 12px 0;
`;

export const DeleteButton = styled.button`
  background: #ffffff;
  border: 1px solid #0000001a;
  border-radius: 4px;
  padding: 4px 8px;
  font-size: 12px;
  font-weight: 500;
  color: #0a0d13;
  cursor: pointer;
`;

export const ContentRow = styled.div`
  display: flex;
  gap: 24px;
  height: 112px;
`;

export const Thumbnail = styled.img`
  width: 112px;
  height: 112px;
  border-radius: 8px;
  object-fit: cover;
`;

export const InfoSection = styled.div`
  display: flex;
  flex-direction: column;
  padding: 9.5px 0;
`;

export const TextGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

export const ProductName = styled.div`
  font-weight: 500;
  font-size: 12px;
  color: #0a0d13;
`;

export const ProductPrice = styled.div`
  font-weight: 700;
  font-size: 24px;
  color: #000000;
`;

export const StepperContainer = styled.div`
  display: flex;
  align-items: center;
  margin-top: 24px;
  gap: 4px;
`;

export const StepperButton = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 24px;
  height: 24px;
  background-color: #ffffff;
  border: 1px solid #0000001a;
  border-radius: 8px;
  color: #363636;
  font-size: 16px;
  cursor: pointer;
`;

export const QuantityDisplay = styled.div`
  font-weight: 500;
  font-size: 12px;
  color: #0a0d13;
  min-width: 15px;
  text-align: center;
`;
