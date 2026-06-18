import {
  generateOrderReceipt,
  validateCoupon,
  CalculatedPrice,
} from "@cart/shared";
import {
  InvalidError,
  ConflictError,
  NotFoundError,
} from "../errors/CustomErrorClass";
import { ERROR_MESSAGE } from "../errors/ErrorMessage";
import { ProductRepositoryInterface } from "../repositories/interfaces/ProductRepositoryInterface";
import { CouponRepositoryInterface } from "../repositories/interfaces/CouponRepositoryInterface";
import { OrderRepositoryInterface } from "../repositories/interfaces/OrderRepositoryInterface";
import { CartRepositoryInterface } from "../repositories/interfaces/CartRepositoryInterface";
import { Order } from "../repositories/Order";
import { validateId } from "../util/Validator";

export interface OrderRequestPayload {
  items: { productId: number; quantity: number }[];
  couponIds: number[];
  isRemoteArea: boolean;
  expectedPriceSummary: CalculatedPrice;
}

export default class OrderService {
  #productRepo: ProductRepositoryInterface;
  #couponRepo: CouponRepositoryInterface;
  #orderRepo: OrderRepositoryInterface;
  #cartRepo: CartRepositoryInterface;

  constructor(
    productRepo: ProductRepositoryInterface,
    couponRepo: CouponRepositoryInterface,
    orderRepo: OrderRepositoryInterface,
    cartRepo: CartRepositoryInterface,
  ) {
    this.#productRepo = productRepo;
    this.#couponRepo = couponRepo;
    this.#orderRepo = orderRepo;
    this.#cartRepo = cartRepo;
  }

  createOrder(payload: OrderRequestPayload): Order {
    const serverTime = new Date();

    if (!payload.items || payload.items.length === 0) {
      throw new InvalidError(ERROR_MESSAGE.NOT_FOUND_CART_ITEM);
    }
    if (!payload.expectedPriceSummary) {
      throw new InvalidError(ERROR_MESSAGE.NO_EXPECTED_PRICE);
    }

    const serverItems = payload.items.map((item) => {
      const product = this.#productRepo.findById(item.productId);
      if (!product) throw new ConflictError(ERROR_MESSAGE.NO_MATCH_PRODUCT);
      return {
        productId: product.productId,
        name: product.name,
        price: product.price,
        thumbnailUrl: product.thumbnailUrl,
        quantity: item.quantity,
      };
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

    const savedOrder = this.#orderRepo.save({
      items: serverItems,
      priceSummary: serverReceipt.priceSummary,
      giftItems: serverReceipt.giftItems,
    });

    payload.items.forEach((item) => {
      this.#cartRepo.deleteByProductId(item.productId);
    });

    return savedOrder;
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

  getOrder(orderId: number): Order {
    validateId(orderId);

    const order = this.#orderRepo.findById(orderId);
    if (!order) {
      throw new NotFoundError(ERROR_MESSAGE.NO_ORDER);
    }

    return order;
  }
}
