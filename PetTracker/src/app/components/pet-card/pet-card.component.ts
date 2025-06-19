import { Component, Input, Output, EventEmitter } from '@angular/core';
import { IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle, IonButton, IonIcon, IonGrid, IonRow, IonCol } from '@ionic/angular/standalone';
import { RouterLink } from '@angular/router';
import { Pet } from '../../interfaces/pet.interface';
import { addIcons } from 'ionicons';
import { createOutline, trashOutline, pulseOutline } from 'ionicons/icons';

@Component({
  selector: 'app-pet-card',
  templateUrl: './pet-card.component.html',
  styleUrls: ['./pet-card.component.scss'],
  standalone: true,
  imports: [
    IonCard,
    IonCardContent,
    IonCardHeader,
    IonCardSubtitle,
    IonCardTitle,
    IonButton,
    IonIcon,
    IonGrid,
    IonRow,
    IonCol,
    RouterLink
  ]
})
export class PetCardComponent {
  @Input() pet!: Pet;
  @Output() onEdit = new EventEmitter<Pet>();
  @Output() onDelete = new EventEmitter<number>();

  constructor() {
    addIcons({ createOutline, trashOutline, pulseOutline });
  }
} 