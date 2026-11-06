import { Routes } from '@angular/router';
import { VentaDetalle } from './pages/venta-detalle/venta-detalle';
import { VentaForm } from './pages/venta-form/venta-form';
import { VentaList } from './pages/venta-list/venta-list';
import { permisoGuard } from '../../core/auth/auth.guards';

export const VENTAS_ROUTES: Routes = [
  { path: '', component: VentaList, title: 'Consulta de ventas', canActivate: [permisoGuard], data: { permiso: 'VENTAS_LEER' } },
  { path: 'nueva', component: VentaForm, title: 'Nueva venta', canActivate: [permisoGuard], data: { permiso: 'VENTAS_REGISTRAR' } },
  { path: ':id', component: VentaDetalle, title: 'Comprobante de venta', canActivate: [permisoGuard], data: { permiso: 'VENTAS_LEER' } },
];
