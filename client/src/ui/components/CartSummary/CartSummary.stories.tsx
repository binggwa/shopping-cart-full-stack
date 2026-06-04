import { CartSummary } from './CartSummary';

export default {
  title: 'Components/CartSummary',
  component: CartSummary,
};

export const Default = () => {
  return (
    <div style={{ width: '382px' }}>
      <CartSummary
        totalProductPrice={70000}
        deliveryPrice={3000}
        totalPrice={73000}
      />
    </div>
  );
};

export const FreeDelivery = () => {
  return (
    <div style={{ width: '382px' }}>
      <CartSummary
        totalProductPrice={120000}
        deliveryPrice={0}
        totalPrice={120000}
      />
    </div>
  );
};
