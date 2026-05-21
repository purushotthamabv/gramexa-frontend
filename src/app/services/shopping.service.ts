import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, forkJoin, Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { BackendProduct } from '../model/backend-product.interface';

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

@Injectable({
  providedIn: 'root'
})
export class ShoppingService {

  private apiUrl = environment.apiUrl;

  private cartCountSubject = new BehaviorSubject<number>(0);
  private wishlistCountSubject = new BehaviorSubject<number>(0);

  cartCount$ = this.cartCountSubject.asObservable();
  wishlistCount$ = this.wishlistCountSubject.asObservable();

  constructor(private http: HttpClient) {

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

  resetCounts(): void {
    this.cartCountSubject.next(0);
    this.wishlistCountSubject.next(0);
  }
}
