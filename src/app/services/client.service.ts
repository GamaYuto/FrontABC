import { HttpClient } from '@angular/common/http'; // Importa HttpClient para realizar las peticiones HTTP
import { inject, Injectable } from '@angular/core'; // Importa el decorador Injectable y la función inject de Angular
import { enviroments } from '../enviroments/enviroments'; // Importa la configuración de la URL de la API
import { Observable } from 'rxjs'; // Importa Observable para manejar las respuestas asincrónicas
import { Client } from '../clients/interfaces/client'; // Importa la interfaz Client que define los datos de un cliente

@Injectable({
  providedIn: 'root' // Declara este servicio como un singleton en toda la aplicación
})
export class ClientService {

  // Inyección de dependencias
  private http = inject(HttpClient); // Inyecta HttpClient para realizar solicitudes HTTP
  private apiUrl = enviroments.apiUrl; // Asigna la URL base de la API desde la configuración del entorno

  /**
   * Obtiene la lista de todos los clientes.
   * @returns Observable con un array de objetos Client.
   */
  getclient(): Observable<Client[]> {
    return this.http.get<Client[]>(this.apiUrl); // Realiza una solicitud GET a la API
  }

  /**
   * Obtiene un cliente por su ID.
   * @param id El ID del cliente que se desea obtener.
   * @returns Observable con un objeto Client.
   */
  getClientById(id: number): Observable<Client> {
    return this.http.get<Client>(`${this.apiUrl}/${id}`); // Realiza una solicitud GET con el ID del cliente
  }

  /**
   * Crea un nuevo cliente.
   * @param client Objeto cliente que se desea crear, parcialmente definido.
   * @returns Observable con el objeto Client creado.
   */
  createClient(client: Partial<Client>): Observable<Client> {
    return this.http.post<Client>(this.apiUrl, client); // Realiza una solicitud POST para crear un nuevo cliente
  }

  /**
   * Actualiza un cliente existente.
   * @param id El ID del cliente que se desea actualizar.
   * @param client El objeto cliente con los datos actualizados.
   * @returns Observable con el cliente actualizado.
   */
  updateClient(id: number, client: Partial<Client>): Observable<Client> {
    return this.http.put<Client>(`${this.apiUrl}/${id}`, client); // Realiza una solicitud PUT para actualizar un cliente
  }

  /**
   * Elimina un cliente por su ID.
   * @param id El ID del cliente que se desea eliminar.
   * @returns Observable vacío si la eliminación es exitosa.
   */
  deleteClient(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`); // Realiza una solicitud DELETE para eliminar un cliente
  }


}
