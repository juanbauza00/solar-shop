import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { OrderRequest, OrderResponse } from '../../core/models/order/orderRequest';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private isDevelopment = true; // Cambiar a false en producción
  
  // Datos simulados para modo desarrollo
  private mockOrders: OrderResponse[] = [
    { 
      id: 1001, 
      status: 'PENDING', 
      createdAt: '2025-04-25T08:30:00', 
      updatedAt: '2025-04-25T08:30:00', 
      items: [
        { productId: 1, productName: 'Panel Solar 250W', unitPrice: 350, quantity: 2, total: 700 },
        { productId: 5, productName: 'Inversor 1500W', unitPrice: 550, quantity: 1, total: 550 }
      ], 
      total: 1250,
      subtotal: 1033.06,
      discount: 0,
      taxes: 216.94,
      payment: {
        method: 'Tarjeta de crédito',
        status: 'Procesando',
        invoiceNumber: 'FAC-20250425-1001'
      }
    },
    { 
      id: 1002, 
      status: 'COMPLETED', 
      createdAt: '2025-04-20T14:45:00', 
      updatedAt: '2025-04-21T16:20:00', 
      items: [
        { productId: 3, productName: 'Batería 100Ah', unitPrice: 750, quantity: 1, total: 750 }
      ], 
      total: 750,
      subtotal: 619.83,
      discount: 0,
      taxes: 130.17,
      payment: {
        method: 'MercadoPago',
        status: 'Completado',
        invoiceNumber: 'FAC-20250420-1002'
      }
    },
    { 
      id: 1003, 
      status: 'SHIPPED', 
      createdAt: '2025-04-15T10:15:00', 
      updatedAt: '2025-04-16T12:30:00', 
      items: [
        { productId: 2, productName: 'Panel Solar 400W', unitPrice: 550, quantity: 2, total: 1100 },
        { productId: 7, productName: 'Controlador de carga 30A', unitPrice: 250, quantity: 1, total: 250 },
        { productId: 9, productName: 'Kit de cables solares', unitPrice: 75, quantity: 1, total: 75 }
      ], 
      total: 2100,
      subtotal: 1735.54,
      discount: 0,
      taxes: 364.46,
      payment: {
        method: 'Transferencia bancaria',
        status: 'Completado',
        invoiceNumber: 'FAC-20250415-1003'
      }
    }
  ];
  
  constructor(private http: HttpClient) { }
  
  createOrder(order: OrderRequest): Observable<OrderResponse> {
    if (this.isDevelopment) {
      // Crear un pedido simulado
      const newOrder: OrderResponse = {
        id: 1004, // ID simulado
        status: 'PENDING',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        items: order.items.map(item => ({
          productId: item.productId,
          productName: `Producto #${item.productId}`,
          unitPrice: 100, // Precio simulado
          quantity: item.quantity,
          total: 100 * item.quantity
        })),
        notes: order.notes,
        total: order.items.reduce((sum, item) => sum + (100 * item.quantity), 0) * 1.21,
        subtotal: order.items.reduce((sum, item) => sum + (100 * item.quantity), 0),
        discount: 0,
        taxes: order.items.reduce((sum, item) => sum + (100 * item.quantity), 0) * 0.21,
        payment: {
          method: 'Tarjeta de crédito',
          status: 'Pendiente',
          invoiceNumber: `FAC-${new Date().toISOString().split('T')[0].replace(/-/g, '')}-1004`
        }
      };
      
      // Añadir el nuevo pedido a la lista simulada
      this.mockOrders = [newOrder, ...this.mockOrders];
      
      return of(newOrder).pipe(delay(800)); // Simular latencia
    } else {
      return this.http.post<OrderResponse>(`${environment.apiUrl}/orders`, order);
    }
  }
  
  getUserOrders(): Observable<OrderResponse[]> {
    if (this.isDevelopment) {
      return of(this.mockOrders).pipe(delay(500)); // Simular latencia
    } else {
      return this.http.get<OrderResponse[]>(`${environment.apiUrl}/orders/user`);
    }
  }
  
  getOrderDetails(id: number): Observable<OrderResponse> {
    if (this.isDevelopment) {
      const order = this.mockOrders.find(o => o.id === id);
      if (order) {
        return of(order).pipe(delay(300)); // Simular latencia
      } else {
        // Simular error 404
        throw new Error('Pedido no encontrado');
      }
    } else {
      return this.http.get<OrderResponse>(`${environment.apiUrl}/orders/${id}`);
    }
  }
  
  getAllOrders(): Observable<OrderResponse[]> {
    if (this.isDevelopment) {
      return of(this.mockOrders).pipe(delay(500)); // Simular latencia
    } else {
      return this.http.get<OrderResponse[]>(`${environment.apiUrl}/orders`);
    }
  }
  
  updateOrderStatus(orderId: number, statusId: number): Observable<OrderResponse> {
    if (this.isDevelopment) {
      const statusMap: {[key: number]: string} = {
        1: 'PENDING',
        2: 'PROCESSING',
        3: 'SHIPPED',
        4: 'COMPLETED',
        5: 'CANCELLED'
      };
      
      const order = this.mockOrders.find(o => o.id === orderId);
      if (order) {
        const updatedOrder = {
          ...order,
          status: statusMap[statusId] || 'UNKNOWN',
          updatedAt: new Date().toISOString()
        };
        
        // Actualizar el pedido en la lista simulada
        const index = this.mockOrders.findIndex(o => o.id === orderId);
        if (index !== -1) {
          this.mockOrders[index] = updatedOrder;
        }
        
        return of(updatedOrder).pipe(delay(300)); // Simular latencia
      } else {
        throw new Error('Pedido no encontrado');
      }
    } else {
      return this.http.patch<OrderResponse>(
        `${environment.apiUrl}/orders/${orderId}/status`, 
        { statusId }
      );
    }
  }
}