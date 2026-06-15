import { PreorderItem } from "./types";

export const calculateOrderAmount = (items: PreorderItem[]): number => {
  return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
};
