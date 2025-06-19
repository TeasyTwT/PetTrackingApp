import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { PetNote } from '../interfaces/petnote.interface'

@Injectable({
  providedIn: 'root'
})
export class NotesService {
  private apiUrl = `${environment.apiUrl}/pets`;

  constructor(private http: HttpClient) { }

  // Get all notes for a specific pet
  getAllNotes(petId: number): Observable<PetNote[]> {
    return this.http.get<PetNote[]>(`${this.apiUrl}/${petId}/notes`);
  }

  // Get a single note
  getNote(petId: number, noteId: number): Observable<PetNote> {
    return this.http.get<PetNote>(`${this.apiUrl}/${petId}/notes/${noteId}`);
  }

  // Create a new note
  createNote(petId: number, note: Omit<PetNote, 'note_id' | 'created_at'>): Observable<PetNote> {
    return this.http.post<PetNote>(`${this.apiUrl}/${petId}/notes`, note);
  }

  // Update a note
  updateNote(petId: number, noteId: number, note: Partial<PetNote>): Observable<PetNote> {
    return this.http.put<PetNote>(`${this.apiUrl}/${petId}/notes/${noteId}`, note);
  }

  // Delete a note
  deleteNote(petId: number, noteId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${petId}/notes/${noteId}`);
  }
}
