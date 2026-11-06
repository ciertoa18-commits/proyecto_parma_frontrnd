import { Component, inject, input, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/auth/auth.service';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login implements OnInit {
  readonly returnUrl = input<string | undefined>();
  readonly expirado = input<string | undefined>();

  private readonly formBuilder = inject(FormBuilder);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  protected readonly enviando = signal(false);
  protected readonly error = signal('');
  protected readonly avisoExpiracion = signal(false);
  protected readonly form = this.formBuilder.nonNullable.group({
    username: ['', [Validators.required]],
    password: ['', [Validators.required]],
  });

  ngOnInit(): void {
    this.avisoExpiracion.set(this.expirado() === '1');
  }

  iniciarSesion(): void {
    if (this.form.invalid || this.enviando()) {
      this.form.markAllAsTouched();
      return;
    }

    this.error.set('');
    this.enviando.set(true);
    this.auth.login(this.form.getRawValue()).subscribe({
      next: () => {
        void this.router.navigateByUrl(this.destino());
      },
      error: (error: HttpErrorResponse) => {
        this.enviando.set(false);
        if (error.status === 0) {
          this.error.set('No se pudo conectar con el servidor. Verifica que el backend esté ejecutándose.');
        } else if (error.status === 401) {
          this.error.set('Usuario o contraseña incorrectos.');
        } else if (error.status === 403) {
          this.error.set(
            'El backend rechazó el origen de la solicitud. Abre PharmaSoft desde http://localhost:4200.',
          );
        } else {
          this.error.set(`No se pudo iniciar sesión (error ${error.status}). Inténtalo nuevamente.`);
        }
      },
      complete: () => this.enviando.set(false),
    });
  }

  private destino(): string {
    const url = this.returnUrl();
    return url && url.startsWith('/') && !url.startsWith('//') ? url : '/inicio';
  }
}
