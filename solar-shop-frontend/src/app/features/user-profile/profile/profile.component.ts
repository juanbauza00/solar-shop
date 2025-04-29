import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../core/auth/auth.service';
import { UserService } from '../../../shared/services/user.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private userService = inject(UserService);
  
  profileForm: FormGroup;
  passwordForm: FormGroup;
  
  profileSubmitted = false;
  passwordSubmitted = false;
  
  profileLoading = false;
  passwordLoading = false;
  
  profileError = '';
  passwordError = '';
  
  profileSuccess = '';
  passwordSuccess = '';
  
  constructor() {
    const user = this.authService.currentUser();
    
    this.profileForm = this.fb.group({
      firstName: [user?.firstName || '', Validators.required],
      lastName: [user?.lastName || '', Validators.required],
      email: [user?.email || '', [Validators.required, Validators.email]],
      phone: ['']
    });
    
    this.passwordForm = this.fb.group({
      currentPassword: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', Validators.required]
    }, {
      validators: this.passwordMatchValidator
    });
  }
  
  get pf() { return this.profileForm.controls; }
  get pwf() { return this.passwordForm.controls; }
  
  passwordMatchValidator(formGroup: FormGroup) {
    const newPassword = formGroup.get('newPassword')?.value;
    const confirmPassword = formGroup.get('confirmPassword')?.value;
    
    if (newPassword === confirmPassword) return null;
    
    return { passwordMismatch: true };
  }
  
  onProfileSubmit(): void {
    this.profileSubmitted = true;
    
    if (this.profileForm.invalid) {
      return;
    }
    
    this.profileLoading = true;
    this.profileError = '';
    this.profileSuccess = '';
    
    // En una aplicación real, enviaríamos los datos al backend
    // Por ahora, simulamos una actualización exitosa
    setTimeout(() => {
      this.profileSuccess = 'Perfil actualizado con éxito';
      this.profileLoading = false;
    }, 1000);
  }
  
  onPasswordSubmit(): void {
    this.passwordSubmitted = true;
    
    if (this.passwordForm.invalid) {
      return;
    }
    
    this.passwordLoading = true;
    this.passwordError = '';
    this.passwordSuccess = '';
    
    // En una aplicación real, enviaríamos los datos al backend
    // Por ahora, simulamos una actualización exitosa
    setTimeout(() => {
      this.passwordSuccess = 'Contraseña actualizada con éxito';
      this.passwordLoading = false;
      this.passwordForm.reset();
      this.passwordSubmitted = false;
    }, 1000);
  }
}