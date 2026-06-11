import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { Product } from '../../../model/product.interface';
import { ProductService } from '../../../services/product.service';
import { CartItemResponse, OrderResponse, ShoppingService } from '../../../services/shopping.service';

interface CartViewItem {
  id: number;
  quantity: number;
  product: Product;
}

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './cart.component.html'
})
export class CartComponent implements OnInit {

  items: CartViewItem[] = [];
  checkoutForm!: FormGroup;
  isLoading = false;
  isPlacingOrder = false;
  errorMessage = '';
  successMessage = '';
  placedOrder: OrderResponse | null = null;

  constructor(
    private shoppingService: ShoppingService,
    private productService: ProductService,
    private fb: FormBuilder
  ) {
    this.createForm();
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

  get subtotal() {
    return this.items.reduce(
      (total, item) => total + (item.product.price * item.quantity),
      0
    );
  }

  placeOrder() {
    if (this.items.length === 0) {
      this.errorMessage = 'Add products to cart before checkout';
      return;
    }

    if (this.checkoutForm.invalid) {
      this.checkoutForm.markAllAsTouched();
      return;
    }

    this.isPlacingOrder = true;
    this.errorMessage = '';
    this.successMessage = '';
    this.placedOrder = null;

    this.shoppingService.checkout(this.checkoutForm.value).subscribe({
      next: (order) => {
        this.placedOrder = order;
        this.successMessage = `Order #${order.id} placed successfully`;
        this.items = [];
        this.checkoutForm.reset();
        this.isPlacingOrder = false;
      },
      error: (error) => {
        this.errorMessage =
          error?.error?.message ||
          'Unable to place order';
        this.isPlacingOrder = false;
      }
    });
  }

  private createForm() {
    this.checkoutForm = this.fb.group({
      deliveryName: [
        '',
        Validators.required
      ],
      deliveryMobile: [
        '',
        [
          Validators.required,
          Validators.pattern('^[6-9]\\d{9}$')
        ]
      ],
      deliveryAddress: [
        '',
        Validators.required
      ],
      deliveryPincode: [
        '',
        [
          Validators.required,
          Validators.pattern('^\\d{6}$')
        ]
      ]
    });
  }
}
