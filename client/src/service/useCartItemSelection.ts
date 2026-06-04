import { useEffect, useState } from "react";
import type { CartItem } from "../domain/Types";

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

  return {
    selectedIds,
    toggleSelection,
    toggleAll,
  };
};
