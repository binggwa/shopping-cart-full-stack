import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import backIcon from '../../../assets/backIcon.svg';
import {
  BottomSection,
  ContainerWrapper,
  MainContent,
  OrderDescription,
  OrderTitle,
  PageContainer,
  PayButton,
  PriceLabel,
  PriceSection,
  PriceValue,
} from './OrderConfirmPage.styles';
import { Header } from '../../components/Header/Header';

interface OrderConfirmState {
  selectedIds: number[];
  totalSelectedQuantity: number;
  totalPrice: number;
}

export const OrderConfirmPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const state = location.state as OrderConfirmState | null;

  useEffect(() => {
    if (!state || state.selectedIds.length === 0) {
      alert('주문 정보가 존재하지 않습니다. 장바구니로 돌아갑니다.');
      navigate('/cart', { replace: true });
    }
  }, [state, navigate]);

  if (!state) return null;

  const { selectedIds, totalSelectedQuantity, totalPrice } = state;
  const idCount = selectedIds.length;

  const handlePayment = () => {
    alert('결제가 완료되었습니다!');
  };

  return (
    <PageContainer>
      <ContainerWrapper>
        <Header iconSrc={backIcon} onLogoClick={() => navigate('/cart')} />

        <MainContent>
          <OrderTitle>주문 확인</OrderTitle>
          <OrderDescription>
            {`총 ${idCount}종류의 상품 ${totalSelectedQuantity}개를 주문합니다.\n최종 결제 금액을 확인해 주세요.`}
          </OrderDescription>

          <PriceSection>
            <PriceLabel>총 결제 금액</PriceLabel>
            <PriceValue>{totalPrice.toLocaleString()}원</PriceValue>
          </PriceSection>
        </MainContent>

        <BottomSection>
          <PayButton onClick={handlePayment}>결제하기</PayButton>
        </BottomSection>
      </ContainerWrapper>
    </PageContainer>
  );
};
