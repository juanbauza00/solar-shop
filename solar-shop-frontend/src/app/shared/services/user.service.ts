import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { User } from '../../core/models/user/user';

export interface AddressRequest {
  addressLine: string;
  number?: string;
  postalCode: string;
  city: string;
  stateId: number;
  countryId: number;
  additionalInfo?: string;
}

export interface Address {
  id: number;
  addressLine: string;
  number?: string;
  postalCode: string;
  city: string;
  state: string;
  country: string;
  additionalInfo?: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private isDevelopment = true; // Cambiar a false en producción
  
  // Datos simulados para modo desarrollo
  private mockAddresses: Address[] = [
    {
      id: 1,
      addressLine: 'Av. Corrientes',
      number: '1234',
      postalCode: '1043',
      city: 'Buenos Aires',
      state: 'Buenos Aires',
      country: 'Argentina',
      additionalInfo: 'Piso 3, Dpto B'
    },
    {
      id: 2,
      addressLine: 'Calle Florida',
      number: '567',
      postalCode: '1005',
      city: 'Buenos Aires',
      state: 'Buenos Aires',
      country: 'Argentina'
    }
  ];
  
  constructor(private http: HttpClient) { }
  
  getUserProfile(): Observable<User> {
    if (this.isDevelopment) {
      // Obtener email del localStorage (si hay un token JWT)
      let email = 'usuario@example.com';
      let firstName = 'Usuario';
      let lastName = 'Demo';
      let role = 'CUSTOMER';
      
      try {
        const token = localStorage.getItem('token');
        if (token) {
          // Extraer la parte del payload
          const payload = token.split('.')[1];
          // Decodificar el Base64
          const decodedPayload = JSON.parse(atob(payload));
          
          email = decodedPayload.email || email;
          firstName = decodedPayload.firstName || firstName;
          lastName = decodedPayload.lastName || lastName;
          role = decodedPayload.roles || role;
        }
      } catch (error) {
        console.error('Error al decodificar el token', error);
      }
      
      // Crear un usuario simulado
      const mockUser: User = {
        id: '1',
        email: email,
        firstName: firstName,
        lastName: lastName,
        role: role
      };
      
      return of(mockUser).pipe(delay(300)); // Simular latencia
    } else {
      return this.http.get<User>(`${environment.apiUrl}/users/me`);
    }
  }
  
  updateUserProfile(userData: any): Observable<User> {
    if (this.isDevelopment) {
      // Simular actualización exitosa
      return of({
        id: '1',
        email: userData.email,
        firstName: userData.firstName,
        lastName: userData.lastName,
        role: 'CUSTOMER'
      }).pipe(delay(500));
    } else {
      return this.http.put<User>(`${environment.apiUrl}/users/me`, userData);
    }
  }
  
  changePassword(passwordData: { currentPassword: string, newPassword: string }): Observable<any> {
    if (this.isDevelopment) {
      // Simular cambio de contraseña exitoso
      return of({ success: true }).pipe(delay(700));
    } else {
      return this.http.post<any>(`${environment.apiUrl}/users/change-password`, passwordData);
    }
  }
  
  getUserAddresses(): Observable<Address[]> {
    if (this.isDevelopment) {
      return of(this.mockAddresses).pipe(delay(400));
    } else {
      return this.http.get<Address[]>(`${environment.apiUrl}/users/addresses`);
    }
  }
  
  addAddress(address: AddressRequest): Observable<Address> {
    if (this.isDevelopment) {
      // Crear una nueva dirección simulada
      const newAddress: Address = {
        id: this.mockAddresses.length + 1,
        addressLine: address.addressLine,
        number: address.number,
        postalCode: address.postalCode,
        city: address.city,
        state: 'Estado ' + address.stateId, // Simulado
        country: 'País ' + address.countryId, // Simulado
        additionalInfo: address.additionalInfo
      };
      
      // Añadir a la lista de direcciones simuladas
      this.mockAddresses.push(newAddress);
      
      return of(newAddress).pipe(delay(500));
    } else {
      return this.http.post<Address>(`${environment.apiUrl}/users/addresses`, address);
    }
  }
  
  updateAddress(id: number, address: AddressRequest): Observable<Address> {
    if (this.isDevelopment) {
      // Buscar la dirección a actualizar
      const index = this.mockAddresses.findIndex(a => a.id === id);
      
      if (index !== -1) {
        // Actualizar los datos
        const updatedAddress: Address = {
          id: id,
          addressLine: address.addressLine,
          number: address.number,
          postalCode: address.postalCode,
          city: address.city,
          state: 'Estado ' + address.stateId, // Simulado
          country: 'País ' + address.countryId, // Simulado
          additionalInfo: address.additionalInfo
        };
        
        // Reemplazar en el array
        this.mockAddresses[index] = updatedAddress;
        
        return of(updatedAddress).pipe(delay(500));
      } else {
        throw new Error('Dirección no encontrada');
      }
    } else {
      return this.http.put<Address>(`${environment.apiUrl}/users/addresses/${id}`, address);
    }
  }
  
  deleteAddress(id: number): Observable<any> {
    if (this.isDevelopment) {
      // Eliminar la dirección del array simulado
      this.mockAddresses = this.mockAddresses.filter(a => a.id !== id);
      
      return of({ success: true }).pipe(delay(400));
    } else {
      return this.http.delete<any>(`${environment.apiUrl}/users/addresses/${id}`);
    }
  }
}