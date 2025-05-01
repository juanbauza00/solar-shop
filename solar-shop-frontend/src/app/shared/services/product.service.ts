import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { Product } from '../../core/models/product/product';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private isDevelopment = true; // Cambiar a false en producción

  // Productos simulados para desarrollo
  private mockProducts: Product[] = [
    {
      id: 1,
      name: 'Panel Solar 250W Monocristalino',
      description: 'Panel solar de alta eficiencia con 25 años de garantía. Ideal para instalaciones residenciales.',
      price: 299.99,
      imageUrl: 'assets/img/product-placeholder.jpg',
      category: 'Paneles solares',
      isActive: true,
      stock: 15,
      characteristics: [
        { name: 'Potencia', value: '250W' },
        { name: 'Tipo', value: 'Monocristalino' },
        { name: 'Eficiencia', value: '19.8%' },
        { name: 'Dimensiones', value: '1650 x 992 x 35mm' },
        { name: 'Garantía', value: '25 años' }
      ]
    },
    {
      id: 2,
      name: 'Panel Solar 400W Policristalino',
      description: 'Panel solar de gran potencia para mayores necesidades energéticas. Excelente relación calidad-precio.',
      price: 449.99,
      imageUrl: 'assets/img/product-placeholder.jpg',
      category: 'Paneles solares',
      isActive: true,
      stock: 10,
      characteristics: [
        { name: 'Potencia', value: '400W' },
        { name: 'Tipo', value: 'Policristalino' },
        { name: 'Eficiencia', value: '17.5%' },
        { name: 'Dimensiones', value: '2000 x 1100 x 40mm' },
        { name: 'Garantía', value: '20 años' }
      ]
    },
    {
      id: 3,
      name: 'Batería Solar 200Ah 12V',
      description: 'Batería de ciclo profundo para almacenamiento de energía solar. Alta durabilidad y rendimiento.',
      price: 599.99,
      imageUrl: 'assets/img/product-placeholder.jpg',
      category: 'Baterías',
      isActive: true,
      stock: 8,
      characteristics: [
        { name: 'Capacidad', value: '200Ah' },
        { name: 'Voltaje', value: '12V' },
        { name: 'Tipo', value: 'AGM' },
        { name: 'Ciclos', value: '3000 a 50% DoD' },
        { name: 'Garantía', value: '5 años' }
      ]
    },
    {
      id: 4,
      name: 'Inversor Solar 3000W',
      description: 'Inversor de onda pura para sistemas solares. Compatible con baterías de litio y plomo-ácido.',
      price: 899.99,
      imageUrl: 'assets/img/product-placeholder.jpg',
      category: 'Inversores',
      isActive: true,
      stock: 5,
      characteristics: [
        { name: 'Potencia', value: '3000W' },
        { name: 'Voltaje de entrada', value: '24V DC' },
        { name: 'Voltaje de salida', value: '220V AC' },
        { name: 'Eficiencia', value: '93%' },
        { name: 'Garantía', value: '3 años' }
      ]
    },
    {
      id: 5,
      name: 'Controlador de Carga MPPT 40A',
      description: 'Controlador MPPT para maximizar la producción de energía de tus paneles solares.',
      price: 249.99,
      imageUrl: 'assets/img/product-placeholder.jpg',
      category: 'Controladores',
      isActive: true,
      stock: 12,
      characteristics: [
        { name: 'Corriente máxima', value: '40A' },
        { name: 'Voltaje', value: '12V/24V' },
        { name: 'Tipo', value: 'MPPT' },
        { name: 'Eficiencia', value: 'Hasta 98%' },
        { name: 'Garantía', value: '2 años' }
      ]
    },
    {
      id: 6,
      name: 'Kit Solar Completo 1000W',
      description: 'Kit completo para instalación solar que incluye 4 paneles de 250W, inversor, controlador y cables.',
      price: 1599.99,
      imageUrl: 'assets/img/product-placeholder.jpg',
      category: 'Kits solares',
      isActive: true,
      stock: 3,
      characteristics: [
        { name: 'Potencia total', value: '1000W' },
        { name: 'Paneles', value: '4 x 250W' },
        { name: 'Inversor', value: '1500W' },
        { name: 'Controlador', value: 'MPPT 60A' },
        { name: 'Incluye', value: 'Cables y conectores' }
      ]
    },
    {
      id: 7,
      name: 'Cable Solar 6mm² (10 metros)',
      description: 'Cable específico para instalaciones solares con doble aislamiento y resistente a UV.',
      price: 49.99,
      imageUrl: 'assets/img/product-placeholder.jpg',
      category: 'Accesorios',
      isActive: true,
      stock: 20,
      characteristics: [
        { name: 'Sección', value: '6mm²' },
        { name: 'Longitud', value: '10 metros' },
        { name: 'Resistencia UV', value: 'Sí' },
        { name: 'Temperatura máxima', value: '120°C' }
      ]
    },
    {
      id: 8,
      name: 'Estructura Soporte para 2 Paneles',
      description: 'Soporte de aluminio ajustable para montaje de paneles solares en tejado.',
      price: 129.99,
      imageUrl: 'assets/img/product-placeholder.jpg',
      category: 'Accesorios',
      isActive: true,
      stock: 7,
      characteristics: [
        { name: 'Material', value: 'Aluminio anodizado' },
        { name: 'Capacidad', value: '2 paneles' },
        { name: 'Ajustable', value: '15-45 grados' },
        { name: 'Incluye', value: 'Tornillería de montaje' }
      ]
    }
  ];

  constructor(private http: HttpClient) { }

  getProducts(page = 0, size = 10): Observable<any> {
    if (this.isDevelopment) {
      // Simular paginación
      const start = page * size;
      const end = start + size;
      const paginatedProducts = this.mockProducts.slice(start, end);
      
      // Crear objeto de respuesta paginada similar al que devolvería Spring Data
      const response = {
        content: paginatedProducts,
        pageable: {
          pageNumber: page,
          pageSize: size
        },
        totalElements: this.mockProducts.length,
        totalPages: Math.ceil(this.mockProducts.length / size),
        last: end >= this.mockProducts.length,
        first: page === 0,
        size: paginatedProducts.length,
        number: page,
        sort: {
          sorted: false,
          unsorted: true,
          empty: true
        },
        numberOfElements: paginatedProducts.length,
        empty: paginatedProducts.length === 0
      };
      
      return of(response).pipe(delay(300)); // Simular latencia
    } else {
      const params = new HttpParams()
        .set('page', page.toString())
        .set('size', size.toString());

      return this.http.get<any>(`${environment.apiUrl}/products`, { params });
    }
  }

  getProduct(id: number): Observable<Product> {
    if (this.isDevelopment) {
      const product = this.mockProducts.find(p => p.id === id);
      if (product) {
        return of(product).pipe(delay(200));
      } else {
        throw new Error('Producto no encontrado');
      }
    } else {
      return this.http.get<Product>(`${environment.apiUrl}/products/${id}`);
    }
  }

  getProductBySlug(slug: string): Observable<Product> {
    if (this.isDevelopment) {
      // En el modo desarrollo, simplemente devolvemos el primer producto
      // En un caso real, buscaríamos por slug
      return of(this.mockProducts[0]).pipe(delay(200));
    } else {
      return this.http.get<Product>(`${environment.apiUrl}/products/slug/${slug}`);
    }
  }

  getProductsByCategory(categoryId: number): Observable<Product[]> {
    if (this.isDevelopment) {
      // Simulamos la selección por categoría usando el índice % 4
      // Esto es solo para demostración
      const categoryMap: {[key: number]: string} = {
        1: 'Paneles solares',
        2: 'Inversores',
        3: 'Baterías',
        4: 'Accesorios'
      };
      
      const categoryName = categoryMap[categoryId] || 'Paneles solares';
      const products = this.mockProducts.filter(p => p.category === categoryName);
      
      return of(products).pipe(delay(300));
    } else {
      return this.http.get<Product[]>(`${environment.apiUrl}/products/category/${categoryId}`);
    }
  }
}