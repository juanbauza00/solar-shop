import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AdminSidebarComponent } from '../shared/admin-sidebar/admin-sidebar.component';
import { ProductService } from '../../../shared/services/product.service';
import { Product } from '../../../core/models/product';

@Component({
  selector: 'app-product-management',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, AdminSidebarComponent],
  templateUrl: './product-management.component.html',
  styleUrl: './product-management.component.css'
})
export class ProductManagementComponent implements OnInit {
  private productService = inject(ProductService);
  
  products: Product[] = [];
  filteredProducts: Product[] = [];
  loading = false;
  error = '';
  
  // Filters
  searchTerm = '';
  categoryFilter = '';
  stockFilter = 'all'; // 'all', 'inStock', 'lowStock', 'outOfStock'
  
  // Pagination
  currentPage = 0;
  pageSize = 10;
  totalPages = 0;
  
  ngOnInit(): void {
    this.loadProducts();
  }
  
  loadProducts(): void {
    this.loading = true;
    this.productService.getProducts(this.currentPage, this.pageSize).subscribe({
      next: (response) => {
        this.products = response.content;
        this.filteredProducts = [...this.products];
        this.totalPages = response.totalPages;
        this.loading = false;
        this.applyFilters();
      },
      error: (err) => {
        this.error = 'Error al cargar los productos';
        this.loading = false;
        console.error(err);
      }
    });
  }
  
  applyFilters(): void {
    let filtered = [...this.products];
    
    // Search term filter
    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(p => 
        p.name.toLowerCase().includes(term) || 
        p.description.toLowerCase().includes(term)
      );
    }
    
    // Category filter
    if (this.categoryFilter) {
      filtered = filtered.filter(p => 
        p.category === this.categoryFilter
      );
    }
    
    // Stock filter
    switch (this.stockFilter) {
      case 'inStock':
        filtered = filtered.filter(p => p.stock > 0);
        break;
      case 'lowStock':
        filtered = filtered.filter(p => p.stock > 0 && p.stock <= 10);
        break;
      case 'outOfStock':
        filtered = filtered.filter(p => p.stock === 0);
        break;
    }
    
    this.filteredProducts = filtered;
  }
  
  resetFilters(): void {
    this.searchTerm = '';
    this.categoryFilter = '';
    this.stockFilter = 'all';
    this.applyFilters();
  }
  
  changePage(page: number): void {
    if (page < 0 || page >= this.totalPages) {
      return;
    }
    
    this.currentPage = page;
    this.loadProducts();
  }
  
  getStockClass(stock: number): string {
    if (stock === 0) return 'bg-danger';
    if (stock <= 10) return 'bg-warning';
    return 'bg-success';
  }
  
  deleteProduct(id: number): void {
    if (confirm('¿Está seguro que desea eliminar este producto?')) {
      // En una aplicación real, llamaría al servicio para eliminar el producto
      // Por ahora, simulamos la eliminación
      this.filteredProducts = this.filteredProducts.filter(p => p.id !== id);
      this.products = this.products.filter(p => p.id !== id);
    }
  }
}