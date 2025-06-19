import { Injectable } from '@angular/core';
import { environment } from "../../environments/environment";
import { HttpClient } from '@angular/common/http';
import { weight } from '../interfaces/weight.interface'
import { Observable, map } from 'rxjs';
import { Pet } from "../interfaces/pet.interface";

@Injectable({
  providedIn: 'root'
})
export class WeightService {
  private readonly BASE_URL = `${environment.apiUrl}/pets`;
  
  constructor(private http: HttpClient) { }

  getWeightsByPetId(petId: number): Observable<weight[]> {
    return this.http.get<weight[]>(`${this.BASE_URL}/${petId}/weights`);
  }

  getLatestWeight(petId: number): Observable<weight | null> {
    return this.getWeightsByPetId(petId).pipe(
      map(weights => {
        if (!weights.length) return null;
        return weights.reduce((latest, current) => {
          return new Date(current.weight_date) > new Date(latest.weight_date) ? current : latest;
        });
      })
    );
  }

  addWeight(petId: number, weight: Partial<weight>): Observable<weight> {
    return this.http.post<weight>(`${this.BASE_URL}/${petId}/weights`, weight);
  }

  deleteWeight(weightId: number): Observable<void> {
    return this.http.delete<void>(`${this.BASE_URL}/weights/${weightId}`);
  }
}
