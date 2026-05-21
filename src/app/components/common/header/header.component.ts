import { CommonModule } from '@angular/common';
import { Component, DestroyRef, HostListener, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { isPlatformBrowser } from '@angular/common';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { filter } from 'rxjs';
import { AuthService } from '../../../services/auth.service';
import { ShoppingService } from '../../../services/shopping.service';

interface HeaderUser {
  name?: string;
  mobileNumber?: string;
  role?: string;
}

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit {

  cartCount$ = this.shoppingService.cartCount$;
  wishlistCount$ = this.shoppingService.wishlistCount$;
  user: HeaderUser | null = null;
  isAccountMenuOpen = false;

  constructor(
    private authService: AuthService,
    private shoppingService: ShoppingService,
    private router: Router,
    private destroyRef: DestroyRef,
    @Inject(PLATFORM_ID) private platformId: object
  ) {

  }

  ngOnInit() {
    this.refreshHeaderState();

    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(() => this.refreshHeaderState());
  }

  @HostListener('document:click')
  closeAccountMenu() {
    this.isAccountMenuOpen = false;
  }

  isLoggedIn() {
    return this.authService.isLoggedIn();
  }

  logout() {
    this.authService.logout();
    this.shoppingService.resetCounts();
    this.user = null;
    this.isAccountMenuOpen = false;
    this.router.navigate(['/home']);
  }

  toggleAccountMenu(event: Event) {
    event.stopPropagation();
    this.isAccountMenuOpen = !this.isAccountMenuOpen;
  }

  private refreshHeaderState() {
    this.user = this.getStoredUser();
    this.refreshCounts();
  }

  private refreshCounts() {
    if (this.authService.isLoggedIn()) {
      this.shoppingService.loadCounts();
      return;
    }

    this.shoppingService.resetCounts();
  }

  private getStoredUser(): HeaderUser | null {
    if (!isPlatformBrowser(this.platformId)) {
      return null;
    }

    const user = localStorage.getItem('user');

    if (!user) {
      return null;
    }

    try {
      return JSON.parse(user);
    } catch {
      return null;
    }
  }
}
