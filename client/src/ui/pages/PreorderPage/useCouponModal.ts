import { useState } from "react";

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
    if (tempSelectedCouponIds.includes(couponId)) {
      setTempSelectedCouponIds((prev) => prev.filter((id) => id !== couponId));
      return;
    }

    if (tempSelectedCouponIds.length >= 2) {
      alert("쿠폰은 최대 2개까지 사용할 수 있습니다.");
      return;
    }

    setTempSelectedCouponIds((prev) => [...prev, couponId]);
  };

  return {
    isModalOpen,
    setIsModalOpen,
    tempSelectedCouponIds,
    openModal,
    toggleTempCoupon,
  };
};
