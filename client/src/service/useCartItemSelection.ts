import { useEffect, useState } from "react";
import type { CartItem } from "../domain/Types";

const FREE_DELIVERY_LIMIT = 100000;
const DELIVERY_PRICE = 3000;

export const useCartItemSelection = (cartItems: CartItem[]) => {
  const [selectedIds, setSelectedIds] = useState<number[] | null>(() => {
    const savedSelection = localStorage.getItem("cart_item_selection");
    return savedSelection ? JSON.parse(savedSelection) : null;
  });

  const actualSelectedIds = selectedIds === null ? cartItems.map((item) => item.cartItemId) : selectedIds;

  useEffect(() => {
    if (selectedIds !== null) {
      localStorage.setItem("cart_item_selection", JSON.stringify(selectedIds));
    }
  }, [selectedIds]);

  const toggleSelection = (id: number) => {
    setSelectedIds((prevSelectedIds) => {
      const base = prevSelectedIds === null ? actualSelectedIds : prevSelectedIds;
      return base.includes(id)
        ? base.filter((selectedId) => selectedId !== id)
        : [...base, id];
    });
  };

  const toggleAll = (isSelected: boolean) => {
    if (isSelected) {
      setSelectedIds(cartItems.map((item) => item.cartItemId));
    } else {
      setSelectedIds([]);
    }
  };

  const selectedItems = cartItems.filter((item) => actualSelectedIds.includes(item.cartItemId));
  const isAllSelected = cartItems.length > 0 && actualSelectedIds.length === cartItems.length;

  const totalProductPrice = selectedItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  const calculateDeliveryPrice = () => {
    if (totalProductPrice === 0) return 0;
    if (totalProductPrice >= FREE_DELIVERY_LIMIT) return 0;
    return DELIVERY_PRICE;
  }

  const deliveryPrice = calculateDeliveryPrice();

  const totalPrice = totalProductPrice + deliveryPrice;

  return {
    selectedIds: actualSelectedIds,
    toggleSelection,
    toggleAll,
    isAllSelected,
    totalProductPrice,
    deliveryPrice,
    totalPrice,
  };
};
