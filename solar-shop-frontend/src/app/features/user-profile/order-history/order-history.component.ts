import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { OrderService } from '../../../shared/services/order.service';
import { OrderResponse } from '../../../shared/services/order.service';

@Component({
  selector: 'app-order-history',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './order-history.component.html',
  styleUrl: './order-history.component.css'
})
export class OrderHistoryComponent implements OnInit {
  private orderService = inject(OrderService);
  
  orders: OrderResponse[] = [];
  loading = false;
  error = '';
  
  ngOnInit(): void {
    this.loadOrders();
  }
  
  loadOrders(): void {
    this.loading = true;
    this.orderService.getUserOrders().subscribe({
      next: (orders) => {
        this.orders = orders;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Error al cargar los pedidos';
        this.loading = false;
        console.error(err);
      }
    });
  }
  
  getStatusClass(status: string): string {
    switch (status.toLowerCase()) {
      case 'pendiente':
      case 'pending':
        return 'bg-warning';
      case 'completado':
      case 'completed':
        return 'bg-success';
      case 'cancelado':
      case 'cancelled':
        return 'bg-danger';
      case 'enviado':
      case 'shipped':
        return 'bg-info';
      default:
        return 'bg-secondary';
    }
  }
}