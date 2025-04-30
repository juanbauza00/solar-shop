import { PaymentInfo } from "./paymentInfo";

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