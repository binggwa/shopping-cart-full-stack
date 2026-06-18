import { CalculatedPrice, GiftItem } from "@cart/shared";

export interface OrderItemSnapshot {
  productId: number;
  name: string;
  price: number;
  quantity: number;
}

export interface Order {
  orderId: number;
  items: OrderItemSnapshot[];
  priceSummary: CalculatedPrice;
  giftItems: GiftItem[];
}
