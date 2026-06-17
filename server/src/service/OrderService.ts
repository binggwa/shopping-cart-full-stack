import {
  generateOrderReceipt,
  validateCoupon,
  CalculatedPrice,
  OrderReceipt,
} from "@cart/shared";
import {
  InvalidError,
  NotFoundError,
  ConflictError,
} from "../errors/CustomErrorClass";
import { ERROR_MESSAGE } from "../errors/ErrorMessage";
import { ProductRepositoryInterface } from "../repositories/interfaces/ProductRepositoryInterface";
import { CouponRepositoryInterface } from "../repositories/interfaces/CouponRepositoryInterface";

export interface OrderRequestPayload {
  items: { productId: number; quantity: number }[];
  couponIds: number[];
  isRemoteArea: boolean;
  expectedPriceSummary: CalculatedPrice;
}

export default class OrderService {
  #productRepo: ProductRepositoryInterface;
  #couponRepo: CouponRepositoryInterface;

  constructor(
    productRepo: ProductRepositoryInterface,
    couponRepo: CouponRepositoryInterface,
  ) {
    this.#productRepo = productRepo;
    this.#couponRepo = couponRepo;
  }

  createOrder(payload: OrderRequestPayload): OrderReceipt {
    const serverTime = new Date();

    const serverItems = payload.items.map((item) => {
      const product = this.#productRepo.findById(item.productId);
      if (!product) throw new ConflictError(ERROR_MESSAGE.NO_MATCH_PRODUCT);
      return { ...product, quantity: item.quantity };
    });

    const serverCoupons = payload.couponIds.map((id) => {
      const coupon = this.#couponRepo.findById(id);
      if (!coupon) throw new ConflictError(ERROR_MESSAGE.NOT_FOUND_COUPON);
      return coupon;
    });

    const hasInvalidCoupon = serverCoupons.some(
      (coupon) => !validateCoupon(serverItems, coupon, serverTime),
    );
    if (hasInvalidCoupon) {
      throw new InvalidError(ERROR_MESSAGE.INVALID_COUPON_CONDITION);
    }

    const serverReceipt = generateOrderReceipt(
      serverItems,
      serverCoupons,
      payload.isRemoteArea,
      serverTime,
    );

    this.#verifyExpectedPrice(
      payload.expectedPriceSummary,
      serverReceipt.priceSummary,
    );

    return serverReceipt;
  }

  #verifyExpectedPrice(
    expected: CalculatedPrice,
    actual: CalculatedPrice,
  ): void {
    if (expected.totalPaymentAmount !== actual.totalPaymentAmount) {
      throw new ConflictError(ERROR_MESSAGE.PRICE_MISMATCH_CONFLICT);
    }

    if (
      expected.discountAmount !== actual.discountAmount ||
      expected.shippingFee !== actual.shippingFee
    ) {
      throw new ConflictError(ERROR_MESSAGE.DETAIL_AMOUNT_CONFLICT);
    }
  }
}
