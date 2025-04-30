import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ProductCardComponent } from '../../shared/components/product-card/product-card.component';
import { ProductService } from '../../shared/services/product.service';
import { Product } from '../../core/models/product/product';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink, ProductCardComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  private productService = inject(ProductService);

  featuredProducts: Product[] = [];
  loading = false;
  error = '';

  ngOnInit(): void {
    this.loadFeaturedProducts();
  }

  loadFeaturedProducts(): void {
    this.loading = true;
    this.productService.getProducts(0, 4).subscribe({
      next: (response) => {
        this.featuredProducts = response.content;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Error al cargar los productos destacados';
        this.loading = false;
        console.error(err);
      }
    });
  }
}