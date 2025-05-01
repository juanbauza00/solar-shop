import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/auth/auth.service';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  
  loginForm: FormGroup;
  loading = false;
  submitted = false;
  error = '';
  
  constructor() {
    // Si el usuario ya está autenticado, redirigir a la página principal
    if (this.authService.isAuthenticated()) {
      console.log('Usuario ya autenticado, redirigiendo...');
      this.redirectToReturnUrl();
    }
    
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }
  
  get f() { return this.loginForm.controls; }
  
  onSubmit(): void {
    this.submitted = true;
    console.log('Login form submitted');
    
    if (this.loginForm.invalid) {
      console.log('Form is invalid');
      return;
    }
    
    this.loading = true;
    this.error = '';
    
    const { email, password } = this.loginForm.value;
    console.log('Attempting login with email:', email);
    
    this.authService.login(email, password).subscribe({
      next: () => {
        console.log('Login successful');
        this.redirectToReturnUrl();
      },
      error: (err) => {
        this.error = err?.message || 'Error al iniciar sesión. Verifique sus credenciales.';
        this.loading = false;
        console.error('Login error:', err);
      },
      complete: () => {
        this.loading = false;
      }
    });
  }
  
  private redirectToReturnUrl(): void {
    // Obtener la URL de retorno de los parámetros de consulta o usar la raíz
    const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
    console.log('Redirecting to:', returnUrl);
    this.router.navigateByUrl(returnUrl);
  }
}