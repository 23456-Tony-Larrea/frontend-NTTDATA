import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { apiUrl } from '../url/url';
import { Product } from '../models/Product';

@Injectable({
  providedIn: 'root'
})
export class ProductoService {
  constructor(private http: HttpClient) { }

  getProducts(): Observable<{ data: Product[] }> {
    return this.http.get<{ data: Product[] }>(apiUrl);
  }

  verificarProducto(id: string): Observable<any> {
    return this.http.get(`${apiUrl}/verification/${id}`);
  }

  agregarProducto(producto: any): Observable<any> {
    return this.http.post(`${apiUrl}`, producto);
  }

  actualizarProducto(id: string, producto: any): Observable<any> {
    return this.http.put(`${apiUrl}/${id}`, producto);
  }

  eliminarProducto(id: string): Observable<any> {
    return this.http.delete(`${apiUrl}/${id}`);
  }

  verificarId(id: string): Observable<boolean> {
    return this.http.get<boolean>(`${apiUrl}/verification/${id}`);
  }
}