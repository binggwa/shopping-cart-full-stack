import { useState } from 'react';
import coffeeImage from '../../../assets/coffee.png';
import { CartItem } from './CartItem';

export default {
  title: 'Components/CartItem',
  component: CartItem,
};

const mockItem = {
  cartItemId: 1,
  quantity: 2,
  product: {
    productId: 101,
    name: '상품이름A',
    price: 35000,
    thumbnailUrl: coffeeImage,
  },
};

export const Default = () => {
  const [selected, setSelected] = useState(true);
  const [quantity, setQuantity] = useState(mockItem.quantity);

  return (
    <CartItem
      item={{ ...mockItem, quantity }}
      isSelected={selected}
      onToggle={() => setSelected(!selected)}
      onQuantityChange={(_, newQty) => setQuantity(newQty)}
      onDelete={() => alert('삭제 버튼 클릭!')}
    />
  );
};
