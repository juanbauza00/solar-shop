import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.css'
})
export class ForgotPasswordComponent {
  private fb = inject(FormBuilder);
  
  forgotPasswordForm: FormGroup;
  loading = false;
  submitted = false;
  error = '';
  success = '';
  
  constructor() {
    this.forgotPasswordForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }
  
  get f() { return this.forgotPasswordForm.controls; }
  
  onSubmit(): void {
    this.submitted = true;
    
    if (this.forgotPasswordForm.invalid) {
      return;
    }
    
    this.loading = true;
    this.error = '';
    this.success = '';
    
    // En una aplicación real, enviaríamos la solicitud a un servicio
    // Por ahora, simulamos una respuesta exitosa
    setTimeout(() => {
      this.success = 'Se han enviado las instrucciones para restablecer tu contraseña a tu correo electrónico.';
      this.loading = false;
    }, 1500);
  }
}