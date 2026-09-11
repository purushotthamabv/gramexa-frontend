import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

export interface AdminRestaurant { restaurantId: string; restaurantName: string; currency: string; imageUrl?: string; products: any[]; }
export interface AdminUser { id:number; name:string; email:string; mobileNumber:string; role:string; approved:boolean; createdAt:string; }

@Injectable({providedIn:'root'})
export class AdminService {
  private api = `${environment.apiUrl}/admin`;
  constructor(private http: HttpClient) {}
  restaurants(): Observable<AdminRestaurant[]> { return this.http.get<AdminRestaurant[]>(`${this.api}/restaurants`); }
  createRestaurant(value: any): Observable<AdminRestaurant> { return this.http.post<AdminRestaurant>(`${this.api}/restaurants`, value); }
  items(id:string): Observable<any[]> { return this.http.get<any[]>(`${this.api}/restaurants/${id}/items`); }
  products(): Observable<any[]> { return this.http.get<any[]>(`${this.api}/products`); }
  addItem(id:string, productId:number): Observable<any> { return this.http.post(`${this.api}/restaurants/${id}/items`, {productId}); }
  removeItem(id:string, itemId:number) { return this.http.delete(`${this.api}/restaurants/${id}/items/${itemId}`); }
  users(): Observable<AdminUser[]> { return this.http.get<AdminUser[]>(`${this.api}/users`); }
  updateUser(id:number, user:Partial<AdminUser>) { return this.http.put<AdminUser>(`${this.api}/users/${id}`, user); }
  deleteUser(id:number) { return this.http.delete(`${this.api}/users/${id}`); }
  pendingAdmins(): Observable<any[]> { return this.http.get<any[]>(`${environment.apiUrl}/super-admin/pending-admins`); }
  approveAdmin(id:number) { return this.http.put(`${environment.apiUrl}/super-admin/approve-admin/${id}`, {}); }
}
