import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AdminSidebarComponent } from '../shared/admin-sidebar/admin-sidebar.component';
import { OrderService, OrderResponse } from '../../../shared/services/order.service';

@Component({
  selector: 'app-order-management',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, AdminSidebarComponent],
  templateUrl: './order-management.component.html',
  styleUrl: './order-management.component.css'
})
export class OrderManagementComponent implements OnInit {
  private orderService = inject(OrderService);
  
  orders: OrderResponse[] = [];
  filteredOrders: OrderResponse[] = [];
  loading = false;
  error = '';
  
  // Filters
  searchTerm = '';
  statusFilter = '';
  dateFilter = '';
  
  // Mock data for demo
  mockOrders: OrderResponse[] = [
    { id: 1001, status: 'PENDING', createdAt: '2025-04-25T08:30:00', updatedAt: '2025-04-25T08:30:00', items: [], total: 1250 },
    { id: 1002, status: 'COMPLETED', createdAt: '2025-04-24T14:45:00', updatedAt: '2025-04-24T16:20:00', items: [], total: 750 },
    { id: 1003, status: 'SHIPPED', createdAt: '2025-04-23T10:15:00', updatedAt: '2025-04-23T12:30:00', items: [], total: 2100 },
    { id: 1004, status: 'CANCELLED', createdAt: '2025-04-22T09:20:00', updatedAt: '2025-04-22T11:45:00', items: [], total: 890 },
    { id: 1005, status: 'PROCESSING', createdAt: '2025-04-21T16:10:00', updatedAt: '2025-04-21T17:00:00', items: [], total: 1540 },
    { id: 1006, status: 'COMPLETED', createdAt: '2025-04-20T13:40:00', updatedAt: '2025-04-20T15:25:00', items: [], total: 3200 },
    { id: 1007, status: 'PENDING', createdAt: '2025-04-19T11:05:00', updatedAt: '2025-04-19T11:05:00', items: [], total: 980 },
    { id: 1008, status: 'SHIPPED', createdAt: '2025-04-18T14:30:00', updatedAt: '2025-04-18T16:45:00', items: [], total: 1350 },
    { id: 1009, status: 'COMPLETED', createdAt: '2025-04-17T09:50:00', updatedAt: '2025-04-17T11:20:00', items: [], total: 2700 },
    { id: 1010, status: 'CANCELLED', createdAt: '2025-04-16T15:15:00', updatedAt: '2025-04-16T16:30:00', items: [], total: 450 }
  ];
  
  ngOnInit(): void {
    // For demo purposes, using mock data
    this.orders = this.mockOrders;
    this.filteredOrders = [...this.orders];
    
    // In a real app, we would load orders from the service
    /*
    this.loading = true;
    this.orderService.getAllOrders().subscribe({
      next: (orders) => {
        this.orders = orders;
        this.filteredOrders = [...this.orders];
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Error al cargar los pedidos';
        this.loading = false;
        console.error(err);
      }
    });
    */
  }
  
  applyFilters(): void {
    let filtered = [...this.orders];
    
    // Search term filter (by order ID)
    if (this.searchTerm) {
      filtered = filtered.filter(o => 
        o.id.toString().includes(this.searchTerm)
      );
    }
    
    // Status filter
    if (this.statusFilter) {
      filtered = filtered.filter(o => 
        o.status === this.statusFilter
      );
    }
    
    // Date filter (simple implementation for demo)
    if (this.dateFilter) {
      const today = new Date();
      
      switch (this.dateFilter) {
        case 'today':
          filtered = filtered.filter(o => 
            new Date(o.createdAt).toDateString() === today.toDateString()
          );
          break;
        case 'week':
          const weekAgo = new Date();
          weekAgo.setDate(today.getDate() - 7);
          filtered = filtered.filter(o => 
            new Date(o.createdAt) >= weekAgo
          );
          break;
        case 'month':
          const monthAgo = new Date();
          monthAgo.setMonth(today.getMonth() - 1);
          filtered = filtered.filter(o => 
            new Date(o.createdAt) >= monthAgo
          );
          break;
      }
    }
    
    this.filteredOrders = filtered;
  }
  
  resetFilters(): void {
    this.searchTerm = '';
    this.statusFilter = '';
    this.dateFilter = '';
    this.filteredOrders = [...this.orders];
  }
  
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
  
  updateOrderStatus(orderId: number, newStatus: string): void {
    // In a real app, we would call the service to update the order status
    const orderIndex = this.orders.findIndex(o => o.id === orderId);
    if (orderIndex !== -1) {
      this.orders[orderIndex].status = newStatus;
      this.orders[orderIndex].updatedAt = new Date().toISOString();
      this.applyFilters();
    }
  }
}