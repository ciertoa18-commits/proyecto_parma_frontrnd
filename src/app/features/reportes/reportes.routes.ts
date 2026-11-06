import { Routes } from '@angular/router';
import { VentasCategoria } from './pages/ventas-categoria/ventas-categoria';
import { permisoGuard } from '../../core/auth/auth.guards';

export const REPORTES_ROUTES: Routes = [
  { path: 'ventas-por-categoria', component: VentasCategoria, title: 'Ventas por categoría', canActivate: [permisoGuard], data: { permiso: 'REPORTES_VER' } },
];
