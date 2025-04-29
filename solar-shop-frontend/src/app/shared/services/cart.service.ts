import { Injectable, computed, signal } from '@angular/core';
import { Product } from '../../core/models/product.model';

export interface CartItem {
  product: Product;
  quantity: number;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartItems = signal<CartItem[]>([]);
  
  // Computed signals
  public items = computed(() => this.cartItems());
  public totalItems = computed(() => 
    this.items().reduce((total, item) => total + item.quantity, 0)
  );
  public totalAmount = computed(() => 
    this.items().reduce((total, item) => 
      total + (item.product.price * item.quantity), 0)
  );
  
  // Filtered signals
  public activeItems = computed(() => 
    this.items().filter(item => item.product.isActive)
  );
  
  public cartTaxes = computed(() => this.totalAmount() * 0.21);
  public cartTotal = computed(() => this.totalAmount() + this.cartTaxes());

  constructor() {
    this.loadCart();
  }

  addToCart(product: Product, quantity = 1): void {
    this.cartItems.update(items => {
      const existingItemIndex = items.findIndex(item => item.product.id === product.id);
      
      if (existingItemIndex >= 0) {
        // Update existing item
        const updatedItems = [...items];
        updatedItems[existingItemIndex] = {
          ...updatedItems[existingItemIndex],
          quantity: updatedItems[existingItemIndex].quantity + quantity
        };
        return updatedItems;
      } else {
        // Add new item
        return [...items, { product, quantity }];
      }
    });
    
    this.saveCart();
  }

  removeFromCart(productId: number): void {
    this.cartItems.update(items => 
      items.filter(item => item.product.id !== productId)
    );
    this.saveCart();
  }

  updateQuantity(productId: number, quantity: number): void {
    if (quantity <= 0) {
      this.removeFromCart(productId);
      return;
    }
    
    this.cartItems.update(items => 
      items.map(item => 
        item.product.id === productId 
          ? { ...item, quantity } 
          : item
      )
    );
    this.saveCart();
  }

  clearCart(): void {
    this.cartItems.set([]);
    localStorage.removeItem('cart');
  }

  private saveCart(): void {
    localStorage.setItem('cart', JSON.stringify(this.cartItems()));
  }

  private loadCart(): void {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        this.cartItems.set(JSON.parse(savedCart));
      } catch (e) {
        console.error('Error loading cart from localStorage', e);
        this.cartItems.set([]);
      }
    }
  }
}