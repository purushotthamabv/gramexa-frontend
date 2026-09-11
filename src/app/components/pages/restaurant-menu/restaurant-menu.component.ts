import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Product } from '../../../model/product.interface';
import { ProductService } from '../../../services/product.service';
import { ShoppingService } from '../../../services/shopping.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-restaurant-menu',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './restaurant-menu.component.html',
  styleUrls: ['./restaurant-menu.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RestaurantMenuComponent implements OnInit {
  restaurantName = 'Green Leaf Pure Veg';
  currency = 'INR';
  categories: string[] = [];
  selectedCategory = 'All';
  products: Product[] = [];
  filteredProducts: Product[] = [];
  isLoading = false;
  errorMessage = '';
  searchTerm = '';
  actionMessage = '';
  actionError = '';
  private addingProductId: number | null = null;
  private wishlistProductIds = new Set<number>();

  constructor(
    private productService: ProductService,
    private router: Router,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef,
    private shoppingService: ShoppingService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.route.queryParamMap.subscribe((params) => {
      this.searchTerm = params.get('search') || '';
      this.loadMenu();
    });
  }

  loadMenu() {
    this.isLoading = true;
    this.errorMessage = '';

    const restaurantId = this.route.snapshot.paramMap.get('restaurantId');
    if (!restaurantId) { this.errorMessage = 'Select a restaurant to view its menu'; this.isLoading = false; return; }
    this.productService.getRestaurantMenu(restaurantId).subscribe({
      next: (menu) => {
        this.restaurantName = menu.restaurantName;
        this.currency = menu.currency;
        this.products = menu.products.map((product) => this.productService.mapRestaurantItem(product));
        this.applyFilters();
        this.categories = ['All', ...new Set(this.products.map((product) => product.category))];
        this.isLoading = false;
        this.cdr.markForCheck();
      },
      error: () => {
        this.errorMessage = 'Unable to load restaurant menu';
        this.isLoading = false;
        this.cdr.markForCheck();
      }
    });
  }

  selectCategory(category: string) {
    this.selectedCategory = category;
    this.applyFilters();
    this.cdr.markForCheck();
  }

  searchProducts() {
    this.applyFilters();
    this.cdr.markForCheck();
  }

  addToCart(product: Product, event: Event) {
    event.stopPropagation();
    if (!this.shoppingServiceIsLoggedIn()) return;
    this.addingProductId = product.id;
    this.actionError = '';
    this.shoppingService.addToCart(product.id).subscribe({
      next: () => { this.actionMessage = `${product.name} added to cart`; this.addingProductId = null; this.cdr.markForCheck(); },
      error: () => { this.actionError = 'Please log in to add items to your cart.'; this.addingProductId = null; this.cdr.markForCheck(); }
    });
  }

  toggleWishlist(product: Product, event: Event) {
    event.stopPropagation();
    if (!this.shoppingServiceIsLoggedIn()) return;
    this.actionError = '';
    this.shoppingService.toggleWishlist(product.id).subscribe({
      next: (added) => {
        added ? this.wishlistProductIds.add(product.id) : this.wishlistProductIds.delete(product.id);
        this.actionMessage = added ? `${product.name} added to wishlist` : `${product.name} removed from wishlist`;
        this.cdr.markForCheck();
      },
      error: () => { this.actionError = 'Please log in to update your wishlist.'; this.cdr.markForCheck(); }
    });
  }

  isAddingToCart(productId: number) { return this.addingProductId === productId; }
  isWishlisted(productId: number) { return this.wishlistProductIds.has(productId); }

  private shoppingServiceIsLoggedIn() {
    if (this.authService.isLoggedIn()) return true;
    this.router.navigate(['/login'], { queryParams: { returnUrl: this.router.url } });
    return false;
  }

  private applyFilters() {
    const term = this.searchTerm.trim().toLowerCase();
    this.filteredProducts = this.products.filter((product) =>
      (this.selectedCategory === 'All' || product.category === this.selectedCategory) &&
      (!term || product.name.toLowerCase().includes(term) || product.description.toLowerCase().includes(term))
    );
  }

  trackByProductId(_index: number, product: Product) {
    return product.id;
  }

  openHome() {
    this.router.navigate(['/home']);
  }
}
