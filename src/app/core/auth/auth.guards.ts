import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';
import { Permiso } from './auth.models';

export const authGuard: CanActivateFn = (_route, state) => {
  if (inject(AuthService).autenticado()) {
    return true;
  }
  return inject(Router).createUrlTree(['/login'], {
    queryParams: { returnUrl: state.url },
  });
};

export const invitadoGuard: CanActivateFn = (_route, state) => {
  if (!inject(AuthService).autenticado()) {
    return true;
  }
  return inject(Router).parseUrl(validarReturnUrl(state.root.queryParams['returnUrl']));
};

export const permisoGuard: CanActivateFn = route => {
  const permiso = route.data['permiso'] as Permiso | undefined;
  if (!permiso || inject(AuthService).tienePermiso(permiso)) {
    return true;
  }
  return inject(Router).createUrlTree(['/acceso-denegado']);
};

function validarReturnUrl(value: unknown): string {
  return typeof value === 'string' && value.startsWith('/') && !value.startsWith('//')
    ? value
    : '/inicio';
}
