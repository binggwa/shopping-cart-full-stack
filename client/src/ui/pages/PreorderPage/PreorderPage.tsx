import { useEffect, useState, useMemo } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { generateOrderReceipt, validateCoupon } from '@cart/shared';
import type { PreorderResponse, Coupon } from '@cart/shared';
import { fetchPreorderApi } from '../../../infrastructure/api/fetchPreorderApi';
import { fetchCouponApi } from '../../../infrastructure/api/fetchCouponApi';
import { fetchOrderApi } from '../../../infrastructure/api/fetchOrderApi';
import { findBestCouponCombination } from '../../../domain/couponOptimizer';
import backIcon from '../../../assets/backIcon.svg';
import infoIcon from '../../../assets/InfoIcon.svg';
import { Header } from '../../components/Header/Header';
import { Checkbox } from '../../components/Checkbox/Checkbox';
import {
  BottomSection,
  ContainerWrapper,
  MainContent,
  PageContainer,
  PayButton,
  TitleSection,
  PageTitle,
  SubTitle,
  Divider,
  SectionDivider,
  ProductItemWrapper,
  ProductThumbnail,
  ProductInfo,
  ProductName,
  ProductPrice,
  ProductQuantity,
  CouponApplyButton,
  DeliverySection,
  SectionTitle,
  DeliveryCheckboxRow,
  DeliveryLabel,
  InfoText,
  ModalInfoText,
  IconImage,
  SummarySection,
  PriceRow,
  PriceLabel,
  PriceValue,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalTitle,
  CloseButton,
  CouponListWrapper,
  CouponItemWrapper,
  CouponInfoWrapper,
  CouponName,
  CouponDetail,
  ModalApplyButton,
  GiftSection,
  GiftBadge,
  OriginalPriceStrike,
} from './PreorderPage.styles';
import { CART_RULES } from '../../../domain/constants';

interface PreorderState {
  preorderId: string;
}

export const PreorderPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as PreorderState | null;

  const [preorder, setPreorder] = useState<PreorderResponse | null>(null);
  const [coupons, setCoupons] = useState<Coupon[]>([]);

  const [selectedCouponIds, setSelectedCouponIds] = useState<number[]>([]);
  const [isRemoteArea, setIsRemoteArea] = useState<boolean>(false);

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [tempSelectedCouponIds, setTempSelectedCouponIds] = useState<number[]>(
    [],
  );

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  useEffect(() => {
    if (!state?.preorderId) return;

    const loadData = async () => {
      try {
        const [preorderData, couponsData] = await Promise.all([
          fetchPreorderApi.getPreorder(state.preorderId),
          fetchCouponApi.getCoupons(),
        ]);

        setPreorder(preorderData);
        setCoupons(couponsData);

        const bestCombo = findBestCouponCombination(
          preorderData.items,
          couponsData,
          false,
        );
        setSelectedCouponIds(bestCombo.map((c) => c.couponId));
      } catch (err) {
        alert('데이터를 불러오지 못했습니다. 장바구니로 돌아갑니다.');
        navigate('/cart', { replace: true });
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, [state?.preorderId, navigate]);

  const currentReceipt = useMemo(() => {
    if (!preorder) return null;
    const activeCoupons = coupons.filter((c) =>
      selectedCouponIds.includes(c.couponId),
    );
    return generateOrderReceipt(
      preorder.items,
      activeCoupons,
      isRemoteArea,
      new Date(),
    );
  }, [preorder, coupons, selectedCouponIds, isRemoteArea]);

  const tempReceipt = useMemo(() => {
    if (!preorder) return null;
    const activeCoupons = coupons.filter((c) =>
      tempSelectedCouponIds.includes(c.couponId),
    );
    return generateOrderReceipt(
      preorder.items,
      activeCoupons,
      isRemoteArea,
      new Date(),
    );
  }, [preorder, coupons, tempSelectedCouponIds, isRemoteArea]);

  if (!state?.preorderId) {
    return (
      <Navigate
        to="/cart"
        replace
        state={{ error: '비정상적인 접근입니다!' }}
      />
    );
  }

  if (isLoading || !preorder || !currentReceipt || !tempReceipt) {
    return <div>결제 정보를 불러오는 중입니다...</div>;
  }

  const handlePayment = async () => {
    setIsSubmitting(true);
    try {
      const order = await fetchOrderApi.submitOrder(
        preorder.preorderId,
        selectedCouponIds,
        isRemoteArea,
        currentReceipt.priceSummary,
      );
      alert('결제가 성공적으로 완료되었습니다!');
      navigate(`/orders/${order.orderId}`, { replace: true });
    } catch (err: any) {
      if (err.status === 409 || err.status === 404) {
        alert(`${err.message}\n장바구니로 돌아가 최신 상태를 갱신합니다.`);
        navigate('/cart', { replace: true });
      } else {
        alert('결제 중 오류가 발생했습니다.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const openModal = () => {
    setTempSelectedCouponIds(selectedCouponIds);
    setIsModalOpen(true);
  };

  const toggleTempCoupon = (couponId: number) => {
    setTempSelectedCouponIds((prev) => {
      if (prev.includes(couponId)) {
        return prev.filter((id) => id !== couponId);
      }
      if (prev.length >= 2) {
        return prev;
      }
      return [...prev, couponId];
    });
  };

  const applyCoupons = () => {
    setSelectedCouponIds(tempSelectedCouponIds);
    setIsModalOpen(false);
  };

  const formatExpirationDate = (dateString: string) => {
    const [year, month, day] = dateString.split('-');
    return `${year}년 ${Number(month)}월 ${Number(day)}일`;
  };

  const formatCondition = (condition: Coupon['condition']) => {
    if (condition.minOrderLimit)
      return `최소 주문 금액: ${condition.minOrderLimit.toLocaleString()}원`;
    if (condition.validTime)
      return `사용 가능 시간: 오전 ${condition.validTime.startHour}시부터 ${condition.validTime.endHour}시까지`;
    return '';
  };

  const totalQuantity = preorder.items.reduce(
    (sum, item) => sum + item.quantity,
    0,
  );

  return (
    <PageContainer>
      <ContainerWrapper>
        <Header iconSrc={backIcon} onLogoClick={() => navigate('/cart')} />

        <MainContent>
          <TitleSection>
            <PageTitle>주문 확인</PageTitle>
            <SubTitle>
              {`총 ${preorder.items.length}종류의 상품 ${totalQuantity}개를 주문합니다.\n최종 결제 금액을 확인해 주세요.`}
            </SubTitle>
          </TitleSection>

          <SectionDivider />

          {preorder.items.map((item) => (
            <ProductItemWrapper key={item.productId}>
              <ProductThumbnail src={item.thumbnailUrl} alt={item.name} />
              <ProductInfo>
                <ProductName>{item.name}</ProductName>
                <ProductPrice>{item.price.toLocaleString()}원</ProductPrice>
                <ProductQuantity>{item.quantity}개</ProductQuantity>
              </ProductInfo>
            </ProductItemWrapper>
          ))}

          <CouponApplyButton onClick={openModal}>쿠폰 적용</CouponApplyButton>

          {currentReceipt.giftItems.length > 0 && (
            <GiftSection>
              <SectionTitle>증정품 혜택</SectionTitle>
              {currentReceipt.giftItems.map((gift) => {
                const originalItem = preorder.items.find(
                  (i) => i.productId === gift.productId,
                );
                if (!originalItem) return null;

                return (
                  <ProductItemWrapper key={`gift-${gift.productId}`}>
                    <ProductThumbnail
                      src={originalItem.thumbnailUrl}
                      alt={originalItem.name}
                    />
                    <ProductInfo>
                      <ProductName>
                        <GiftBadge>증정</GiftBadge>
                        {originalItem.name}
                      </ProductName>
                      <ProductPrice>
                        0원{' '}
                        <OriginalPriceStrike>
                          {originalItem.price.toLocaleString()}원
                        </OriginalPriceStrike>
                      </ProductPrice>
                      <ProductQuantity>{gift.giftQuantity}개</ProductQuantity>
                    </ProductInfo>
                  </ProductItemWrapper>
                );
              })}
            </GiftSection>
          )}

          <Divider />

          <DeliverySection>
            <SectionTitle>배송 정보</SectionTitle>
            <DeliveryCheckboxRow onClick={() => setIsRemoteArea(!isRemoteArea)}>
              <Checkbox checked={isRemoteArea} onChange={() => {}} />
              <DeliveryLabel>제주도 및 도서 산간 지역</DeliveryLabel>
            </DeliveryCheckboxRow>
            <InfoText>
              <IconImage src={infoIcon} alt="info" />총 주문 금액이{' '}
              {CART_RULES.FREE_DELIVERY_LIMIT.toLocaleString()}원 이상일 경우
              무료 배송됩니다.
            </InfoText>
          </DeliverySection>

          <Divider />

          <SummarySection>
            <PriceRow>
              <PriceLabel>주문 금액</PriceLabel>
              <PriceValue>
                {currentReceipt.priceSummary.orderAmount.toLocaleString()}원
              </PriceValue>
            </PriceRow>
            <PriceRow>
              <PriceLabel>쿠폰 할인 금액</PriceLabel>
              <PriceValue>
                {currentReceipt.priceSummary.discountAmount > 0 ? '-' : ''}
                {currentReceipt.priceSummary.discountAmount.toLocaleString()}원
              </PriceValue>
            </PriceRow>
            <PriceRow>
              <PriceLabel>배송비</PriceLabel>
              <PriceValue>
                {currentReceipt.priceSummary.shippingFee.toLocaleString()}원
              </PriceValue>
            </PriceRow>
          </SummarySection>

          <SectionDivider />

          <PriceRow isTotal>
            <PriceLabel isTotal>총 결제 금액</PriceLabel>
            <PriceValue isTotal>
              {currentReceipt.priceSummary.totalPaymentAmount.toLocaleString()}
              원
            </PriceValue>
          </PriceRow>
        </MainContent>

        <BottomSection>
          <PayButton onClick={handlePayment} disabled={isSubmitting}>
            결제하기
          </PayButton>
        </BottomSection>

        {isModalOpen && (
          <ModalOverlay onClick={() => setIsModalOpen(false)}>
            <ModalContent onClick={(e) => e.stopPropagation()}>
              <ModalHeader>
                <ModalTitle>쿠폰을 선택해 주세요</ModalTitle>
                <CloseButton onClick={() => setIsModalOpen(false)}>
                  ✕
                </CloseButton>
              </ModalHeader>

              <ModalInfoText>
                <IconImage src={infoIcon} alt="info" />
                쿠폰은 최대 2개까지 사용할 수 있습니다.
              </ModalInfoText>

              <CouponListWrapper>
                {coupons.map((coupon) => {
                  const isValid = validateCoupon(
                    preorder.items,
                    coupon,
                    new Date(),
                  );
                  const isChecked = tempSelectedCouponIds.includes(
                    coupon.couponId,
                  );

                  return (
                    <CouponItemWrapper
                      key={coupon.couponId}
                      disabled={!isValid}
                      onClick={() =>
                        isValid && toggleTempCoupon(coupon.couponId)
                      }
                    >
                      <Checkbox checked={isChecked} onChange={() => {}} />
                      <CouponInfoWrapper>
                        <CouponName>{coupon.name}</CouponName>
                        {coupon.expirationDate && (
                          <CouponDetail>
                            만료일:{' '}
                            {formatExpirationDate(coupon.expirationDate)}
                          </CouponDetail>
                        )}
                        <CouponDetail>
                          {formatCondition(coupon.condition)}
                        </CouponDetail>
                      </CouponInfoWrapper>
                    </CouponItemWrapper>
                  );
                })}
              </CouponListWrapper>

              <ModalApplyButton onClick={applyCoupons}>
                총 {tempReceipt.priceSummary.discountAmount.toLocaleString()}원
                할인 쿠폰 사용하기
              </ModalApplyButton>
            </ModalContent>
          </ModalOverlay>
        )}
      </ContainerWrapper>
    </PageContainer>
  );
};
