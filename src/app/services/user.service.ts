import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { User } from '../models/user/user.model';
import { API_URL_TOKEN } from '../config/api.config';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private url = inject(API_URL_TOKEN)
  private apiUrl = `${this.url}/User`
  constructor(private http: HttpClient) { }

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.apiUrl).pipe(
      map((users: any[]) => users.map(user => this.mapToUser(user)))
    );
  }

  getUserById(userId: number): Observable<any> { // Modifier le type de retour pour inclure les plantes
    return this.http.get<User>(`${this.apiUrl}/${userId}`).pipe(
      map((user: User) => this.mapToUser(user))
    );
  }

  createUser(user: any): Observable<User> { // Modifier le type de paramètre pour inclure les plantes
    return this.http.post<User>(`${this.apiUrl}/CreateUser`, user);
  }

  updateUser(userId: number, user: any): Observable<void> { // Modifier le type de paramètre pour inclure les plantes
    return this.http.put<void>(`${this.apiUrl}/${userId}`, user);
  }

  deleteUser(userId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${userId}`);
  }

  getDepartments(): Observable<any[]> { // Ajouter cette méthode
    return this.http.get<any[]>(`${this.url}/Departments`);
  }

  getPlants(): Observable<any[]> { // Ajouter cette méthode
    return this.http.get<any[]>(`${this.url}/plants`);
  }

  private mapToUser(user: any): User {
    return {
      userId: user.userId,
      teId: user.teId,
      userName: user.userName,
      email: user.email,
      nPlus1: user.nPlus1,
      backUp: user.backUp,
      role: user.role,
      departementId: user.departementId,
      plantsIds: user.userPlants.map((plant: any) => plant.id_plant),
      shipPointsIds: user.userShipPoints.map((shipPoint: any) => shipPoint.id_ship)
  }}
}
