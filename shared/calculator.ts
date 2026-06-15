import { PreorderItem } from "./types";

export const calculateOrderAmount = (items: PreorderItem[]): number => {
  return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
};

export const calculateBogoDiscount = (items: PreorderItem[]): number => {
  const bogoTargets = items.filter(item => item.quantity >= 2);
  if (bogoTargets.length === 0) return 0;

  const expensiveItem = bogoTargets.reduce((max, item) => 
    item.price > max.price ? item : max
  , bogoTargets[0]);

  return expensiveItem.price;
};
