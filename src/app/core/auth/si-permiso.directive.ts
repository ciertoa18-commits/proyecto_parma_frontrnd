import { Directive, effect, inject, input, TemplateRef, ViewContainerRef } from '@angular/core';
import { AuthService } from './auth.service';
import { Permiso } from './auth.models';

@Directive({
  selector: '[appSiPermiso]',
  standalone: true,
})
export class SiPermisoDirective {
  readonly appSiPermiso = input.required<Permiso>();

  private readonly auth = inject(AuthService);
  private readonly template = inject(TemplateRef<unknown>);
  private readonly viewContainer = inject(ViewContainerRef);
  private visible = false;

  constructor() {
    effect(() => {
      const permitido = this.auth.tienePermiso(this.appSiPermiso());
      if (permitido && !this.visible) {
        this.viewContainer.createEmbeddedView(this.template);
        this.visible = true;
      } else if (!permitido && this.visible) {
        this.viewContainer.clear();
        this.visible = false;
      }
    });
  }
}
