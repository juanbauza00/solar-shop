import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CartService } from '../../../shared/services/cart.service';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css'
})
export class CartComponent {
  cartService = inject(CartService);
  
  updateQuantity(productId: number, quantity: number): void {
    this.cartService.updateQuantity(productId, quantity);
  }
  
  removeItem(productId: number): void {
    if (confirm('¿Estás seguro que deseas eliminar este producto del carrito?')) {
      this.cartService.removeFromCart(productId);
    }
  }
  
  clearCart(): void {
    if (confirm('¿Estás seguro que deseas vaciar el carrito?')) {
      this.cartService.clearCart();
    }
  }
}