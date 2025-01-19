import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';  
import { MatCardModule } from '@angular/material/card';    
import { CommonModule } from '@angular/common';            
import { ClientService } from '../../../services/client.service';  
import { ActivatedRoute, Router } from '@angular/router';  
import { MatSnackBar } from '@angular/material/snack-bar';  

@Component({
  selector: 'app-client-form',
  imports: [
    MatFormFieldModule,        
    MatInputModule,            
    ReactiveFormsModule,       
    MatButtonModule,           
    MatCardModule,             
    CommonModule               
  ],
  templateUrl: './client-form.component.html',  
  styleUrls: ['./client-form.component.css']    
})
export class ClientFormComponent {
  private clientService = inject(ClientService);  
  private fb = inject(FormBuilder);              
  public router = inject(Router);                
  private route = inject(ActivatedRoute);        
  private SnackBar = inject(MatSnackBar);        

  clientForm: FormGroup;      
  isEditMode: boolean = false; 

  constructor() {
    this.clientForm = this.fb.group({
      numeroidentificacion: ['', [Validators.required]], 
      primernombre: ['', [Validators.required, Validators.minLength(2)]],  
      segundonombre: [''],      
      primerapellido: ['', [Validators.required, Validators.minLength(2)]],  
      segundoapellido: [''],    
      telefono: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],  
      email: ['', [Validators.required, Validators.email]],  
      fechanacimiento: ['', [Validators.required]],  
      valorestimado: ['', [Validators.required, Validators.min(0), Validators.max(9999999999)]],  // Validación de máximo 10 dígitos
      observaciones: [''],      
    });

    this.route.params.subscribe((params) => {
      if (params['id']) {
        this.isEditMode = true;
        const clientId = Number(params['id']);
        if (!isNaN(clientId)) {
          this.loadClient(clientId);
        } else {
          console.error('Invalid client ID');
        }
      }
    });
  }

  private loadClient(id: number) {
    this.clientService.getClientById(id).subscribe({
      next: (client) => {
        if (client.fechanacimiento) {
          const formattedDate = new Date(client.fechanacimiento).toISOString().split('T')[0];
          client.fechanacimiento = formattedDate;
        }
        this.clientForm.patchValue(client);
      },
      error: (err) => {
        console.error(err);
      }
    });
  }

  onSubmit() {
    if (this.clientForm.invalid) {
      Object.keys(this.clientForm.controls).forEach(field => {
        const control = this.clientForm.get(field);
        if (control?.invalid) {
          control?.markAsTouched();  // Marca los campos inválidos como tocados
        }
      });
      return;
    }

    const clientData = { ...this.clientForm.value };

    if (clientData.fechanacimiento) {
      clientData.fechanacimiento = new Date(clientData.fechanacimiento).toISOString().split('T')[0];
    }

    if (this.isEditMode) {
      this.clientService.updateClient(clientData.id, clientData).subscribe({
        next: () => {
          this.SnackBar.open('Cliente actualizado correctamente!', 'Cerrar', { duration: 3000 });
          this.router.navigate(['/']);
        },
        error: (err) => {
          console.error(err);
        },
      });
    } else {
      this.clientService.createClient(clientData).subscribe({
        next: () => {
          this.SnackBar.open('Cliente creado correctamente!', 'Cerrar', { duration: 3000 });
          this.router.navigate(['/']);
        },
        error: (err) => {
          console.error(err);
        },
      });
    }
  }
}
