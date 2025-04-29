import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AdminSidebarComponent } from '../shared/admin-sidebar/admin-sidebar.component';

interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  status: string;
  lastLogin: string;
}

@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, AdminSidebarComponent],
  templateUrl: './user-management.component.html',
  styleUrl: './user-management.component.css'
})
export class UserManagementComponent implements OnInit {
  users: User[] = [];
  filteredUsers: User[] = [];
  loading = false;
  error = '';
  
  // Filters
  searchTerm = '';
  roleFilter = '';
  statusFilter = '';
  
  // Mock data for demo
  mockUsers: User[] = [
    { id: 1, firstName: 'Juan', lastName: 'Pérez', email: 'juan.perez@example.com', role: 'ADMIN', status: 'ACTIVE', lastLogin: '2025-04-25T10:30:00' },
    { id: 2, firstName: 'María', lastName: 'López', email: 'maria.lopez@example.com', role: 'EMPLOYEE', status: 'ACTIVE', lastLogin: '2025-04-24T16:45:00' },
    { id: 3, firstName: 'Carlos', lastName: 'Rodríguez', email: 'carlos.rodriguez@example.com', role: 'CUSTOMER', status: 'ACTIVE', lastLogin: '2025-04-23T09:15:00' },
    { id: 4, firstName: 'Ana', lastName: 'Martínez', email: 'ana.martinez@example.com', role: 'CUSTOMER', status: 'INACTIVE', lastLogin: '2025-04-20T14:20:00' },
    { id: 5, firstName: 'Pedro', lastName: 'Gómez', email: 'pedro.gomez@example.com', role: 'CUSTOMER', status: 'ACTIVE', lastLogin: '2025-04-22T11:10:00' },
    { id: 6, firstName: 'Laura', lastName: 'Díaz', email: 'laura.diaz@example.com', role: 'EMPLOYEE', status: 'ACTIVE', lastLogin: '2025-04-21T13:40:00' },
    { id: 7, firstName: 'Javier', lastName: 'García', email: 'javier.garcia@example.com', role: 'CUSTOMER', status: 'LOCKED', lastLogin: '2025-04-15T10:50:00' },
    { id: 8, firstName: 'Sofía', lastName: 'Fernández', email: 'sofia.fernandez@example.com', role: 'CUSTOMER', status: 'ACTIVE', lastLogin: '2025-04-19T16:30:00' },
    { id: 9, firstName: 'Miguel', lastName: 'Torres', email: 'miguel.torres@example.com', role: 'CUSTOMER', status: 'ACTIVE', lastLogin: '2025-04-24T09:05:00' },
    { id: 10, firstName: 'Carmen', lastName: 'Sánchez', email: 'carmen.sanchez@example.com', role: 'CUSTOMER', status: 'INACTIVE', lastLogin: '2025-04-10T15:25:00' }
  ];
  
  ngOnInit(): void {
    // For demo purposes, using mock data
    this.users = this.mockUsers;
    this.filteredUsers = [...this.users];
    
    // In a real app, we would load users from a service
    /*
    this.loading = true;
    this.userService.getAllUsers().subscribe({
      next: (users) => {
        this.users = users;
        this.filteredUsers = [...this.users];
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Error al cargar los usuarios';
        this.loading = false;
        console.error(err);
      }
    });
    */
  }
  
  applyFilters(): void {
    let filtered = [...this.users];
    
    // Search term filter
    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(u => 
        u.firstName.toLowerCase().includes(term) || 
        u.lastName.toLowerCase().includes(term) || 
        u.email.toLowerCase().includes(term)
      );
    }
    
    // Role filter
    if (this.roleFilter) {
      filtered = filtered.filter(u => u.role === this.roleFilter);
    }
    
    // Status filter
    if (this.statusFilter) {
      filtered = filtered.filter(u => u.status === this.statusFilter);
    }
    
    this.filteredUsers = filtered;
  }
  
  resetFilters(): void {
    this.searchTerm = '';
    this.roleFilter = '';
    this.statusFilter = '';
    this.filteredUsers = [...this.users];
  }
  
  getStatusClass(status: string): string {
    switch (status) {
      case 'ACTIVE': return 'bg-success';
      case 'INACTIVE': return 'bg-secondary';
      case 'LOCKED': return 'bg-danger';
      default: return 'bg-secondary';
    }
  }
  
  updateUserStatus(userId: number, newStatus: string): void {
    // In a real app, we would call a service to update the user status
    const userIndex = this.users.findIndex(u => u.id === userId);
    if (userIndex !== -1) {
      this.users[userIndex].status = newStatus;
      this.applyFilters();
    }
  }
  
  deleteUser(userId: number): void {
    if (confirm('¿Está seguro que desea eliminar este usuario?')) {
      // In a real app, we would call a service to delete the user
      this.users = this.users.filter(u => u.id !== userId);
      this.applyFilters();
    }
  }
}