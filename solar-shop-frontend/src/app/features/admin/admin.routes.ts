import { Routes } from '@angular/router';
import { adminGuard } from '../../core/guards/admin.guard';

export const ADMIN_ROUTES: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'dashboard'
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./dashboard/dashboard.component').then(m => m.DashboardComponent),
    canActivate: [adminGuard]
  },
  {
    path: 'products',
    loadComponent: () => import('./product-management/product-management.component').then(m => m.ProductManagementComponent),
    canActivate: [adminGuard]
  },
  {
    path: 'orders',
    loadComponent: () => import('./order-management/order-management.component').then(m => m.OrderManagementComponent),
    canActivate: [adminGuard]
  },
  {
    path: 'users',
    loadComponent: () => import('./user-management/user-management.component').then(m => m.UserManagementComponent),
    canActivate: [adminGuard]
  }
];