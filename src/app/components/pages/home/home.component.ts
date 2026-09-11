import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Inject, PLATFORM_ID } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BackendRestaurantMenu } from '../../../model/backend-restaurant-menu.interface';
import { ProductService } from '../../../services/product.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit, OnDestroy {
  restaurants: BackendRestaurantMenu[] = [];
  filteredRestaurants: BackendRestaurantMenu[] = [];
  searchTerm = '';
  activeSlide = 0;
  private sliderTimer?: ReturnType<typeof setInterval>;
  readonly fallbackImages = ['https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1800&q=85', 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=1800&q=85', 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=1800&q=85'];

  constructor(
    private productService: ProductService,
    private router: Router,
    private route: ActivatedRoute,
    @Inject(PLATFORM_ID) private platformId: object
  ) {

  }

  ngOnInit() {
    this.route.queryParamMap.subscribe((params) => {
      this.searchTerm = params.get('search') || '';
      this.searchRestaurants();
    });
    // Do not make backend calls while Angular SSR is rendering the page.
    // The browser performs this request after hydration.
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    this.productService.getRestaurants().subscribe({
      next: (restaurants) => {
        this.restaurants = restaurants;
        this.filteredRestaurants = restaurants;
        this.sliderTimer = setInterval(() => this.nextSlide(), 5000);
      },
      error: (error) => {
        console.log(error);
      }
    });
  }

  searchRestaurants() {
    const term = this.searchTerm.trim().toLowerCase();
    this.filteredRestaurants = term
      ? this.restaurants.filter((restaurant) => restaurant.restaurantName.toLowerCase().includes(term))
      : this.restaurants;
  }

  ngOnDestroy() { if (this.sliderTimer) clearInterval(this.sliderTimer); }
  nextSlide() { if (this.restaurants.length) this.activeSlide = (this.activeSlide + 1) % this.restaurants.length; }
  previousSlide() { if (this.restaurants.length) this.activeSlide = (this.activeSlide - 1 + this.restaurants.length) % this.restaurants.length; }
  slideImage(index: number) { return this.restaurants[index]?.imageUrl || this.fallbackImages[index % this.fallbackImages.length]; }

  bannerDescription(restaurant: BackendRestaurantMenu) {
    const categories = [...new Set((restaurant.products || []).map((product) => product.category).filter(Boolean))];
    return categories.length
      ? `${restaurant.restaurantName} brings together ${categories.slice(0, 3).join(', ')} favourites, freshly prepared for every craving.`
      : `Discover delicious dishes and fresh favourites from ${restaurant.restaurantName}, prepared with care for your table.`;
  }

  bannerEyebrow(restaurant: BackendRestaurantMenu) {
    const categories = [...new Set((restaurant.products || []).map((product) => product.category).filter(Boolean))];
    return categories.length ? `${categories[0]} favourites at ${restaurant.restaurantName}` : `A taste of ${restaurant.restaurantName}`;
  }

  openRestaurant(restaurantId: string) {
    const restaurant = this.restaurants.find((item) => item.restaurantId === restaurantId);
    const slug = restaurant?.restaurantName
      .trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    this.router.navigate(['/menu', slug || restaurantId], { queryParams: { search: null } });
  }
}
