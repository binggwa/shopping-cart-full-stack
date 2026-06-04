import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { OrderConfirmPage } from './OrderConfirmPage';

export default {
  title: 'Pages/OrderConfirmPage',
  component: OrderConfirmPage,
  parameters: {
    layout: 'fullscreen',
    backgrounds: {
      default: 'light',
      values: [{ name: 'light', value: '#E5E5E5' }],
    },
  },
};

export const Normal = () => {
  const mockState = {
    selectedIds: [101, 102, 103],
    totalSelectedQuantity: 5,
    totalPrice: 120000,
  };

  return (
    <MemoryRouter
      initialEntries={[{ pathname: '/order-confirm', state: mockState }]}
    >
      <Routes>
        <Route path="/order-confirm" element={<OrderConfirmPage />} />
      </Routes>
    </MemoryRouter>
  );
};

const MockCartPage = () => {
  return <h2>장바구니 페이지</h2>;
};

export const InvalidAccess = () => {
  return (
    <MemoryRouter initialEntries={['/order-confirm']}>
      <Routes>
        <Route path="/order-confirm" element={<OrderConfirmPage />} />
        <Route path="/cart" element={<MockCartPage />} />
      </Routes>
    </MemoryRouter>
  );
};
