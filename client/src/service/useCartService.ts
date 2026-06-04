import { useCallback, useEffect, useState } from "react";
import type { CartApiInterface } from "../infrastructure/api/CartApiInterface";
import type { CartItem } from "../domain/Types";

export const useCartService = (api: CartApiInterface) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const getCartItems = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await api.getCartItems();
      setCartItems(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "장바구니를 불러오는 데 실패했습니다.");
    } finally {
      setIsLoading(false);
    }
  }, [api]);

  useEffect(() => {
    getCartItems();
  }, [getCartItems()]);

  return {
    cartItems,
    isLoading,
    error,
  };
};
