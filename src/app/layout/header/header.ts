import { Component, inject, output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../core/auth/auth.service';

@Component({
  selector: 'app-header',
  imports: [RouterLink],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
  readonly toggleMenu = output<void>();
  protected readonly auth = inject(AuthService);

  cerrarSesion(): void {
    this.auth.cerrarSesion();
  }
}
