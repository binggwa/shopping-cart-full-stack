export interface PreorderItem {
  productId: number;
  name: string;
  price: number;
  thumbnailUrl: string;
  quantity: number;
}

export type CouponType = "DISCOUNT" | "TIMESALE" | "BOGO" | "FREESHIPPING";

export interface CouponCondition {
  minOrderLimit?: number;
  validTime?: {
    startHour: number;
    endHour: number;
  };
  minBogoQuantity?: number;
}

export interface CouponBenefit {
  discountAmount?: number;
  discountRate?: number;
  bogoFreeQuantity?: number;
}

export interface Coupon {
  couponId: number;
  name: string;
  type: CouponType;
  expirationDate: string;
  condition: CouponCondition;
  benefit: CouponBenefit;
}

export interface CouponResponse extends Coupon {
  disabled: boolean;
}

export interface CalculatedPrice {
  orderAmount: number;
  discountAmount: number;
  shippingFee: number;
  totalPaymentAmount: number;
}

export const DELIVERY_RULES = {
  FREE_DELIVERY_LIMIT: 100000,
  BASE_DELIVERY_FEE: 3000,
  JEJU_EXTRA_FEE: 3000,
} as const;
