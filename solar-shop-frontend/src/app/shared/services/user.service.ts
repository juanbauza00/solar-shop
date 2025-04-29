import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { User } from '../../core/models/user.model';

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
  constructor(private http: HttpClient) { }
  
  getUserProfile(): Observable<User> {
    return this.http.get<User>(`${environment.apiUrl}/users/me`);
  }
  
  updateUserProfile(userData: any): Observable<User> {
    return this.http.put<User>(`${environment.apiUrl}/users/me`, userData);
  }
  
  changePassword(passwordData: { currentPassword: string, newPassword: string }): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}/users/change-password`, passwordData);
  }
  
  getUserAddresses(): Observable<Address[]> {
    return this.http.get<Address[]>(`${environment.apiUrl}/users/addresses`);
  }
  
  addAddress(address: AddressRequest): Observable<Address> {
    return this.http.post<Address>(`${environment.apiUrl}/users/addresses`, address);
  }
  
  updateAddress(id: number, address: AddressRequest): Observable<Address> {
    return this.http.put<Address>(`${environment.apiUrl}/users/addresses/${id}`, address);
  }
  
  deleteAddress(id: number): Observable<any> {
    return this.http.delete<any>(`${environment.apiUrl}/users/addresses/${id}`);
  }
}