import type { CalculatedPrice, OrderResponse } from "@cart/shared";
import type { OrderApiInterface } from "../interfaces/OrderApiInterface";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

export const fetchOrderApi: OrderApiInterface = {
  submitOrder: async (
    preorderId: string,
    couponIds: number[],
    isRemoteArea: boolean,
    expectedPriceSummary: CalculatedPrice,
  ): Promise<OrderResponse> => {
    const response = await fetch(`${BASE_URL}/orders`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        preorderId,
        couponIds,
        isRemoteArea,
        expectedPriceSummary,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw {
        status: response.status,
        message: errorData.message || "결제에 실패했습니다.",
      };
    }

    return response.json();
  },
};
