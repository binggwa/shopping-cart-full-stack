import { useEffect, useState } from 'react';
import type { OrderResponse } from '@cart/shared';
import { fetchOrderApi } from '../../../infrastructure/api/fetchOrderApi';

export const useOrderConfirm = (orderId: string | undefined) => {
  const [order, setOrder] = useState<OrderResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!orderId || isNaN(Number(orderId))) {
      setError('잘못된 접근입니다.');
      setIsLoading(false);
      return;
    }

    const loadOrderData = async () => {
      try {
        const fetchedOrder = await fetchOrderApi.getOrder(Number(orderId));
        setOrder(fetchedOrder);
      } catch (error) {
        const errorMessage =
          error instanceof Error
            ? error.message
            : '주문 내역을 불러오는데 실패했습니다.';
        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };

    loadOrderData();
  }, [orderId]);

  return { order, isLoading, error };
};
