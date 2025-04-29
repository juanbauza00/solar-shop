import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { UserService, Address } from '../../../shared/services/user.service';

@Component({
  selector: 'app-addresses',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule],
  templateUrl: './addresses.component.html',
  styleUrl: './addresses.component.css'
})
export class AddressesComponent implements OnInit {
  private fb = inject(FormBuilder);
  private userService = inject(UserService);
  
  addresses: Address[] = [];
  addressForm: FormGroup;
  
  loading = false;
  submitting = false;
  error = '';
  success = '';
  
  editingAddress: Address | null = null;
  showForm = false;
  
  constructor() {
    this.addressForm = this.fb.group({
      addressLine: ['', Validators.required],
      number: [''],
      postalCode: ['', Validators.required],
      city: ['', Validators.required],
      stateId: ['', Validators.required],
      countryId: ['', Validators.required],
      additionalInfo: ['']
    });
  }
  
  ngOnInit(): void {
    this.loadAddresses();
  }
  
  loadAddresses(): void {
    this.loading = true;
    this.userService.getUserAddresses().subscribe({
      next: (addresses) => {
        this.addresses = addresses;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Error al cargar las direcciones';
        this.loading = false;
        console.error(err);
      }
    });
  }
  
  openAddressForm(address?: Address): void {
    this.editingAddress = address || null;
    this.showForm = true;
    
    if (address) {
      this.addressForm.patchValue({
        addressLine: address.addressLine,
        number: address.number,
        postalCode: address.postalCode,
        city: address.city,
        stateId: 1, // In a real app, you'd map this from state name to ID
        countryId: 1, // In a real app, you'd map this from country name to ID
        additionalInfo: address.additionalInfo
      });
    } else {
      this.addressForm.reset();
    }
  }
  
  cancelEdit(): void {
    this.showForm = false;
    this.editingAddress = null;
    this.addressForm.reset();
  }
  
  saveAddress(): void {
    if (this.addressForm.invalid) {
      this.addressForm.markAllAsTouched();
      return;
    }
    
    this.submitting = true;
    this.error = '';
    this.success = '';
    
    const addressData = this.addressForm.value;
    
    if (this.editingAddress) {
      this.userService.updateAddress(this.editingAddress.id, addressData).subscribe({
        next: () => {
          this.success = 'Dirección actualizada con éxito';
          this.submitting = false;
          this.showForm = false;
          this.loadAddresses();
        },
        error: (err) => {
          this.error = err?.message || 'Error al actualizar la dirección';
          this.submitting = false;
        }
      });
    } else {
      this.userService.addAddress(addressData).subscribe({
        next: () => {
          this.success = 'Dirección agregada con éxito';
          this.submitting = false;
          this.showForm = false;
          this.loadAddresses();
        },
        error: (err) => {
          this.error = err?.message || 'Error al agregar la dirección';
          this.submitting = false;
        }
      });
    }
  }
  
  deleteAddress(id: number): void {
    if (confirm('¿Está seguro que desea eliminar esta dirección?')) {
      this.userService.deleteAddress(id).subscribe({
        next: () => {
          this.success = 'Dirección eliminada con éxito';
          this.loadAddresses();
        },
        error: (err) => {
          this.error = err?.message || 'Error al eliminar la dirección';
        }
      });
    }
  }
}