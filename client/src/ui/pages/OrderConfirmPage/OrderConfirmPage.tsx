import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import type { OrderResponse } from '@cart/shared';
import { fetchOrderApi } from '../../../infrastructure/api/fetchOrderApi';
import {
  BottomSection,
  ContainerWrapper,
  MainContent,
  OrderDescription,
  OrderTitle,
  PageContainer,
  ReturnButton,
  PriceLabel,
  PriceSection,
  PriceValue,
  TopHeaderBar,
} from './OrderConfirmPage.styles';

export const OrderConfirmPage = () => {
  const navigate = useNavigate();
  const { orderId } = useParams<{ orderId: string }>();

  const [order, setOrder] = useState<OrderResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!orderId || isNaN(Number(orderId))) {
      setError('잘못된 접근입니다.');
      setIsLoading(false);
      return;
    }

    const loadOrderData = async () => {
      try {
        const fetchedOrder = await fetchOrderApi.getOrder(Number(orderId));
        setOrder(fetchedOrder);
      } catch (err: any) {
        setError(err.message || '주문 내역을 불러오는데 실패했습니다.');
      } finally {
        setIsLoading(false);
      }
    };

    loadOrderData();
  }, [orderId]);

  if (error) {
    alert(error);
    navigate('/cart', { replace: true });
    return null;
  }

  if (isLoading || !order) {
    return (
      <PageContainer>
        <ContainerWrapper>
          <TopHeaderBar />
          <MainContent>
            <OrderDescription>
              결제 내역을 불러오는 중입니다...
            </OrderDescription>
          </MainContent>
        </ContainerWrapper>
      </PageContainer>
    );
  }

  const baseQuantity = order.items.reduce(
    (sum, item) => sum + item.quantity,
    0,
  );
  const giftQuantity = order.giftItems.reduce(
    (sum, gift) => sum + gift.giftQuantity,
    0,
  );
  const finalTotalQuantity = baseQuantity + giftQuantity;

  const itemTypesCount = order.items.length;

  return (
    <PageContainer>
      <ContainerWrapper>
        <TopHeaderBar />

        <MainContent>
          <OrderTitle>결제 확인</OrderTitle>
          <OrderDescription>
            {`총 ${itemTypesCount}종류의 상품 ${finalTotalQuantity}개를 주문했습니다.\n최종 결제 금액을 확인해 주세요.`}
          </OrderDescription>

          <PriceSection>
            <PriceLabel>총 결제 금액</PriceLabel>
            <PriceValue>
              {order.priceSummary.totalPaymentAmount.toLocaleString()}원
            </PriceValue>
          </PriceSection>
        </MainContent>

        <BottomSection>
          <ReturnButton onClick={() => navigate('/cart', { replace: true })}>
            장바구니로 돌아가기
          </ReturnButton>
        </BottomSection>
      </ContainerWrapper>
    </PageContainer>
  );
};
