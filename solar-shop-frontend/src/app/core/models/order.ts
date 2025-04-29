import { Address } from "./address";
import { OrderItem } from "./orderItem";
import { PaymentInfo } from "./paymentInfo";

export interface Order {
    id: number;
    status: string;
    createdAt: string;
    updatedAt: string;
    notes?: string;
    address?: Address;
    items: OrderItem[];
    payment?: PaymentInfo;
    subtotal: number;
    discount: number;
    taxes: number;
    total: number;
  }
  