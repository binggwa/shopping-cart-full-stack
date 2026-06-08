import { useEffect, useState } from "react";
import type { CartItem } from "../domain/Types";
import { CART_RULES } from "../domain/constants";

export const useCartItemSelection = (cartItems: CartItem[]) => {
  const [selectedIds, setSelectedIds] = useState<number[] | null>(() => {
    const savedSelection = localStorage.getItem("cart_item_selection");
    if (!savedSelection) return null;
    
    try {
      const parsedSelection = JSON.parse(savedSelection);
      return Array.isArray(parsedSelection) ? parsedSelection : null;
    } catch (e) {
      localStorage.removeItem("cart_item_selection");
      return null;
    }
  });

  const actualSelectedIds = selectedIds === null ? cartItems.map((item) => item.cartItemId) : selectedIds;

  useEffect(() => {
    if (selectedIds !== null) {
      localStorage.setItem("cart_item_selection", JSON.stringify(selectedIds));
    }
  }, [selectedIds]);

  const toggleSelection = (id: number, isChecked: boolean) => {
    setSelectedIds((prevSelectedIds) => {
      const base = prevSelectedIds === null ? actualSelectedIds : prevSelectedIds;

      if (isChecked) {
        return base.includes(id) ? base : [...base, id];
      } else {
        return base.filter((selectedId) => selectedId !== id);
      }
    });
  };

  const deselectItem = (id: number) => {
    setSelectedIds((prevSelectedIds) => {
      if (prevSelectedIds === null) return actualSelectedIds.filter(selectedId => selectedId !== id);
      return prevSelectedIds.filter((selectedId) => selectedId !== id);
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

  const totalSelectedQuantity = selectedItems.reduce((sum, item) => sum + item.quantity, 0);
  const totalProductPrice = selectedItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  const deliveryPrice = (() => {
    if (totalProductPrice === 0) return 0;
    if (totalProductPrice >= CART_RULES.FREE_DELIVERY_LIMIT) return 0;
    return CART_RULES.DELIVERY_PRICE;
  })();

  const totalPrice = totalProductPrice + deliveryPrice;

  return {
    selectedIds: actualSelectedIds,
    toggleSelection,
    toggleAll,
    deselectItem,
    isAllSelected,
    totalSelectedQuantity,
    totalProductPrice,
    deliveryPrice,
    totalPrice,
  };
};
