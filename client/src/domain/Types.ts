export interface Product {
  productId: number;
  name: string;
  price: number;
  thumbnailUrl: string;
}

export interface CartItem {
  cartItemId: number;
  quantity: number;
  product: Product;
}
