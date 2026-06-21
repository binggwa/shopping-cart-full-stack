// frontend/src/ui/pages/PreorderPage/usePreorder.ts
import { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { generateOrderReceipt } from '@cart/shared';
import type { PreorderResponse, Coupon } from '@cart/shared';
import { fetchPreorderApi } from '../../../infrastructure/api/fetchPreorderApi';
import { fetchCouponApi } from '../../../infrastructure/api/fetchCouponApi';
import { fetchOrderApi } from '../../../infrastructure/api/fetchOrderApi';
import { findBestCouponCombination } from '../../../domain/couponOptimizer';

interface ApiError {
  status: number;
  message: string;
}

const isApiError = (err: unknown): err is ApiError => {
  return (
    typeof err === 'object' &&
    err !== null &&
    'status' in err &&
    'message' in err
  );
};

export const usePreorder = (preorderId: string | undefined) => {
  const navigate = useNavigate();

  const [preorder, setPreorder] = useState<PreorderResponse | null>(null);
  const [coupons, setCoupons] = useState<Coupon[]>([]);

  const [selectedCouponIds, setSelectedCouponIds] = useState<number[]>([]);
  const [isRemoteArea, setIsRemoteArea] = useState<boolean>(false);

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [tempSelectedCouponIds, setTempSelectedCouponIds] = useState<number[]>(
    [],
  );

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  useEffect(() => {
    if (!preorderId) return;

    const loadData = async () => {
      try {
        const [preorderData, couponsData] = await Promise.all([
          fetchPreorderApi.getPreorder(preorderId),
          fetchCouponApi.getCoupons(),
        ]);

        setPreorder(preorderData);
        setCoupons(couponsData);

        const bestCombo = findBestCouponCombination(
          preorderData.items,
          couponsData,
          false,
        );
        setSelectedCouponIds(bestCombo.map((c) => c.couponId));
      } catch {
        alert('데이터를 불러오지 못했습니다. 장바구니로 돌아갑니다.');
        navigate('/cart', { replace: true });
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, [preorderId, navigate]);

  const currentReceipt = useMemo(() => {
    if (!preorder) return null;
    const activeCoupons = coupons.filter((c) =>
      selectedCouponIds.includes(c.couponId),
    );
    return generateOrderReceipt(
      preorder.items,
      activeCoupons,
      isRemoteArea,
      new Date(),
    );
  }, [preorder, coupons, selectedCouponIds, isRemoteArea]);

  const tempReceipt = useMemo(() => {
    if (!preorder) return null;
    const activeCoupons = coupons.filter((c) =>
      tempSelectedCouponIds.includes(c.couponId),
    );
    return generateOrderReceipt(
      preorder.items,
      activeCoupons,
      isRemoteArea,
      new Date(),
    );
  }, [preorder, coupons, tempSelectedCouponIds, isRemoteArea]);

  const handlePayment = async () => {
    if (!preorder || !currentReceipt) return;

    setIsSubmitting(true);
    try {
      const order = await fetchOrderApi.submitOrder(
        preorder.preorderId,
        selectedCouponIds,
        isRemoteArea,
        currentReceipt.priceSummary,
      );
      alert('결제가 성공적으로 완료되었습니다!');
      navigate(`/orders/${order.orderId}`, { replace: true });
    } catch (err: unknown) {
      if (isApiError(err)) {
        if (err.status === 409 || err.status === 404) {
          alert(`${err.message}\n장바구니로 돌아가 최신 상태를 갱신합니다.`);
          navigate('/cart', { replace: true });
          return;
        }
      }
      alert('결제 중 오류가 발생했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const openModal = () => {
    setTempSelectedCouponIds(selectedCouponIds);
    setIsModalOpen(true);
  };

  const toggleTempCoupon = (couponId: number) => {
    setTempSelectedCouponIds((prev) => {
      if (prev.includes(couponId)) return prev.filter((id) => id !== couponId);
      if (prev.length >= 2) return prev;
      return [...prev, couponId];
    });
  };

  const applyCoupons = () => {
    setSelectedCouponIds(tempSelectedCouponIds);
    setIsModalOpen(false);
  };

  return {
    preorder,
    coupons,
    isRemoteArea,
    setIsRemoteArea,
    isModalOpen,
    setIsModalOpen,
    tempSelectedCouponIds,
    isLoading,
    isSubmitting,
    currentReceipt,
    tempReceipt,
    handlePayment,
    openModal,
    toggleTempCoupon,
    applyCoupons,
  };
};
