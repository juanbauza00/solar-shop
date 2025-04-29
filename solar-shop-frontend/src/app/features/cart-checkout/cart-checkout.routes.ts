import { Routes } from '@angular/router';
import { authGuard } from '../../core/guards/auth.guard';

export const CART_CHECKOUT_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./cart/cart.component').then(m => m.CartComponent)
  },
  {
    path: 'checkout',
    canActivate: [authGuard],
    loadComponent: () => import('./checkout/checkout.component').then(m => m.CheckoutComponent)
  }
];