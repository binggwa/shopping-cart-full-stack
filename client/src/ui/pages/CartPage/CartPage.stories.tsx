import { MemoryRouter } from 'react-router-dom';
import { http, HttpResponse, delay } from 'msw';
import { CartPage } from './CartPage';
import coffeeImage from '../../../assets/coffee.png';

export default {
  title: 'Pages/CartPage',
  component: CartPage,
  parameters: {
    layout: 'fullscreen',
    backgrounds: {
      default: 'light',
      values: [{ name: 'light', value: '#E5E5E5' }],
    },
  },
  decorators: [
    (Story: React.FC) => (
      <MemoryRouter>
        <Story />
      </MemoryRouter>
    ),
  ],
};

export const Success = {
  parameters: {
    msw: {
      handlers: [
        http.get('http://localhost:3000/cart', () => {
          return HttpResponse.json([
            {
              cartItemId: 1,
              quantity: 2,
              product: {
                productId: 101,
                name: '아메리카노',
                price: 4500,
                thumbnailUrl: coffeeImage,
              },
            },
            {
              cartItemId: 2,
              quantity: 1,
              product: {
                productId: 102,
                name: '바닐라 라떼',
                price: 5500,
                thumbnailUrl: coffeeImage,
              },
            },
          ]);
        }),
      ],
    },
  },
};

export const Empty = {
  parameters: {
    msw: {
      handlers: [
        http.get('http://localhost:3000/cart', () => {
          return HttpResponse.json([]);
        }),
      ],
    },
  },
};

export const Loading = {
  parameters: {
    msw: {
      handlers: [
        http.get('http://localhost:3000/cart', async () => {
          await delay('infinite');
          return HttpResponse.json([]);
        }),
      ],
    },
  },
};

export const Error = {
  parameters: {
    msw: {
      handlers: [
        http.get('http://localhost:3000/cart', () => {
          return new HttpResponse(null, {
            status: 500,
            statusText: 'Internal Server Error',
          });
        }),
      ],
    },
  },
};
