import { useState } from 'react';

export const useCouponModal = (selectedCouponIds: number[]) => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [tempSelectedCouponIds, setTempSelectedCouponIds] = useState<number[]>(
    [],
  );

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

  return {
    isModalOpen,
    setIsModalOpen,
    tempSelectedCouponIds,
    openModal,
    toggleTempCoupon,
  };
};
