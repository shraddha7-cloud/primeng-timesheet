import { Injectable } from '@angular/core';
import { Product } from '../model/product.model';

import { of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  constructor() {}

  // Mimic API call with sample data
  getProductsWithOrdersSmall(): Promise<Product[]> {
    const sampleProducts: Product[] = [
      {
        id: '1000',
        name: 'Samsung Galaxy S21',
        description: 'Smartphone from Samsung',
        price: 699,
        quantity: 50,
        status: 'INSTOCK',
        rating: 4
      },
      {
        id: '1001',
        name: 'Apple MacBook Air',
        description: 'Lightweight laptop from Apple',
        price: 1199,
        quantity: 20,
        status: 'LOWSTOCK',
        rating: 5
      },
      {
        id: '1002',
        name: 'Sony WH-1000XM5',
        description: 'Noise Cancelling Headphones',
        price: 299,
        quantity: 0,
        status: 'OUTOFSTOCK',
        rating: 4
      }
    ];

    return Promise.resolve(sampleProducts);
  }
}
