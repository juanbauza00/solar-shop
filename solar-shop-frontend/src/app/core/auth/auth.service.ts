import { Injectable, Signal, computed, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { jwtDecode } from 'jwt-decode';
import { environment } from '../../../environments/environment';
import { User } from '../models/user';

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
  
  constructor() {
    this.loadUserFromToken();
  }
  
  login(email: string, password: string): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}/auth/login`, { email, password })
      .pipe(
        tap(response => {
          localStorage.setItem('token', response.token);
          this.loadUserFromToken();
        })
      );
  }
  
  register(userData: any): Observable<any> {
    return this.http.post(`${environment.apiUrl}/auth/register`, userData);
  }
  
  logout(): void {
    localStorage.removeItem('token');
    this.user.set(null);
    this.router.navigate(['/']);
  }
  
  isAuthenticated(): boolean {
    return !!this.currentUser();
  }
  
  hasRole(role: string): boolean {
    return this.currentUser()?.role === role;
  }
  
  private loadUserFromToken(): void {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        this.user.set(null);
        return;
      }
      
      const decodedToken: any = jwtDecode(token);
      
      // Verificar si el token ha expirado
      const expirationDate = new Date(0);
      expirationDate.setUTCSeconds(decodedToken.exp);
      
      if (expirationDate < new Date()) {
        console.log('Token expirado');
        localStorage.removeItem('token');
        this.user.set(null);
        return;
      }
      
      // Extraer información del usuario del token
      this.user.set({
        id: decodedToken.sub,
        email: decodedToken.email,
        firstName: decodedToken.firstName || '',
        lastName: decodedToken.lastName || '',
        role: decodedToken.roles?.split(',')[0] || ''
      });
      
    } catch (error) {
      console.error('Error decodificando token', error);
      this.user.set(null);
    }
  }
}