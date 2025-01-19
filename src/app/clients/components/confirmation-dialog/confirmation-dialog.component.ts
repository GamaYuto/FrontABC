import { CommonModule } from '@angular/common'; // Importa el módulo común de Angular
import { Component, inject } from '@angular/core'; // Importa los elementos necesarios para el componente y la inyección de dependencias
import { MatButtonModule } from '@angular/material/button'; // Importa el módulo de botones de Angular Material
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog'; // Importa los módulos de diálogo de Angular Material

@Component({
  selector: 'app-confirmation-dialog', // Define el selector para este componente
  imports: [CommonModule, MatDialogModule, MatButtonModule], // Define los módulos que se usan en este componente
  templateUrl: './confirmation-dialog.component.html', // Especifica la plantilla HTML para este componente
  styleUrl: './confirmation-dialog.component.css' // Especifica el archivo CSS para los estilos del componente
})
export class ConfirmationDialogComponent {

  // Inyecta el MatDialogRef para manejar el cierre del diálogo
  readonly dialogRef = inject(MatDialogRef<ConfirmationDialogComponent>); 

  /**
   * Método llamado cuando el usuario cancela la acción.
   * Cierra el diálogo y devuelve 'false'.
   */
  onCancel(): void {
    this.dialogRef.close(false); // Cierra el diálogo pasando 'false' como resultado
  }

  /**
   * Método llamado cuando el usuario confirma la acción.
   * Cierra el diálogo y devuelve 'true'.
   */
  onConfirm(): void {
    this.dialogRef.close(true); // Cierra el diálogo pasando 'true' como resultado
  }

}
