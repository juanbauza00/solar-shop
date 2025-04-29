import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../../shared/services/product.service';
import { CartService } from '../../../shared/services/cart.service';
import { Product } from '../../../core/models/product';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './product-detail.component.html',
  styleUrl: './product-detail.component.css'
})
export class ProductDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private productService = inject(ProductService);
  private cartService = inject(CartService);
  
  product: Product | null = null;
  relatedProducts: Product[] = [];
  quantity = 1;
  
  // UI states
  loading = false;
  error = '';
  
  // For image gallery
  productImages: string[] = [];
  selectedImageIndex = 0;
  
  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.loadProduct(Number(id));
      } else {
        this.router.navigate(['/products']);
      }
    });
  }
  
  loadProduct(id: number): void {
    this.loading = true;
    this.productService.getProduct(id).subscribe({
      next: (product) => {
        this.product = product;
        
        // Set default images (in a real app, would come from API)
        if (product.imageUrl) {
          this.productImages = [product.imageUrl];
          // Mockup additional images for the gallery effect
          this.productImages.push('assets/img/product-placeholder.jpg');
          this.productImages.push('assets/img/product-placeholder.jpg');
        } else {
          this.productImages = ['assets/img/product-placeholder.jpg'];
        }
        
        this.loadRelatedProducts(product.category);
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Error al cargar el producto';
        this.loading = false;
        console.error(err);
      }
    });
  }
  
  loadRelatedProducts(category?: string): void {
    if (!category || !this.product) return;
    
    this.productService.getProductsByCategory(1).subscribe({
      next: (products) => {
        // Filter out current product and limit to 4
        this.relatedProducts = products
          .filter(p => p.id !== this.product?.id)
          .slice(0, 4);
      },
      error: (err) => {
        console.error('Error loading related products', err);
      }
    });
  }
  
  decreaseQuantity(): void {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }
  
  increaseQuantity(): void {
    if (this.product && this.quantity < this.product.stock) {
      this.quantity++;
    }
  }
  
  addToCart(): void {
    if (this.product && this.quantity > 0 && this.product.stock >= this.quantity) {
      this.cartService.addToCart(this.product, this.quantity);
      // Show toast or notification
      alert(`Se agregaron ${this.quantity} unidades de ${this.product.name} al carrito`);
    }
  }
}