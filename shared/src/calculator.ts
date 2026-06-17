import {
  Coupon,
  DELIVERY_RULES,
  GiftItem,
  OrderReceipt,
  PreorderItem,
} from "./types";

export const calculateOrderAmount = (items: PreorderItem[]): number => {
  return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
};

export const calculateBogoDiscount = (
  items: PreorderItem[],
  bogoCoupon: Coupon,
): number => {
  const minQuantity = bogoCoupon.condition.minBogoQuantity ?? 2;
  const bogoTargets = items.filter((item) => item.quantity >= minQuantity);
  if (bogoTargets.length === 0) return 0;

  const expensiveItem = bogoTargets.reduce(
    (max, item) => (item.price > max.price ? item : max),
    bogoTargets[0],
  );

  return expensiveItem.price;
};

export const calculateBaseShippingFee = (
  orderAmount: number,
  isRemoteArea: boolean,
): number => {
  if (orderAmount === 0 || orderAmount >= DELIVERY_RULES.FREE_DELIVERY_LIMIT) {
    return 0;
  }

  return isRemoteArea
    ? DELIVERY_RULES.BASE_DELIVERY_FEE + DELIVERY_RULES.JEJU_EXTRA_FEE
    : DELIVERY_RULES.BASE_DELIVERY_FEE;
};

export const generateOrderReceipt = (
  items: PreorderItem[],
  selectedCoupons: Coupon[],
  isRemoteArea: boolean,
  serverTime: Date,
): OrderReceipt => {
  const orderAmount = calculateOrderAmount(items);
  const discountCoupons = selectedCoupons.filter(
    (coupon) => coupon.type === "DISCOUNT",
  );
  const bogoCoupon = selectedCoupons.find((coupon) => coupon.type === "BOGO");
  const rateCoupons = selectedCoupons.filter(
    (coupon) => coupon.type === "TIMESALE",
  );
  const hasFreeShippingCoupon = selectedCoupons.some(
    (coupon) => coupon.type === "FREESHIPPING",
  );

  const giftItems: GiftItem[] = bogoCoupon
    ? (() => {
        const minQuantity = bogoCoupon.condition.minBogoQuantity ?? 2;
        const freeQuantity = bogoCoupon.benefit.bogoFreeQuantity ?? 1;

        const bogoTargets = items.filter(
          (item) => item.quantity >= minQuantity,
        );
        if (bogoTargets.length === 0) return [];

        const target = bogoTargets.reduce(
          (max, item) => (item.price > max.price ? item : max),
          bogoTargets[0],
        );

        return [
          {
            productId: target.productId,
            giftQuantity: freeQuantity,
          },
        ];
      })()
    : [];

  const fixedDiscount = discountCoupons.reduce(
    (sum, coupon) => sum + (coupon.benefit.discountAmount ?? 0),
    0,
  );
  const amountAfterFixed = orderAmount - fixedDiscount;

  const rateDiscount = rateCoupons.reduce((sum, coupon) => {
    const hour = serverTime.getHours();
    const start = coupon.condition.validTime?.startHour ?? 4;
    const end = coupon.condition.validTime?.endHour ?? 7;
    const rate = coupon.benefit.discountRate ?? 0;

    return hour >= start && hour < end ? sum + amountAfterFixed * rate : sum;
  }, 0);

  const baseShippingFee = calculateBaseShippingFee(orderAmount, isRemoteArea);

  const totalProductDiscount = fixedDiscount + rateDiscount;
  const shippingDiscount = hasFreeShippingCoupon ? baseShippingFee : 0;

  const totalCashDiscount = totalProductDiscount + shippingDiscount;

  const totalPaymentAmount = orderAmount + baseShippingFee - totalCashDiscount;

  return {
    priceSummary: {
      orderAmount,
      discountAmount: totalCashDiscount,
      shippingFee: baseShippingFee,
      totalPaymentAmount,
    },
    giftItems,
  };
};
