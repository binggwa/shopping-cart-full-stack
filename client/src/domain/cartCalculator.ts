import { CART_RULES } from "./constants";
import type { CartItem } from "./Types";

export const calculateTotalQuantity = (items: CartItem[]): number => {
  return items.reduce((sum, item) => sum + item.quantity, 0);
};

export const calculateTotalProductPrice = (items: CartItem[]): number => {
  return items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0,
  );
};

export const calculateDeliveryPrice = (totalProductPrice: number): number => {
  if (totalProductPrice === 0) return 0;
  if (totalProductPrice >= CART_RULES.FREE_DELIVERY_LIMIT) return 0;
  return CART_RULES.DELIVERY_PRICE;
};

export const calculateTotalPrice = (
  productPrice: number,
  deliveryPrice: number,
): number => {
  return productPrice + deliveryPrice;
};
