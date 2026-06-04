import { http, HttpResponse } from "msw";
import type { CartItem } from "../domain/Types";

let mockCartItems: CartItem[] = [
  {
    cartItemId: 1,
    quantity: 2,
    product: {
      productId: 1,
      name: "아메리카노",
      price: 4500,
      thumbnailUrl: "",
    },
  },
  {
    cartItemId: 2,
    quantity: 1,
    product: {
      productId: 2,
      name: "바닐라 라떼",
      price: 5500,
      thumbnailUrl: "",
    },
  },
];

export const handlers = [
  http.get("http://localhost:3000/cart", () => {
    return HttpResponse.json(mockCartItems);
  }),

  http.patch(
    "http://localhost:3000/cart/:cartItemId",
    async ({ params, request }) => {
      const { cartItemId } = params;
      const body = (await request.json()) as { quantity: number };

      const targetIndex = mockCartItems.findIndex(
        (item) => item.cartItemId === Number(cartItemId),
      );
      if (targetIndex === -1) return new HttpResponse(null, { status: 404 });

      mockCartItems[targetIndex].quantity = body.quantity;
      return HttpResponse.json(mockCartItems[targetIndex]);
    },
  ),

  http.delete("http://localhost:3000/cart/:cartItemId", ({ params }) => {
    const { cartItemId } = params;
    mockCartItems = mockCartItems.filter(
      (item) => item.cartItemId !== Number(cartItemId),
    );

    return new HttpResponse(null, { status: 204 });
  }),
];
