import { Routes } from '@angular/router';
import { LoginComponent } from './components/auth/login/login.component';
import { RegisterComponent } from './components/auth/register/register.component';
import { ContactComponent } from './components/pages/contact/contact.component';
import { HomeComponent } from './components/pages/home/home.component';
import { ServicesComponent } from './components/pages/services/services.component';
import { authGuard } from './guards/auth.guard';
import { ProductsComponent } from './components/pages/products/products.component';

export const routes: Routes = [

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
        component: HomeComponent,
        canActivate: [authGuard]
    },
    {
        path: 'products',
        component: ProductsComponent,
        canActivate: [authGuard]
    },

    {
        path: 'services',
        component: ServicesComponent,
        canActivate: [authGuard]
    },

    {
        path: 'contact',
        component: ContactComponent,
        canActivate: [authGuard]
    },
];