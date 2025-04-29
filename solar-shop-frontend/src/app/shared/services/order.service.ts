import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface OrderRequest {
  addressId: number;
  paymentMethodId: number;
  items: OrderItemRequest[];
  notes?: string;
}

export interface OrderItemRequest {
  productId: number;
  quantity: number;
}

// Interfaz para los items de un pedido en la respuesta
export interface OrderItemResponse {
  productId: number;
  productName: string;
  unitPrice: number;
  quantity: number;
  total: number;
}

// Interfaz para la información de pago
export interface PaymentInfo {
  method: string;
  status: string;
  invoiceNumber?: string;
}

// Interfaz completa para la respuesta de un pedido
export interface OrderResponse {
  id: number;
  status: string;
  createdAt: string;
  updatedAt: string;
  notes?: string;
  
  // Información de pago
  payment?: PaymentInfo;
  
  // Detalles financieros
  subtotal: number;
  discount: number;
  taxes: number;
  total: number;
  
  // Items del pedido
  items: OrderItemResponse[];
}

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  constructor(private http: HttpClient) { }
  
  createOrder(order: OrderRequest): Observable<OrderResponse> {
    return this.http.post<OrderResponse>(`${environment.apiUrl}/orders`, order);
  }
  
  getUserOrders(): Observable<OrderResponse[]> {
    return this.http.get<OrderResponse[]>(`${environment.apiUrl}/orders/user`);
  }
  
  getOrderDetails(id: number): Observable<OrderResponse> {
    return this.http.get<OrderResponse>(`${environment.apiUrl}/orders/${id}`);
  }
}