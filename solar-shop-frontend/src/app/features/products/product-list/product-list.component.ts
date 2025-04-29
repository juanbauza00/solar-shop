import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductCardComponent } from '../../../shared/components/product-card/product-card.component';
import { ProductService } from '../../../shared/services/product.service';
import { Product } from '../../../core/models/product';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, FormsModule, ProductCardComponent],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.css'
})
export class ProductListComponent implements OnInit {
  private productService = inject(ProductService);
  
  // Products
  products: Product[] = [];
  filteredProducts: Product[] = [];
  
  // Pagination
  currentPage = 0;
  pageSize = 9;
  totalPages = 0;
  
  // Filters
  searchTerm = '';
  categories = [
    { id: 1, name: 'Paneles solares', checked: false },
    { id: 2, name: 'Inversores', checked: false },
    { id: 3, name: 'Baterías', checked: false },
    { id: 4, name: 'Accesorios', checked: false }
  ];
  priceRange = { min: null as number | null, max: null as number | null };
  filterInStock = false;
  
  // Sorting
  sortBy = 'default';
  
  // UI states
  loading = false;
  error = '';
  
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
    const selectedCategories = this.categories
      .filter(c => c.checked)
      .map(c => c.name);
      
    if (selectedCategories.length > 0) {
      filtered = filtered.filter(p => 
        p.category && selectedCategories.includes(p.category)
      );
    }
    
    // Price filter
    if (this.priceRange.min !== null) {
      filtered = filtered.filter(p => p.price >= (this.priceRange.min as number));
    }
    
    if (this.priceRange.max !== null) {
      filtered = filtered.filter(p => p.price <= (this.priceRange.max as number));
    }
    
    // Stock filter
    if (this.filterInStock) {
      filtered = filtered.filter(p => p.stock > 0);
    }
    
    this.filteredProducts = filtered;
    this.sortProducts();
  }
  
  sortProducts(): void {
    switch (this.sortBy) {
      case 'price-asc':
        this.filteredProducts.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        this.filteredProducts.sort((a, b) => b.price - a.price);
        break;
      case 'name-asc':
        this.filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'name-desc':
        this.filteredProducts.sort((a, b) => b.name.localeCompare(a.name));
        break;
      default:
        // Keep original order
        this.filteredProducts = [...this.filteredProducts];
    }
  }
  
  resetFilters(): void {
    this.searchTerm = '';
    this.categories.forEach(c => c.checked = false);
    this.priceRange = { min: null, max: null };
    this.filterInStock = false;
    this.sortBy = 'default';
    this.applyFilters();
  }
  
  changePage(page: number): void {
    if (page < 0 || page >= this.totalPages) {
      return;
    }
    
    this.currentPage = page;
    this.loadProducts();
  }
  
  getPageRange(): number[] {
    const range = [];
    const maxPages = 5;
    let start = Math.max(0, this.currentPage - Math.floor(maxPages / 2));
    let end = Math.min(this.totalPages - 1, start + maxPages - 1);
    
    if (end - start + 1 < maxPages) {
      start = Math.max(0, end - maxPages + 1);
    }
    
    for (let i = start; i <= end; i++) {
      range.push(i);
    }
    
    return range;
  }
}