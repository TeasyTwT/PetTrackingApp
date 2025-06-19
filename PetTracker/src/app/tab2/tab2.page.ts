import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonSelect,
  IonSelectOption,
  IonItem,
  IonLabel,
  IonChip,
  IonIcon,
  IonButton,
  IonFab,
  IonFabButton,
  IonModal,
  IonInput,
  IonTextarea,
} from '@ionic/angular/standalone';
import {
  addOutline,
  trashOutline,
  timeOutline,
  nutritionOutline,
  scaleOutline,
  calendarOutline,
  personOutline,
  documentTextOutline
} from 'ionicons/icons';
import { addIcons } from 'ionicons';
import { PetService } from '../services/pet.service';
import { NotesService } from '../services/notes.service';
import { PetNote } from '../interfaces/petnote.interface';
import { Pet } from '../interfaces/pet.interface';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonSelect,
    IonSelectOption,
    IonItem,
    IonLabel,
    IonChip,
    IonIcon,
    IonButton,
    IonFab,
    IonFabButton,
    IonModal,
    IonInput,
    IonTextarea
  ]
})
export class Tab2Page implements OnInit {
  pets: Pet[] = [];
  selectedPetId: number | null = null;
  notes: PetNote[] = [];
  filteredNotes: PetNote[] = [];
  selectedNoteType: string = 'all';
  isModalOpen = false;
  newNote: Partial<PetNote> = {
    note_type: 'General',
    note_text: '',
    note_date: new Date()
  };

  constructor(
    private petService: PetService,
    private notesService: NotesService
  ) {
    addIcons({
      addOutline,
      trashOutline,
      timeOutline,
      nutritionOutline,
      scaleOutline,
      calendarOutline,
      personOutline,
      documentTextOutline
    });
  }

  ngOnInit() {
    this.loadPets();
  }

  loadPets() {
    this.petService.getUserPets().subscribe(pets => {
      this.pets = pets;
    });
  }

  onPetSelect() {
    if (this.selectedPetId) {
      this.loadNotes();
    }
  }

  loadNotes() {
    if (this.selectedPetId) {
      this.notesService.getAllNotes(this.selectedPetId).subscribe(notes => {
        this.notes = notes;
        this.filterNotes();
      });
    }
  }

  filterNotes() {
    if (this.selectedNoteType === 'all') {
      this.filteredNotes = this.notes;
    } else {
      this.filteredNotes = this.notes.filter(note => note.note_type === this.selectedNoteType);
    }
  }

  onNoteTypeChange() {
    this.filterNotes();
  }

  setOpen(isOpen: boolean) {
    this.isModalOpen = isOpen;
    if (!isOpen) {
      this.newNote = {
        note_type: 'General',
        note_text: '',
        note_date: new Date()
      };
    }
  }

  createNote() {
    if (this.selectedPetId && this.newNote.note_text) {
      const note: Omit<PetNote, 'note_id' | 'created_at'> = {
        pet_id: this.selectedPetId,
        note_type: this.newNote.note_type as 'General' | 'Feeding' | 'Vet',
        note_text: this.newNote.note_text,
        note_date: this.newNote.note_date || new Date(),
        feeding_time: this.newNote.feeding_time,
        food_type: this.newNote.food_type,
        portion_size: this.newNote.portion_size,
        appointment_date: this.newNote.appointment_date,
        vet_name: this.newNote.vet_name,
        purpose: this.newNote.purpose
      };

      this.notesService.createNote(this.selectedPetId, note).subscribe(() => {
        this.loadNotes();
        this.setOpen(false);
      });
    }
  }

  deleteNote(noteId: number) {
    if (this.selectedPetId) {
      this.notesService.deleteNote(this.selectedPetId, noteId).subscribe(() => {
        this.loadNotes();
      });
    }
  }

  getNoteTypeColor(type: string): string {
    switch (type) {
      case 'Vet':
        return 'danger';
      case 'Feeding':
        return 'success';
      default:
        return 'primary';
    }
  }
}
