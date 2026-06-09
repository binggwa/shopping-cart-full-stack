import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { Global } from '@emotion/react';
import { CartPage } from './ui/pages/CartPage/CartPage';
import { OrderConfirmPage } from './ui/pages/OrderConfirmPage/OrderConfirmPage';
import { resetStyles } from './styles/resetStyles';

export const App = () => {
  return (
    <BrowserRouter>
      <Global styles={resetStyles} />
      <Routes>
        <Route path="/" element={<Navigate to="/cart" replace />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/order-confirm" element={<OrderConfirmPage />} />
        <Route path="*" element={<Navigate to="/cart" replace />} />
      </Routes>
    </BrowserRouter>
  );
};
