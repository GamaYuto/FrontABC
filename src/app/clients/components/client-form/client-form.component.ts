import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';  // Asegúrate de importar MatInputModule
import { MatCardModule } from '@angular/material/card';    // Asegúrate de importar MatCardModule
import { CommonModule } from '@angular/common';            // Importa CommonModule para la funcionalidad básica
import { ClientService } from '../../../services/client.service';  // Servicio que maneja operaciones con clientes
import { ActivatedRoute, Router } from '@angular/router';  // Para navegar entre rutas y obtener parámetros de la URL
import { MatSnackBar } from '@angular/material/snack-bar';  // Para mostrar notificaciones tipo snackbar

@Component({
  selector: 'app-client-form',
  imports: [
    MatFormFieldModule,        // Módulo para los campos de formulario de Material
    MatInputModule,            // Módulo para los campos de entrada de Material
    ReactiveFormsModule,       // Módulo para usar formularios reactivos
    MatButtonModule,           // Módulo para los botones de Material
    MatCardModule,             // Módulo para tarjetas de Material
    CommonModule               // Módulo común de Angular para funcionalidades básicas
  ],
  templateUrl: './client-form.component.html',  // Ruta al archivo de plantilla HTML
  styleUrls: ['./client-form.component.css']    // Ruta al archivo de estilos CSS
})
export class ClientFormComponent {
  // Inyección de dependencias
  private clientService = inject(ClientService);  // Servicio para manejar la lógica de clientes
  private fb = inject(FormBuilder);              // Servicio para construir formularios reactivos
  public router = inject(Router);                // Servicio para manejar la navegación entre rutas
  private route = inject(ActivatedRoute);        // Servicio para acceder a los parámetros de la ruta actual
  private SnackBar = inject(MatSnackBar);        // Servicio para mostrar mensajes de tipo snackbar

  clientForm: FormGroup;      // El formulario reactivo que se utilizará en el componente
  isEditMode: boolean = false; // Bandera para verificar si estamos en modo edición o creación

  constructor() {
    // Inicialización del formulario con validaciones
    this.clientForm = this.fb.group({
      numeroidentificacion: ['', [Validators.required]], // Número de identificación requerido
      primernombre: ['', [Validators.required, Validators.minLength(2)]],  // Primer nombre, mínimo 2 caracteres
      segundonombre: [''],      // Segundo nombre no es obligatorio
      primerapellido: ['', [Validators.required, Validators.minLength(2)]],  // Primer apellido, mínimo 2 caracteres
      segundoapellido: [''],    // Segundo apellido no es obligatorio
      telefono: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],  // Teléfono, 10 dígitos
      email: ['', [Validators.required, Validators.email]],  // Email válido
      fechanacimiento: ['', [Validators.required]],  // Fecha de nacimiento requerida
      valorestimado: ['', [Validators.required, Validators.min(0)]],  // Valor estimado, debe ser mayor o igual a 0
      observaciones: [''],      // Observaciones no son obligatorias
    });

    // Revisa si el parámetro `id` está presente en la ruta
    this.route.params.subscribe((params) => {
      if (params['id']) {
        this.isEditMode = true;  // Establece que estamos en modo de edición
        const clientId = Number(params['id']); // Convierte el parámetro `id` a número
        if (!isNaN(clientId)) {
          this.loadClient(clientId);  // Carga los datos del cliente si el `id` es válido
        } else {
          console.error('Invalid client ID');  // Muestra un error si el `id` no es válido
        }
      }
    });
  }

  // Método para cargar los datos de un cliente en el formulario cuando estamos en modo edición
  private loadClient(id: number) {
    this.clientService.getClientById(id).subscribe({
      next: (client) => {
        if (client.fechanacimiento) {
          // Si la fecha de nacimiento está en formato Date, la transformamos a "yyyy-MM-dd"
          const formattedDate = new Date(client.fechanacimiento).toISOString().split('T')[0];
          client.fechanacimiento = formattedDate;
        }
        this.clientForm.patchValue(client);  // Rellena el formulario con los datos del cliente
      },
      error: (err) => {
        console.error(err);  // Muestra un error si no se pueden cargar los datos
      }
    });
  }

  // Método que se ejecuta cuando el formulario es enviado
  onSubmit() {
    // Verifica si el formulario es inválido y detiene la ejecución
    if (this.clientForm.invalid) return;

    // Obtiene los valores del formulario
    const clientData = { ...this.clientForm.value };

    // Verifica que la fecha esté en el formato adecuado antes de enviarla
    if (clientData.fechanacimiento) {
      clientData.fechanacimiento = new Date(clientData.fechanacimiento).toISOString().split('T')[0];
    }

    // Lógica para el modo de edición
    if (this.isEditMode) {
      this.clientService.updateClient(clientData.id, clientData).subscribe({
        next: () => {
          // Muestra un mensaje de éxito y navega a la página principal
          this.SnackBar.open('Product updated successfully!', 'Close', {
            duration: 3000,  // Duración del mensaje
          });
          this.router.navigate(['/']);  // Redirige al usuario a la página principal
        },
        error: (err) => {
          console.error(err);  // Muestra un error si la actualización falla
        },
      });
    } else {
      // Lógica para crear un nuevo cliente
      this.clientService.createClient(clientData).subscribe({
        next: () => {
          // Muestra un mensaje de éxito y navega a la página principal
          this.SnackBar.open('Product created successfully!', 'Close', {
            duration: 3000,  // Duración del mensaje
          });
          this.router.navigate(['/']);  // Redirige al usuario a la página principal
        },
        error: (err) => {
          console.error(err);  // Muestra un error si la creación falla
        },
      });
    }
  }
}
