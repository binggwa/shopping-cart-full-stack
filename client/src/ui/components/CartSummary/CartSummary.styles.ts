import styled from '@emotion/styled';

export const SummaryContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 12px;
`;

export const InfoRow = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  font-weight: 500;
  color: #0a0d13;
`;

export const InfoIconImg = styled.img`
  width: 16px;
  height: 16px;
`;

export const Divider = styled.div`
  width: 100%;
  height: 1px;
  background-color: #0000001a;
`;

export const PriceRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;

  &:last-child {
    margin-bottom: 0;
  }
`;

export const Label = styled.span`
  font-size: 16px;
  font-weight: 700;
  color: #0a0d13;
`;

export const Value = styled.span`
  font-size: 24px;
  font-weight: 700;
  color: #000000;
`;
