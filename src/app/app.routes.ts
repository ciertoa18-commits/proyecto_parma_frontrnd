import { Routes } from '@angular/router';
import { MainLayout } from './layout/main-layout/main-layout';
import { authGuard, invitadoGuard } from './core/auth/auth.guards';

export const routes: Routes = [
	{
		path: 'login',
		title: 'Iniciar sesión',
		canActivate: [invitadoGuard],
		loadComponent: () => import('./features/auth/login/login').then(m => m.Login),
	},
	{
		path: '',
		component: MainLayout,
		canActivate: [authGuard],
		canActivateChild: [authGuard],
		children: [
			{ path: '', pathMatch: 'full', redirectTo: 'inicio' },
			{
				path: 'inicio',
				title: 'Inicio',
				loadComponent: () => import('./features/inicio/inicio').then(m => m.Inicio),
			},
			{
				path: 'categorias',
				loadChildren: () => import('./features/categorias/categorias.routes').then(m => m.CATEGORIAS_ROUTES),
			},
			{
				path: 'clientes',
				loadChildren: () => import('./features/clientes/clientes.routes').then(m => m.CLIENTES_ROUTES),
			},
			{
				path: 'productos',
				loadChildren: () => import('./features/productos/productos.routes').then(m => m.PRODUCTOS_ROUTES),
			},
			{
				path: 'ventas',
				loadChildren: () => import('./features/ventas/ventas.routes').then(m => m.VENTAS_ROUTES),
			},
			{
				path: 'reportes',
				loadChildren: () => import('./features/reportes/reportes.routes').then(m => m.REPORTES_ROUTES),
			},
			{
				path: 'acceso-denegado',
				title: 'Acceso denegado',
				loadComponent: () => import('./shared/pages/acceso-denegado/acceso-denegado').then(m => m.AccesoDenegado),
			},
		],
	},
	{
		path: '**',
		title: 'Página no encontrada',
		loadComponent: () => import('./shared/pages/no-encontrado/no-encontrado').then(m => m.NoEncontrado),
	},
];
