import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class AnimalService {
  apiUriGet = '/api/animalsall';    // ← CAMBIA A ESTA RUTA que trae TODOS
  apiUriPost = '/api/animal';

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(private http: HttpClient) { }

  getAllAnimalsData(): Observable<any> {
    return this.http.get<any>(this.apiUriGet);  // Ahora usará /api/animalsall
  }

  newAnimal(data: any): Observable<any> {
    return this.http.post<any>(this.apiUriPost, data, this.httpOptions);
  }
}