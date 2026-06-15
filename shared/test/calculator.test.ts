import { calculateOrderAmount } from "../calculator";
import { PreorderItem } from "../types";
import { describe, it, expect } from 'vitest';

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
