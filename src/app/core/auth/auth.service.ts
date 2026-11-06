import { computed, inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { map, Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { LoginRequest, LoginResponse, Permiso, Sesion } from './auth.models';

const SESSION_KEY = 'pharmasoft.session';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);
  private readonly sesionActual = signal<Sesion | null>(this.leerSesionGuardada());
  private temporizador: ReturnType<typeof setTimeout> | undefined;

  readonly sesion = this.sesionActual.asReadonly();
  readonly autenticado = computed(() => this.sesionActual() !== null);
  readonly token = computed(() => this.sesionActual()?.token ?? null);

  constructor() {
    const sesion = this.sesionActual();
    if (sesion) {
      this.programarExpiracion(sesion);
    }
  }

  login(credenciales: LoginRequest): Observable<Sesion> {
    return this.http
      .post<LoginResponse>(`${environment.apiUrl}/auth/login`, credenciales)
      .pipe(
        map(respuesta => ({
          token: respuesta.token,
          expiraEn: Date.now() + respuesta.expiraEnSegundos * 1000,
          username: respuesta.username,
          nombreCompleto: respuesta.nombreCompleto,
          roles: respuesta.roles,
          permisos: respuesta.permisos,
        })),
        tap(sesion => this.iniciarSesion(sesion)),
      );
  }

  tienePermiso(permiso: Permiso): boolean {
    return this.sesionActual()?.permisos.includes(permiso) ?? false;
  }

  cerrarSesion(expirada = false, urlActual?: string): void {
    this.limpiarSesion();
    const destinoAnterior = urlActual ?? (expirada ? this.router.url : null);
    const returnUrl =
      destinoAnterior && this.esRutaInterna(destinoAnterior) && destinoAnterior !== '/login'
        ? destinoAnterior
        : null;
    void this.router.navigate(['/login'], {
      queryParams: {
        ...(returnUrl ? { returnUrl } : {}),
        ...(expirada ? { expirado: '1' } : {}),
      },
    });
  }

  private iniciarSesion(sesion: Sesion): void {
    this.limpiarTemporizador();
    this.sesionActual.set(sesion);
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(sesion));
    this.programarExpiracion(sesion);
  }

  private leerSesionGuardada(): Sesion | null {
    const texto = sessionStorage.getItem(SESSION_KEY);
    if (!texto) {
      return null;
    }

    try {
      const sesion: unknown = JSON.parse(texto);
      if (!this.esSesion(sesion) || Date.now() >= sesion.expiraEn) {
        sessionStorage.removeItem(SESSION_KEY);
        return null;
      }
      return sesion;
    } catch {
      sessionStorage.removeItem(SESSION_KEY);
      return null;
    }
  }

  private esSesion(valor: unknown): valor is Sesion {
    if (!valor || typeof valor !== 'object') {
      return false;
    }
    const sesion = valor as Partial<Sesion>;
    return (
      typeof sesion.token === 'string' &&
      typeof sesion.expiraEn === 'number' &&
      typeof sesion.username === 'string' &&
      typeof sesion.nombreCompleto === 'string' &&
      Array.isArray(sesion.roles) &&
      Array.isArray(sesion.permisos)
    );
  }

  private programarExpiracion(sesion: Sesion): void {
    this.limpiarTemporizador();
    const restante = sesion.expiraEn - Date.now();
    if (restante <= 0) {
      this.cerrarSesion(true);
      return;
    }
    this.temporizador = setTimeout(
      () => this.cerrarSesion(true),
      Math.min(restante, 2_147_000_000),
    );
  }

  private limpiarSesion(): void {
    this.limpiarTemporizador();
    this.sesionActual.set(null);
    sessionStorage.removeItem(SESSION_KEY);
  }

  private limpiarTemporizador(): void {
    if (this.temporizador !== undefined) {
      clearTimeout(this.temporizador);
      this.temporizador = undefined;
    }
  }

  private esRutaInterna(url: string): boolean {
    return url.startsWith('/') && !url.startsWith('//');
  }
}
