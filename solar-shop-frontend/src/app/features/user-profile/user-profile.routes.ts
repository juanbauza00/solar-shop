import { Routes } from '@angular/router';
import { authGuard } from '../../core/guards/auth.guard';

export const USER_PROFILE_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./profile/profile.component').then(m => m.ProfileComponent)
  },
  {
    path: 'orders',
    loadComponent: () => import('./order-history/order-history.component').then(m => m.OrderHistoryComponent)
  },
  {
    path: 'orders/:id',
    loadComponent: () => import('./order-detail/order-detail.component').then(m => m.OrderDetailComponent)
  },
  {
    path: 'addresses',
    loadComponent: () => import('./addresses/addresses.component').then(m => m.AddressesComponent)
  }
];