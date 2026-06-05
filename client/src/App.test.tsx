import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi, describe, it, expect, afterEach } from 'vitest';
import { App } from "./App";

const mockAlert = vi.fn();
window.alert = mockAlert;

describe("라우팅 및 주문 확인 페이지 통합 테스트", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it("주문 확인 버튼을 누르면 정확한 데이터와 함께 order-confirm 페이지로 넘어간다.", async () => {
    const user = userEvent.setup();
    window.history.pushState({}, 'Cart Page', '/cart');

    render(<App />);

    await screen.findByText("아메리카노");

    const orderButton = screen.getByRole("button", { name: "주문 확인" });
    await user.click(orderButton);

    await waitFor(() => {
      expect(screen.getByText("주문 확인")).toBeInTheDocument();
      expect(
        screen.getByText(/총 2종류의 상품 3개를 주문합니다/),
      ).toBeInTheDocument();
      expect(screen.getByText("17,500원")).toBeInTheDocument();
    });
  });

  it("비정상적인 방법으로 /order-confirm 접근 시 장바구니로 리다이렉트", async () => {
    window.history.pushState({}, 'Order Confirm Page', '/order-confirm');
    
    render(<App />);

    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith(
        "주문 정보가 존재하지 않습니다. 장바구니로 돌아갑니다.",
      );
    });

    expect(await screen.findByText("장바구니")).toBeInTheDocument();
  });
});
