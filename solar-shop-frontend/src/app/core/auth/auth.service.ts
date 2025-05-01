import { Injectable, Signal, computed, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, of, throwError } from 'rxjs';
import { tap, delay } from 'rxjs/operators';
import { jwtDecode } from 'jwt-decode';
import { environment } from '../../../environments/environment';
import { User } from '../models/user/user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private user = signal<User | null>(null);
  public currentUser: Signal<User | null> = computed(() => this.user());
  
  // Signals derivados
  public isLoggedIn = computed(() => !!this.user());
  public userRole = computed(() => this.user()?.role || '');
  
  private http = inject(HttpClient);
  private router = inject(Router);
  
  // Variable para controlar si estamos en modo desarrollo
  private isDevelopment = true; // Cambiar a false en producción
  
  constructor() {
    this.loadUserFromToken();
    console.log('AuthService constructed, user:', this.user());
  }
  
  login(email: string, password: string): Observable<any> {
    // Si estamos en modo desarrollo, permitir cualquier usuario
    if (this.isDevelopment) {
      // Crear un token de autenticación simulado
      const mockToken = this.generateMockToken(email);
      
      // Crear un usuario simulado
      const mockUser: User = {
        id: '1',
        email: email,
        firstName: 'Usuario',
        lastName: 'Demo',
        role: email.includes('admin') ? 'ADMIN' : 'CUSTOMER'
      };
      
      // Simular una respuesta del servidor con un delay
      return of({ token: mockToken, user: mockUser }).pipe(
        delay(500), // Simular latencia de red
        tap(response => {
          localStorage.setItem('token', response.token);
          this.user.set(mockUser);
          console.log('User logged in:', mockUser);
        })
      );
    } else {
      // En producción, usar la autenticación real
      return this.http.post<any>(`${environment.apiUrl}/auth/login`, { email, password })
        .pipe(
          tap(response => {
            localStorage.setItem('token', response.token);
            this.loadUserFromToken();
          })
        );
    }
  }
  
  register(userData: any): Observable<any> {
    if (this.isDevelopment) {
      // Simular registro exitoso
      return of({ success: true }).pipe(delay(800));
    } else {
      return this.http.post(`${environment.apiUrl}/auth/register`, userData);
    }
  }
  
  logout(): void {
    localStorage.removeItem('token');
    this.user.set(null);
    this.router.navigate(['/']);
    console.log('User logged out');
  }
  
  isAuthenticated(): boolean {
    const hasUser = !!this.user();
    const hasToken = !!localStorage.getItem('token');
    const isAuth = hasUser && hasToken;
    console.log('isAuthenticated check - hasUser:', hasUser, 'hasToken:', hasToken, 'result:', isAuth);
    return isAuth;
  }
  
  hasRole(role: string): boolean {
    return this.user()?.role === role;
  }
  
  private loadUserFromToken(): void {
    try {
      const token = localStorage.getItem('token');
      console.log('Loading user from token. Token exists:', !!token);
      
      if (!token) {
        this.user.set(null);
        return;
      }
      
      // Para desarrollo, permitimos cualquier token válido en formato
      if (this.isDevelopment && token.split('.').length === 3) {
        try {
          const decodedToken: any = jwtDecode(token);
          console.log('Decoded token:', decodedToken);
          
          // Extraer información del usuario del token (o usar valores por defecto)
          this.user.set({
            id: decodedToken.sub || '1',
            email: decodedToken.email || 'user@example.com',
            firstName: decodedToken.firstName || 'Usuario',
            lastName: decodedToken.lastName || 'Demo',
            role: decodedToken.roles || 'CUSTOMER'
          });
          return;
        } catch (error) {
          console.error('Error decoding development token, creating default user');
          // Si hay algún error, crear un usuario por defecto
          this.user.set({
            id: '1',
            email: 'default@example.com',
            firstName: 'Usuario',
            lastName: 'Por Defecto',
            role: 'CUSTOMER'
          });
          return;
        }
      }
      
      // Procesamiento normal para producción
      const decodedToken: any = jwtDecode(token);
      
      // Verificar si el token ha expirado
      if (decodedToken.exp) {
        const expirationDate = new Date(0);
        expirationDate.setUTCSeconds(decodedToken.exp);
        
        if (expirationDate < new Date()) {
          console.log('Token expirado');
          localStorage.removeItem('token');
          this.user.set(null);
          return;
        }
      }
      
      // Extraer información del usuario del token
      this.user.set({
        id: decodedToken.sub || '',
        email: decodedToken.email || '',
        firstName: decodedToken.firstName || '',
        lastName: decodedToken.lastName || '',
        role: decodedToken.roles?.split(',')[0] || ''
      });
      
      console.log('User loaded from token:', this.user());
      
    } catch (error) {
      console.error('Error decodificando token', error);
      this.user.set(null);
    }
  }
  
  // Método para generar un token JWT falso para desarrollo
  private generateMockToken(email: string): string {
    // Crear un payload básico
    const isAdmin = email.includes('admin');
    const role = isAdmin ? 'ADMIN' : 'CUSTOMER';
    
    const payload = {
      sub: '1',
      email: email,
      firstName: 'Usuario',
      lastName: 'Demo',
      roles: role,
      exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24) // Expira en 24 horas
    };
    
    // Convertir a Base64
    const encodedPayload = btoa(JSON.stringify(payload));
    
    // Retornar un token JWT falso
    return `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.${encodedPayload}.SIGNATURE`;
  }
}