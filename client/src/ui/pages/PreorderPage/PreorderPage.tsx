import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { validateCoupon } from '@cart/shared';
import type { Coupon } from '@cart/shared';
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
import { usePreorder } from './usePreorder';

interface PreorderState {
  preorderId: string;
}

const formatExpirationDate = (dateString: string) => {
  const [year, month, day] = dateString.split('-');
  return `${year}년 ${Number(month)}월 ${Number(day)}일`;
};

const formatCondition = (condition: Coupon['condition']) => {
  if (condition.minOrderLimit)
    return `최소 주문 금액: ${condition.minOrderLimit.toLocaleString()}원`;
  if (condition.validTime)
    return `사용 가능 시간: ${condition.validTime.startHour}시부터 ${condition.validTime.endHour}시까지`;
  return '';
};

export const PreorderPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as PreorderState | null;

  const {
    preorder,
    coupons,
    isRemoteArea,
    setIsRemoteArea,
    isModalOpen,
    closeModal,
    tempSelectedCouponIds,
    isLoading,
    isSubmitting,
    currentReceipt,
    tempReceipt,
    handlePayment,
    openModal,
    toggleTempCoupon,
    applyCoupons,
  } = usePreorder(state?.preorderId);

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
                  (item) => item.productId === gift.productId,
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
          <ModalOverlay onClick={() => closeModal()}>
            <ModalContent onClick={(e) => e.stopPropagation()}>
              <ModalHeader>
                <ModalTitle>쿠폰을 선택해 주세요</ModalTitle>
                <CloseButton onClick={() => closeModal()}>
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
