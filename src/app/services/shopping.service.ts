import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, forkJoin, Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { BackendProduct } from '../model/backend-product.interface';
import { AuthService } from './auth.service';

interface CountResponse {
  count: number;
}

export interface CartItemResponse {
  id: number;
  quantity: number;
  product: BackendProduct;
}

export interface WishlistItemResponse {
  id: number;
  product: BackendProduct;
}

export interface CheckoutRequest {
  deliveryName: string;
  deliveryMobile: string;
  deliveryAddress: string;
  deliveryPincode: string;
}

export interface OrderItemResponse {
  id: number;
  productId: number;
  productName: string;
  unitPrice: number;
  quantity: number;
  lineTotal: number;
}

export interface OrderResponse {
  id: number;
  totalAmount: number;
  status: string;
  paymentMode: string;
  deliveryName: string;
  deliveryMobile: string;
  deliveryAddress: string;
  deliveryPincode: string;
  createdAt: string;
  items: OrderItemResponse[];
}

@Injectable({
  providedIn: 'root'
})
export class ShoppingService {

  private apiUrl = environment.apiUrl;

  private cartCountSubject = new BehaviorSubject<number>(0);
  private wishlistCountSubject = new BehaviorSubject<number>(0);

  cartCount$ = this.cartCountSubject.asObservable();
  wishlistCount$ = this.wishlistCountSubject.asObservable();

  constructor(private http: HttpClient, authService: AuthService) {
    authService.authenticated$.subscribe((authenticated) => {
      if (!authenticated) this.resetCounts();
    });
  }

  resetForLogout(): void {
    this.resetCounts();
  }

  loadCounts(): void {
    forkJoin({
      cart: this.http.get<CountResponse>(`${this.apiUrl}/cart/count`),
      wishlist: this.http.get<CountResponse>(`${this.apiUrl}/wishlist/count`)
    }).subscribe({
      next: ({ cart, wishlist }) => {
        this.cartCountSubject.next(cart.count);
        this.wishlistCountSubject.next(wishlist.count);
      },
      error: () => {
        this.cartCountSubject.next(0);
        this.wishlistCountSubject.next(0);
      }
    });
  }

  addToCart(productId: number): Observable<unknown> {
    return this.http
      .post(`${this.apiUrl}/cart/add`, {
        productId,
        quantity: 1
      })
      .pipe(
        tap(() => this.loadCounts())
      );
  }

  getCart(): Observable<CartItemResponse[]> {
    return this.http.get<CartItemResponse[]>(`${this.apiUrl}/cart`);
  }

  getWishlist(): Observable<WishlistItemResponse[]> {
    return this.http.get<WishlistItemResponse[]>(`${this.apiUrl}/wishlist`);
  }

  removeFromCart(productId: number): Observable<void> {
    return this.http
      .delete<void>(`${this.apiUrl}/cart/remove/${productId}`)
      .pipe(
        tap(() => this.loadCounts())
      );
  }

  removeFromWishlist(productId: number): Observable<void> {
    return this.http
      .delete<void>(`${this.apiUrl}/wishlist/remove/${productId}`)
      .pipe(
        tap(() => this.loadCounts())
      );
  }

  toggleWishlist(productId: number): Observable<boolean> {
    return this.http
      .post<boolean>(`${this.apiUrl}/wishlist/toggle`, {
        productId
      })
      .pipe(
        tap(() => this.loadCounts())
      );
  }

  checkout(request: CheckoutRequest): Observable<OrderResponse> {
    return this.http
      .post<OrderResponse>(`${this.apiUrl}/orders/checkout`, request)
      .pipe(
        tap(() => this.loadCounts())
      );
  }

  getOrders(): Observable<OrderResponse[]> {
    return this.http.get<OrderResponse[]>(`${this.apiUrl}/orders`);
  }

  resetCounts(): void {
    this.cartCountSubject.next(0);
    this.wishlistCountSubject.next(0);
  }
}
