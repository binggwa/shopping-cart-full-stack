import { PreorderItem, Coupon } from "./types";
import { calculateOrderAmount } from "./calculator";

export const validateCoupon = (
  items: PreorderItem[],
  coupon: Coupon,
  currentTime: Date,
): boolean => {
  if (items.length === 0) return false;

  const orderAmount = calculateOrderAmount(items);
  const { minOrderLimit, minBogoQuantity, validTime } = coupon.condition;

  if (minOrderLimit !== undefined && orderAmount < minOrderLimit) {
    return false;
  }

  if (minBogoQuantity !== undefined) {
    const hasBogoTarget = items.some(
      (item) => item.quantity >= minBogoQuantity,
    );
    if (!hasBogoTarget) return false;
  }

  if (validTime !== undefined) {
    const currentHour = currentTime.getHours();
    if (currentHour < validTime.startHour || currentHour >= validTime.endHour) {
      return false;
    }
  }

  return true;
};
