import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AdminSidebarComponent } from '../shared/admin-sidebar/admin-sidebar.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, AdminSidebarComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
  // Datos simulados para el dashboard
  stats = {
    totalSales: 24850,
    todaySales: 1250,
    pendingOrders: 8,
    lowStockProducts: 5,
    userRegistrations: 12
  };
  
  recentOrders = [
    { id: 1001, date: '2025-04-25', customer: 'Juan Pérez', total: 1250, status: 'COMPLETED' },
    { id: 1002, date: '2025-04-25', customer: 'María López', total: 750, status: 'PENDING' },
    { id: 1003, date: '2025-04-24', customer: 'Carlos Rodríguez', total: 2100, status: 'SHIPPED' },
    { id: 1004, date: '2025-04-24', customer: 'Ana Martínez', total: 890, status: 'PROCESSING' },
    { id: 1005, date: '2025-04-23', customer: 'Pedro Gómez', total: 1540, status: 'COMPLETED' }
  ];
  
  topProducts = [
    { id: 1, name: 'Panel Solar 400W', sales: 24, stock: 35 },
    { id: 2, name: 'Inversor 3000W', sales: 18, stock: 12 },
    { id: 3, name: 'Batería 200Ah', sales: 15, stock: 8 },
    { id: 4, name: 'Kit Cables Solares', sales: 30, stock: 50 },
    { id: 5, name: 'Controlador MPPT 50A', sales: 10, stock: 3 }
  ];
  
  getStatusClass(status: string): string {
    switch (status) {
      case 'COMPLETED': return 'bg-success';
      case 'PENDING': return 'bg-warning';
      case 'SHIPPED': return 'bg-info';
      case 'PROCESSING': return 'bg-primary';
      case 'CANCELLED': return 'bg-danger';
      default: return 'bg-secondary';
    }
  }
  
  getStockClass(stock: number): string {
    if (stock <= 5) return 'text-danger';
    if (stock <= 15) return 'text-warning';
    return 'text-success';
  }
}