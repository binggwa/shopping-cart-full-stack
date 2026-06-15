import { DELIVERY_RULES, PreorderItem } from "./types";

export const calculateOrderAmount = (items: PreorderItem[]): number => {
  return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
};

export const calculateBogoDiscount = (items: PreorderItem[]): number => {
  const bogoTargets = items.filter((item) => item.quantity >= 2);
  if (bogoTargets.length === 0) return 0;

  const expensiveItem = bogoTargets.reduce(
    (max, item) => (item.price > max.price ? item : max),
    bogoTargets[0],
  );

  return expensiveItem.price;
};

export const calculateBaseShippingFee = (
  orderAmount: number,
  isRemoteArea: boolean,
): number => {
  if (orderAmount === 0 || orderAmount >= DELIVERY_RULES.FREE_DELIVERY_LIMIT) {
    return 0;
  }

  return isRemoteArea
    ? DELIVERY_RULES.BASE_DELIVERY_FEE + DELIVERY_RULES.JEJU_EXTRA_FEE
    : DELIVERY_RULES.BASE_DELIVERY_FEE;
};
