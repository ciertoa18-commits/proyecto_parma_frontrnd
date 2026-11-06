import { Routes } from '@angular/router';
import { ClienteForm } from './pages/cliente-form/cliente-form';
import { ClienteList } from './pages/cliente-list/cliente-list';
import { permisoGuard } from '../../core/auth/auth.guards';

export const CLIENTES_ROUTES: Routes = [
  { path: '', component: ClienteList, title: 'Clientes', canActivate: [permisoGuard], data: { permiso: 'CLIENTES_LEER' } },
  { path: 'nuevo', component: ClienteForm, title: 'Nuevo cliente', canActivate: [permisoGuard], data: { permiso: 'CLIENTES_ESCRIBIR' } },
  { path: ':id/editar', component: ClienteForm, title: 'Editar cliente', canActivate: [permisoGuard], data: { permiso: 'CLIENTES_ESCRIBIR' } },
];
