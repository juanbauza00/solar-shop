import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { CartService } from '../../../shared/services/cart.service';
import { OrderService } from '../../../shared/services/order.service';
import { AuthService } from '../../../core/auth/auth.service';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.css'
})
export class CheckoutComponent {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private authService = inject(AuthService);
  cartService = inject(CartService);
  private orderService = inject(OrderService);
  
  checkoutForm: FormGroup;
  loading = false;
  submitted = false;
  error = '';
  orderSuccess = false;
  orderNumber = '';
  
  constructor() {
    this.checkoutForm = this.fb.group({
      // Shipping info
      firstName: [this.authService.currentUser()?.firstName || '', Validators.required],
      lastName: [this.authService.currentUser()?.lastName || '', Validators.required],
      address: ['', Validators.required],
      city: ['', Validators.required],
      state: ['', Validators.required],
      zipCode: ['', Validators.required],
      
      // Payment info
      paymentMethod: ['creditCard', Validators.required],
      cardName: [''],
      cardNumber: ['', [Validators.pattern(/^[0-9]{16}$/)]],
      cardExpiry: ['', [Validators.pattern(/^(0[1-9]|1[0-2])\/([0-9]{2})$/)]],
      cardCvv: ['', [Validators.pattern(/^[0-9]{3,4}$/)]],
      
      // Terms
      termsAccepted: [false, Validators.requiredTrue]
    });
    
    // Add conditional validation for credit card fields
    this.checkoutForm.get('paymentMethod')?.valueChanges.subscribe(method => {
      const cardFields = ['cardName', 'cardNumber', 'cardExpiry', 'cardCvv'];
      
      if (method === 'creditCard') {
        cardFields.forEach(field => {
          this.checkoutForm.get(field)?.setValidators([Validators.required]);
        });
        this.checkoutForm.get('cardNumber')?.addValidators([Validators.pattern(/^[0-9]{16}$/)]);
        this.checkoutForm.get('cardExpiry')?.addValidators([Validators.pattern(/^(0[1-9]|1[0-2])\/([0-9]{2})$/)]);
        this.checkoutForm.get('cardCvv')?.addValidators([Validators.pattern(/^[0-9]{3,4}$/)]);
      } else {
        cardFields.forEach(field => {
          this.checkoutForm.get(field)?.clearValidators();
          this.checkoutForm.get(field)?.setErrors(null);
        });
      }
      
      cardFields.forEach(field => {
        this.checkoutForm.get(field)?.updateValueAndValidity();
      });
    });
  }
  
  get f() { return this.checkoutForm.controls; }
  
  onSubmit(): void {
    this.submitted = true;
    
    if (this.checkoutForm.invalid) {
      return;
    }
    
    this.loading = true;
    this.error = '';
    
    // Create order request object from form and cart
    const orderItems = this.cartService.items().map(item => ({
      productId: item.product.id,
      quantity: item.quantity
    }));
    
    const orderRequest = {
      addressId: 1, // In a real app, we'd select or create an address
      paymentMethodId: this.getPaymentMethodId(),
      items: orderItems,
      notes: ''
    };
    
    // Place order
    this.orderService.createOrder(orderRequest).subscribe({
      next: (response) => {
        this.orderSuccess = true;
        this.orderNumber = response.id.toString();
        this.cartService.clearCart();
        this.loading = false;
        
        // Redirect to order confirmation after a delay
        setTimeout(() => {
          this.router.navigate(['/profile/orders', this.orderNumber]);
        }, 3000);
      },
      error: (err) => {
        this.error = err?.message || 'Error al procesar el pedido. Inténtelo de nuevo más tarde.';
        this.loading = false;
      }
    });
  }
  
  private getPaymentMethodId(): number {
    // In a real app, these would come from the API
    const paymentMethodMap: {[key: string]: number} = {
      'creditCard': 1,
      'mercadoPago': 2,
      'bankTransfer': 3
    };
    
    return paymentMethodMap[this.checkoutForm.get('paymentMethod')?.value] || 1;
  }
}