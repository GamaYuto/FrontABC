import { Component, Inject, inject, OnInit, signal, ViewChild, WritableSignal } from '@angular/core'; // Importa las clases y módulos necesarios
import { ClientService } from '../../../services/client.service'; // Importa el servicio para manejar las operaciones con clientes
import { Client } from '../../interfaces/client'; // Importa la interfaz que define la estructura de un cliente
import { Router } from '@angular/router'; // Importa el enrutador de Angular para navegación

// Material
import { MatButtonModule } from '@angular/material/button'; // Importa el módulo para botones de Angular Material
import { MatTableDataSource, MatTableModule } from '@angular/material/table'; // Importa módulos para mostrar tablas
import { CommonModule } from '@angular/common'; // Módulo común de Angular
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator'; // Importa el módulo de paginador de Angular Material
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component'; // Importa el componente de diálogo de confirmación
import { MatDialog } from '@angular/material/dialog'; // Importa el módulo de diálogos de Angular Material
import { MatIconModule } from '@angular/material/icon'; // Importa el módulo para íconos de Angular Material

@Component({
  selector: 'app-client-list', // El selector para este componente
  imports: [MatButtonModule, CommonModule, MatPaginatorModule, MatTableModule, MatIconModule], // Módulos de Angular Material a usar en el componente
  templateUrl: './client-list.component.html', // Archivo HTML para la plantilla del componente
  styleUrl: './client-list.component.css' // Archivo de estilo CSS para este componente
})
export class ClientListComponent implements OnInit { // Define el componente
  private dialog = inject(MatDialog) // Inyección del servicio de diálogo de Angular Material
  private router = inject(Router); // Inyección del servicio Router para navegación
  private ClientService = inject(ClientService); // Inyección del servicio ClientService para obtener y manipular los datos de clientes
  @ViewChild(MatPaginator) paginator!: MatPaginator; // Referencia al paginador de la tabla
  clients: WritableSignal<Client[]> = signal<Client[]>([]); // Declaración de la señal para almacenar la lista de clientes

  displayedColumns: string[] = [ // Define las columnas que se mostrarán en la tabla
    'id', 
    'numeroidentificacion', 
    'primernombre', 
    'segundonombre', 
    'primerapellido', 
    'segundoapellido', 
    'telefono', 
    'email', 
    'fechanacimiento', 
    'valorestimado', 
    'observaciones',
    'acciones'
  ];

  dataSource = new MatTableDataSource<Client>([]); // Configura el origen de los datos de la tabla

  ngOnInit(): void { // Método que se ejecuta al inicializar el componente
    this.loaderClient(); // Carga los datos de los clientes
  }

  loaderClient() { // Método para cargar los clientes desde el servicio
    this.ClientService.getclient().subscribe({
      next: (clients) => { // Si la solicitud es exitosa
        this.clients.set(clients); // Actualiza la lista de clientes
        this.updateDataTable(); // Actualiza la tabla con los nuevos datos
      }
    })
  }

  updateDataTable() { // Método para actualizar la tabla con los clientes
    this.dataSource.data = this.clients(); // Asigna los clientes al origen de datos de la tabla
    this.dataSource.paginator = this.paginator; // Asocia el paginador a la tabla
  }

  navigateToForm(id?: number | null) { // Método para navegar al formulario de edición o nuevo cliente
    const path = id ? `/clients/edit/${id}` : `/clients/new`; // Define la ruta dependiendo si es editar o nuevo
    this.router.navigate([path]); // Navega a la ruta generada
    console.log(path); // Imprime la ruta para depuración
  }

  deleteClient(id: number) { // Método para eliminar un cliente
    const dialogRef = this.dialog.open(ConfirmationDialogComponent); // Abre un diálogo de confirmación
    dialogRef.afterClosed().subscribe((result) => { // Espera el resultado del diálogo
      if (result) { // Si el usuario confirma la eliminación
        this.ClientService.deleteClient(id).subscribe(() => { // Llama al servicio para eliminar el cliente
          const updateDataTable = this.clients().filter((client) => client.id !== id); // Filtra la lista para eliminar al cliente
          this.clients.set(updateDataTable); // Actualiza la lista de clientes
          this.updateDataTable(); // Actualiza la tabla
        })
      }
    })
  }
}
