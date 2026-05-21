import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Product } from '../../../model/product.interface';
import { ProductService } from '../../../services/product.service';
import { ShoppingService, WishlistItemResponse } from '../../../services/shopping.service';

interface WishlistViewItem {
  id: number;
  product: Product;
}

@Component({
  selector: 'app-wishlist',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './wishlist.component.html'
})
export class WishlistComponent implements OnInit {

  items: WishlistViewItem[] = [];
  isLoading = false;
  errorMessage = '';

  constructor(
    private shoppingService: ShoppingService,
    private productService: ProductService
  ) {

  }

  ngOnInit() {
    this.loadWishlist();
  }

  loadWishlist() {
    this.isLoading = true;
    this.errorMessage = '';

    this.shoppingService.getWishlist().subscribe({
      next: (items) => {
        this.items = items.map((item: WishlistItemResponse) => ({
          id: item.id,
          product: this.productService.mapBackendProduct(item.product)
        }));
        this.isLoading = false;
      },
      error: () => {
        this.errorMessage = 'Unable to load wishlist';
        this.isLoading = false;
      }
    });
  }

  addToCart(productId: number) {
    this.shoppingService.addToCart(productId).subscribe();
  }

  remove(productId: number) {
    this.shoppingService.removeFromWishlist(productId).subscribe({
      next: () => this.loadWishlist()
    });
  }
}
