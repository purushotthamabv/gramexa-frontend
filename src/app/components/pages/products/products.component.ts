import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnInit
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Product } from '../../../model/product.interface';
import { AuthService } from '../../../services/auth.service';
import { ProductService } from '../../../services/product.service';
import { ShoppingService } from '../../../services/shopping.service';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductsComponent implements OnInit {

  @Input()
  title = '';

  @Input()
  subTitle = '';

  @Input()
  products: Product[] = [];
  isLoading = false;
  errorMessage = '';
  actionMessage = '';
  actionError = '';
  addingCartProductIds = new Set<number>();
  updatingWishlistProductIds = new Set<number>();
  wishlistProductIds = new Set<number>();

  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private productService: ProductService,
    private shoppingService: ShoppingService,
    private cdr: ChangeDetectorRef
  ) {

  }

  ngOnInit() {
    if (this.route.snapshot.routeConfig?.path !== 'products') {
      return;
    }

    this.loadProducts();
    this.loadWishlistProducts();
  }

  loadProducts() {
    this.isLoading = true;
    this.errorMessage = '';

    this.productService.getProducts().subscribe({
      next: (products) => {
        this.products = products;
        this.isLoading = false;
        this.cdr.markForCheck();
      },
      error: (error) => {
        console.log(error);
        this.errorMessage = 'Unable to load products';
        this.isLoading = false;
        this.cdr.markForCheck();
      }
    });
  }

  loadWishlistProducts() {
    if (!this.authService.isLoggedIn()) {
      return;
    }

    this.shoppingService.getWishlist().subscribe({
      next: (items) => {
        this.wishlistProductIds = new Set(
          items.map((item) => item.product.id)
        );
        this.cdr.markForCheck();
      }
    });
  }

  trackByProductId(
    _index: number,
    product: Product
  ) {
    return product.id;
  }

  openProducts() {
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/products']);
      return;
    }

    this.router.navigate(
      ['/login'],
      {
        queryParams: {
          returnUrl: '/products'
        }
      }
    );
  }

  addToCart(
    product: Product,
    event: Event
  ) {
    event.stopPropagation();

    if (!this.authService.isLoggedIn()) {
      this.redirectToLogin();
      return;
    }

    this.actionMessage = '';
    this.actionError = '';
    this.addingCartProductIds.add(product.id);

    this.shoppingService.addToCart(product.id).subscribe({
      next: () => {
        this.addingCartProductIds.delete(product.id);
        this.actionMessage = `${product.name} added to cart`;
        this.cdr.markForCheck();
      },
      error: () => {
        this.addingCartProductIds.delete(product.id);
        this.actionError = 'Unable to add product to cart';
        this.cdr.markForCheck();
      }
    });
  }

  toggleWishlist(
    product: Product,
    event: Event
  ) {
    event.stopPropagation();

    if (!this.authService.isLoggedIn()) {
      this.redirectToLogin();
      return;
    }

    this.actionMessage = '';
    this.actionError = '';
    this.updatingWishlistProductIds.add(product.id);

    this.shoppingService.toggleWishlist(product.id).subscribe({
      next: (isWishlisted) => {
        this.updatingWishlistProductIds.delete(product.id);

        if (isWishlisted) {
          this.wishlistProductIds.add(product.id);
          this.actionMessage = `${product.name} added to wishlist`;
        } else {
          this.wishlistProductIds.delete(product.id);
          this.actionMessage = `${product.name} removed from wishlist`;
        }

        this.cdr.markForCheck();
      },
      error: () => {
        this.updatingWishlistProductIds.delete(product.id);
        this.actionError = 'Unable to update wishlist';
        this.cdr.markForCheck();
      }
    });
  }

  isAddingToCart(productId: number) {
    return this.addingCartProductIds.has(productId);
  }

  isUpdatingWishlist(productId: number) {
    return this.updatingWishlistProductIds.has(productId);
  }

  isWishlisted(productId: number) {
    return this.wishlistProductIds.has(productId);
  }

  private redirectToLogin() {
    this.router.navigate(
      ['/login'],
      {
        queryParams: {
          returnUrl: '/products'
        }
      }
    );
  }
}
