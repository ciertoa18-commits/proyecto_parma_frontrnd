import { HttpErrorResponse } from '@angular/common/http';
import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { mensajeError } from '../../../../core/utils/http-error';
import { SiPermisoDirective } from '../../../../core/auth/si-permiso.directive';
import { Cliente } from '../../models/cliente.model';
import { ClienteService } from '../../services/cliente-service';

@Component({
  selector: 'app-cliente-list',
  imports: [RouterLink, SiPermisoDirective],
  templateUrl: './cliente-list.html',
  styleUrl: './cliente-list.css',
})
export class ClienteList implements OnInit {
  private readonly clienteService = inject(ClienteService);

  protected readonly clientes = signal<Cliente[]>([]);
  protected readonly cargando = signal(false);
  protected readonly error = signal<string | null>(null);
  protected readonly clientePorEliminar = signal<Cliente | null>(null);
  protected readonly eliminando = signal(false);
  protected readonly filtro = signal('');

  protected readonly filtradas = computed(() => {
    const texto = this.filtro().trim().toLowerCase();
    return this.clientes().filter(cliente => {
      const textoCliente = [cliente.nombres, cliente.apellidos, cliente.dni, cliente.email]
        .join(' ')
        .toLowerCase();
      return textoCliente.includes(texto);
    });
  });

  ngOnInit(): void {
    this.cargar();
  }

  cargar(): void {
    this.cargando.set(true);
    this.error.set(null);
    this.clienteService.listar(0, 100).subscribe({
      next: pagina => {
        this.clientes.set(pagina.contenido);
        this.cargando.set(false);
      },
      error: (err: HttpErrorResponse) => {
        this.error.set(mensajeError(err));
        this.cargando.set(false);
      },
    });
  }

  eliminar(cliente: Cliente): void {
    this.error.set(null);
    this.clientePorEliminar.set(cliente);
  }

  cancelarEliminacion(): void {
    if (!this.eliminando()) {
      this.clientePorEliminar.set(null);
    }
  }

  confirmarEliminacion(): void {
    const cliente = this.clientePorEliminar();
    if (!cliente || this.eliminando()) return;

    this.eliminando.set(true);
    this.clienteService.eliminar(cliente.id).subscribe({
      next: () => {
        this.clientes.update(lista => lista.filter(item => item.id !== cliente.id));
        this.clientePorEliminar.set(null);
        this.eliminando.set(false);
      },
      error: (err: HttpErrorResponse) => {
        this.error.set(mensajeError(err));
        this.clientePorEliminar.set(null);
        this.eliminando.set(false);
      },
    });
  }
}
