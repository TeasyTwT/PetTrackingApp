import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Pet } from '../interfaces/pet.interface';

@Injectable({
  providedIn: 'root'
})
export class PetService {
  private readonly BASE_URL = `${environment.apiUrl}/pets`;

  constructor(private http: HttpClient) {}

  getUserPets(): Observable<Pet[]> {
    return this.http.get<Pet[]>(this.BASE_URL);
  }

  getPet(petId: number): Observable<Pet> {
    return this.http.get<Pet>(`${this.BASE_URL}/${petId}`);
  }

  addPet(pet: FormData): Observable<Pet> {
    return this.http.post<Pet>(this.BASE_URL, pet);
  }

  updatePet(petId: number, pet: Partial<Pet>): Observable<Pet> {
    return this.http.put<Pet>(`${this.BASE_URL}/${petId}`, pet);
  }

  deletePet(petId: number): Observable<void> {
    return this.http.delete<void>(`${this.BASE_URL}/${petId}`);
  }
}
