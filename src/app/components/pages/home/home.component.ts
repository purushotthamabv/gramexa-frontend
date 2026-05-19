import { Component } from '@angular/core';
import { Product } from '../../../model/product.interface';
import { ProductsComponent } from '../products/products.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [ProductsComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  editorProducts: Product[] = [

    {
      id: 1,
      name: 'Organic Apple Juice',
      category: 'ORGANIC',
      description: 'Healthy organic juice.',
      image: 'https://images.unsplash.com/photo-1607619056574-7b8d3ee536b2',
      price: 120,
      oldPrice: 180,
      badge: '25% OFF',
      stock: 23
    },

    {
      id: 2,
      name: 'Vitamin C Tablets',
      category: 'MEDICINE',
      description: 'Daily immunity support.',
      image: 'https://images.unsplash.com/photo-1622484212850-eb596d769edc',
      price: 249,
      oldPrice: 399,
      badge: 'HOT',
      stock: 12
    }
  ];

  healthProducts: Product[] = [
    {
      id: 3,
      name: 'Organic Vegetables',
      category: 'HEALTHY FOOD',
      description: 'Fresh vegetables.',
      image: 'https://images.unsplash.com/photo-1542838132-92c53300491e',
      price: 499,
      oldPrice: 699,
      badge: 'NEW',
      stock: 18
    }
  ];
}