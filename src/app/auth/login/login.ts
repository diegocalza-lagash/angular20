// src/app/auth/login/login.ts
import { Component, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatSnackBarModule,
    RouterModule
  ],
  encapsulation: ViewEncapsulation.None,
  templateUrl: 'login.html',
  styleUrl: 'login.scss'
})
export class LoginComponent {
  loginForm: FormGroup;
  showUsernamePlaceholder = true;
  showPasswordPlaceholder = true;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });

    // Ocultar placeholders cuando hay valor
    this.loginForm.get('username')?.valueChanges.subscribe(value => {
      this.showUsernamePlaceholder = !value;
    });

    this.loginForm.get('password')?.valueChanges.subscribe(value => {
      this.showPasswordPlaceholder = !value;
    });
  }

  onFocus(field: string) {
    if (field === 'username') {
      this.showUsernamePlaceholder = false;
    } else if (field === 'password') {
      this.showPasswordPlaceholder = false;
    }
  }

  onBlur(field: string) {
    if (field === 'username') {
      this.showUsernamePlaceholder = !this.loginForm.get('username')?.value;
    } else if (field === 'password') {
      this.showPasswordPlaceholder = !this.loginForm.get('password')?.value;
    }
  }

  onSubmit() {
    if (this.loginForm.valid) {
      const { username, password } = this.loginForm.value;
      if (this.authService.login(username, password)) {
        this.router.navigate(['/dashboard/products']);
      } else {
        this.snackBar.open('Credenciales inválidas', 'Cerrar', {
          duration: 3000
        });
      }
    }
  }
}