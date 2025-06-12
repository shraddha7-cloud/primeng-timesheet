export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  quantity: number;
  status: 'INSTOCK' | 'LOWSTOCK' | 'OUTOFSTOCK';
  rating: number;
}
