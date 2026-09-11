import { Routes } from '@angular/router';
import { LoginComponent } from './components/auth/login/login.component';
import { RegisterComponent } from './components/auth/register/register.component';
import { ContactComponent } from './components/pages/contact/contact.component';
import { HomeComponent } from './components/pages/home/home.component';
import { ServicesComponent } from './components/pages/services/services.component';
import { authGuard } from './guards/auth.guard';
import { ProductsComponent } from './components/pages/products/products.component';
import { CartComponent } from './components/pages/cart/cart.component';
import { WishlistComponent } from './components/pages/wishlist/wishlist.component';
import { ProfileComponent } from './components/pages/profile/profile.component';
import { ChangePasswordComponent } from './components/pages/change-password/change-password.component';
import { RestaurantMenuComponent } from './components/pages/restaurant-menu/restaurant-menu.component';
import { AdminComponent } from './components/admin/admin.component';
import { adminGuard, superAdminGuard } from './guards/admin.guard';

export const routes: Routes = [
  { path: 'admin', component: AdminComponent, canActivate: [adminGuard] },
  { path: 'admin/restaurants', component: AdminComponent, canActivate: [adminGuard], data: { section: 'restaurants' } },
  { path: 'admin/restaurants/add', component: AdminComponent, canActivate: [adminGuard], data: { section: 'add' } },
  { path: 'admin/restaurants/:restaurantId/items', component: AdminComponent, canActivate: [adminGuard], data: { section: 'items' } },
  { path: 'admin/users', component: AdminComponent, canActivate: [adminGuard], data: { section: 'users' } },
  { path: 'admin/pending-admins', component: AdminComponent, canActivate: [superAdminGuard], data: { section: 'pending-admins' } },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'register',
    component: RegisterComponent
  },
  {
    path: 'home',
    component: HomeComponent
  },
  {
    path: 'products',
    redirectTo: 'menu',
    pathMatch: 'full'
  },
  {
    path: 'menu',
    component: RestaurantMenuComponent
  },
  {
    path: 'menu/:restaurantId',
    component: RestaurantMenuComponent
  },
  {
    path: 'cart',
    component: CartComponent,
    canActivate: [authGuard]
  },
  {
    path: 'wishlist',
    component: WishlistComponent,
    canActivate: [authGuard]
  },
  {
    path: 'profile',
    component: ProfileComponent,
    canActivate: [authGuard]
  },
  {
    path: 'change-password',
    component: ChangePasswordComponent,
    canActivate: [authGuard]
  },
  {
    path: 'services',
    component: ServicesComponent
  },
  {
    path: 'contact',
    component: ContactComponent
  },
  {
    path: '**',
    redirectTo: 'home'
  }
];
