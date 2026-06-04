import { useEffect, useState } from "react";
import type { CartItem } from "../domain/Types";

const FREE_DELIVERY_LIMIT = 100000;
const DELIVERY_PRICE = 3000;

export const useCartItemSelection = (cartItems: CartItem[]) => {
  const [selectedIds, setSelectedIds] = useState<number[]>(() => {
    const savedSelection = localStorage.getItem("cart_item_selection");
    return savedSelection ? JSON.parse(savedSelection) : [];
  });

  useEffect(() => {
    localStorage.setItem("cart_item_selection", JSON.stringify(selectedIds));
  }, [selectedIds]);

  useEffect(() => {
    if (cartItems.length > 0 && selectedIds.length === 0) {
      setSelectedIds(cartItems.map((item) => item.cartItemId));
    }
  }, [cartItems]);

  const toggleSelection = (id: number) => {
    setSelectedIds((prevSelectedIds) => {
      if (prevSelectedIds.includes(id)) {
        return prevSelectedIds.filter((prevId) => prevId !== id);
      } else {
        return [...prevSelectedIds, id];
      }
    });
  };

  const toggleAll = (isSelected: boolean) => {
    if (isSelected) {
      setSelectedIds(cartItems.map((item) => item.cartItemId));
    } else {
      setSelectedIds([]);
    }
  };

  const selectedItems = cartItems.filter((item) => selectedIds.includes(item.cartItemId));
  const isAllSelected = cartItems.length > 0 && selectedIds.length === cartItems.length;

  const totalProductPrice = selectedItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  const calculateDeliveryPrice = () => {
    if (totalProductPrice === 0) return 0;
    if (totalProductPrice >= FREE_DELIVERY_LIMIT) return 0;
    return DELIVERY_PRICE;
  }

  const deliveryPrice = calculateDeliveryPrice();

  const totalPrice = totalProductPrice + deliveryPrice;

  return {
    selectedIds,
    toggleSelection,
    toggleAll,
    isAllSelected,
    totalProductPrice,
    deliveryPrice,
    totalPrice,
  };
};
