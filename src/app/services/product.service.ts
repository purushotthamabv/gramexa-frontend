import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { BackendProduct } from '../model/backend-product.interface';
import { BackendRestaurantMenu } from '../model/backend-restaurant-menu.interface';
import { Product } from '../model/product.interface';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private apiUrl = `${environment.apiUrl}/products`;
  private restaurantApiUrl = `${environment.apiUrl}/restaurants`;

  constructor(private http: HttpClient) {

  }

  getProducts(): Observable<Product[]> {
    return this.http
      .get<BackendRestaurantMenu[]>(this.restaurantApiUrl)
      .pipe(
        map((restaurants) => restaurants.flatMap((restaurant) => restaurant.products ?? []).map((product) => this.mapRestaurantItem(product)))
      );
  }

  getRestaurants(): Observable<BackendRestaurantMenu[]> {
    return this.http.get<BackendRestaurantMenu[]>(this.restaurantApiUrl);
  }

  getRestaurantMenu(restaurantId: string): Observable<BackendRestaurantMenu> {
    return this.http.get<BackendRestaurantMenu>(`${this.restaurantApiUrl}/${encodeURIComponent(restaurantId)}/menu`);
  }

  mapRestaurantItem(product: { id: number; name: string; category: string; price: number; imageUrl: string; isAvailable: boolean; offerPrice?: number; discountPercentage?: number }): Product {
    return {
      id: product.id,
      name: product.name,
      category: product.category,
      description: product.isAvailable ? 'Freshly prepared from the restaurant kitchen.' : 'Currently unavailable.',
      image: this.getOptimizedImageUrl(
        product.imageUrl || 'https://images.unsplash.com/photo-1542838132-92c53300491e'
      ),
      price: product.offerPrice ?? product.price,
      oldPrice: product.price,
      offerPrice: product.offerPrice,
      discountPercentage: product.discountPercentage,
      badge: product.isAvailable ? 'AVAILABLE' : 'SOLD OUT',
      stock: product.isAvailable ? 12 : 0
    };
  }

  mapBackendProduct(product: BackendProduct): Product {
    return {
      id: product.id,
      name: product.productName,
      category: product.productCategory,
      description: product.productDescription,
      image: this.getOptimizedImageUrl(
        product.productImageUrl || 'https://images.unsplash.com/photo-1542838132-92c53300491e'
      ),
      price: product.offerPrice || product.productPrice,
      oldPrice: product.productPrice,
      badge: product.featured ? 'FEATURED' : undefined,
      stock: product.stockQuantity
    };
  }

  private getOptimizedImageUrl(imageUrl: string): string {
    if (!imageUrl.includes('images.unsplash.com')) {
      return imageUrl;
    }

    const separator = imageUrl.includes('?') ? '&' : '?';

    return `${imageUrl}${separator}auto=format&fit=crop&w=520&q=75`;
  }
}
