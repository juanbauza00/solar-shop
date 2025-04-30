// src/app/shared/services/order.service.ts
// Asegúrate de que la interfaz OrderResponse tenga todas las propiedades necesarias

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { OrderRequest, OrderResponse } from '../../core/models/order/orderRequest';

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