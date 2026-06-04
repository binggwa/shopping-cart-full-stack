import infoIcon from '../../../assets/InfoIcon.svg';
import {
  Divider,
  InfoIconImg,
  InfoRow,
  Label,
  PriceRow,
  SummaryContainer,
  Value,
} from './CartSummary.styles';

interface CartSummaryProps {
  totalProductPrice: number;
  deliveryPrice: number;
  totalPrice: number;
}

export const CartSummary = ({
  totalProductPrice,
  deliveryPrice,
  totalPrice,
}: CartSummaryProps) => {
  return (
    <SummaryContainer>
      <InfoRow>
        <InfoIconImg src={infoIcon} alt="info" />
        <span>총 주문 금액이 100,000원 이상일 경우 무료 배송됩니다.</span>
      </InfoRow>

      <Divider />

      <PriceRow>
        <Label>주문 금액</Label>
        <Value>{totalProductPrice.toLocaleString()}원</Value>
      </PriceRow>
      <PriceRow>
        <Label>배송비</Label>
        <Value>{deliveryPrice.toLocaleString()}원</Value>
      </PriceRow>

      <Divider />

      <PriceRow>
        <Label>총 결제 금액</Label>
        <Value>{totalPrice.toLocaleString()}원</Value>
      </PriceRow>
    </SummaryContainer>
  );
};
