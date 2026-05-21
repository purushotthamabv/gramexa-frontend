import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { BackendProduct } from '../model/backend-product.interface';
import { Product } from '../model/product.interface';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private apiUrl = `${environment.apiUrl}/products`;

  constructor(private http: HttpClient) {

  }

  getProducts(): Observable<Product[]> {
    return this.http
      .get<BackendProduct[]>(`${this.apiUrl}/all-products`)
      .pipe(
        map((products) =>
          products
            .filter((product) => product.productStatus === 'ACTIVE')
            .map((product) => this.mapBackendProduct(product))
        )
      );
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
