import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { OrderService } from '../../../shared/services/order.service';
import { OrderResponse } from '../../../shared/services/order.service';

@Component({
  selector: 'app-order-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './order-detail.component.html',
  styleUrl: './order-detail.component.css'
})
export class OrderDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private orderService = inject(OrderService);
  
  order: OrderResponse | null = null;
  loading = false;
  error = '';
  
  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.loadOrder(Number(id));
      } else {
        this.router.navigate(['/profile/orders']);
      }
    });
  }
  
  loadOrder(id: number): void {
    this.loading = true;
    this.orderService.getOrderDetails(id).subscribe({
      next: (order) => {
        this.order = order;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Error al cargar el pedido';
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