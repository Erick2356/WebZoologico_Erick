import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class AnimalService {
  private apiUri = '/api/animals'; // UNA sola base
  private httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  };

  constructor(private http: HttpClient) { }

  // Obtener todos los animales
  getAllAnimalsData(): Observable<any> {
    return this.http.get<any>(this.apiUri);
  }

  // Crear un nuevo animal
  newAnimal(data: any): Observable<any> {
    return this.http.post<any>(this.apiUri, data, this.httpOptions);
  }

  // Obtener un solo animal por ID
  getOneAnimal(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUri}/${id}`);
  }

  // Actualizar un animal
  updateAnimal(id: string, data: any): Observable<any> {
    return this.http.put<any>(`${this.apiUri}/${id}`, data, this.httpOptions);
  }

  // Eliminar un animal
  deleteAnimal(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUri}/${id}`);
  }
}
