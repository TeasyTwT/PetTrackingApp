import { Injectable } from '@angular/core';
import { environment } from "../../environments/environment";
import { HttpClient } from '@angular/common/http';
import { Medication } from '../interfaces/medication.interface';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MedicationService {
  private readonly BASE_URL = `${environment.apiUrl}/pets`;
  
  constructor(private http: HttpClient) { }

  getMedicationsByPetId(petId: number): Observable<Medication[]> {
    return this.http.get<Medication[]>(`${this.BASE_URL}/${petId}/medications`);
  }

  getActiveMedications(petId: number): Observable<Medication[]> {
    return this.getMedicationsByPetId(petId).pipe(
      map(medications => medications.filter(med => 
        !med.end_date || new Date(med.end_date) >= new Date()
      ))
    );
  }

  addMedication(petId: number, medication: Partial<Medication>): Observable<Medication> {
    return this.http.post<Medication>(`${this.BASE_URL}/${petId}/medications`, medication);
  }

  updateMedication(medicationId: number, medication: Partial<Medication>): Observable<Medication> {
    return this.http.put<Medication>(`${this.BASE_URL}/medications/${medicationId}`, medication);
  }

  deleteMedication(medicationId: number): Observable<void> {
    return this.http.delete<void>(`${this.BASE_URL}/medications/${medicationId}`);
  }
} 