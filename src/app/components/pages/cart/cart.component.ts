import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Product } from '../../../model/product.interface';
import { ProductService } from '../../../services/product.service';
import { CartItemResponse, ShoppingService } from '../../../services/shopping.service';

interface CartViewItem {
  id: number;
  quantity: number;
  product: Product;
}

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cart.component.html'
})
export class CartComponent implements OnInit {

  items: CartViewItem[] = [];
  isLoading = false;
  errorMessage = '';

  constructor(
    private shoppingService: ShoppingService,
    private productService: ProductService
  ) {

  }

  ngOnInit() {
    this.loadCart();
  }

  loadCart() {
    this.isLoading = true;
    this.errorMessage = '';

    this.shoppingService.getCart().subscribe({
      next: (items) => {
        this.items = items.map((item: CartItemResponse) => ({
          id: item.id,
          quantity: item.quantity,
          product: this.productService.mapBackendProduct(item.product)
        }));
        this.isLoading = false;
      },
      error: () => {
        this.errorMessage = 'Unable to load cart';
        this.isLoading = false;
      }
    });
  }

  remove(productId: number) {
    this.shoppingService.removeFromCart(productId).subscribe({
      next: () => this.loadCart()
    });
  }
}
