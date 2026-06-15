import { calculateBaseShippingFee, calculateBogoDiscount, calculateOrderAmount } from "../calculator";
import { DELIVERY_RULES, PreorderItem } from "../types";
import { describe, it, expect } from "vitest";

describe("기본 상품 주문 금액 계산: calculateOrderAmount", () => {
  it("장바구니가 비어있으면 0원", () => {
    expect(calculateOrderAmount([])).toBe(0);
  });

  it("상품의 단가와 수량을 곱한 주문금액을 반환해야 한다.", () => {
    const items: PreorderItem[] = [
      {
        productId: 1,
        name: "셔츠",
        price: 20000,
        thumbnailUrl: "",
        quantity: 2,
      },
      {
        productId: 2,
        name: "바지",
        price: 30000,
        thumbnailUrl: "",
        quantity: 1,
      },
    ];

    expect(calculateOrderAmount(items)).toBe(70000);
  });
});

describe("BOGO 2+1 쿠폰 할인액 계산: calculateBogoDiscount", () => {
  it("수량이 2개 이상인 상품이 없으면 할인액은 0원", () => {
    const items: PreorderItem[] = [
      {
        productId: 1,
        name: "셔츠",
        price: 20000,
        thumbnailUrl: "",
        quantity: 1,
      },
    ];
    expect(calculateBogoDiscount(items)).toBe(0);
  });

  it("수량이 2개 이상인 상품이 1개일 경우, 해당 상품의 단가를 할인액으로 반환", () => {
    const items: PreorderItem[] = [
      {
        productId: 1,
        name: "셔츠",
        price: 20000,
        thumbnailUrl: "",
        quantity: 2,
      },
    ];
    expect(calculateBogoDiscount(items)).toBe(20000);
  });

  it("수량이 2개 이상인 상품이 여러 개일 경우, 단가가 가장 높은 상품의 단가를 반환", () => {
    const items: PreorderItem[] = [
      {
        productId: 1,
        name: "싼거",
        price: 15000,
        thumbnailUrl: "",
        quantity: 3,
      },
      {
        productId: 2,
        name: "비싼거",
        price: 80000,
        thumbnailUrl: "",
        quantity: 2,
      },
    ];

    expect(calculateBogoDiscount(items)).toBe(80000);
  });
});

describe('배송비 계산: calculateBaseShippingFee', () => {
  it('주문 금액이 0원이면 배송비는 0원', () => {
    expect(calculateBaseShippingFee(0, false)).toBe(0);
  });

  it('주문 금액이 무료배송기준 미만, 일반 지역일 경우 기본 배송비', () => {
    const amount = DELIVERY_RULES.FREE_DELIVERY_LIMIT - 1;
    expect(calculateBaseShippingFee(amount, false)).toBe(3000);
  });

  it('주문 금액이 무료배송기준 이상이면 지역에 상관없이 배송비가 0원', () => {
    const amount = DELIVERY_RULES.FREE_DELIVERY_LIMIT;
    expect(calculateBaseShippingFee(amount, false)).toBe(0);
    expect(calculateBaseShippingFee(amount, true)).toBe(0);
  });

  it('주문 금액이 무료배송기준 미만이고, 도서산간 지역일 경우 기본 배송비에 도서산간추가금이 붙어 6000원', () => {
    const amount = DELIVERY_RULES.FREE_DELIVERY_LIMIT - 1;
    expect(calculateBaseShippingFee(amount, true)).toBe(6000);
  });
});
