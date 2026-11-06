import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-acceso-denegado',
  imports: [RouterLink],
  template: `
    <section class="page">
      <p class="eyebrow">403 · Acceso denegado</p>
      <h2>No tienes permiso para ver esta sección.</h2>
      <p>Tu sesión sigue activa. Si necesitas acceder, solicita los permisos a un administrador.</p>
      <a routerLink="/inicio" class="btn btn-primary">Volver al inicio</a>
    </section>
  `,
})
export class AccesoDenegado {}
