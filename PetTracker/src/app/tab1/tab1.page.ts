import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonList,
  IonItem,
  IonLabel,
  IonButton,
  IonIcon,
  IonCard,
  IonCardContent,
  IonInput,
  IonFab,
  IonButtons,
  IonFabButton,
  IonSelect,
  IonSelectOption,
  IonModal,
  IonAvatar,
  ModalController,
  ToastController
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { add, pawOutline, trashOutline, createOutline, scaleOutline, medicalOutline } from 'ionicons/icons';
import { PetService } from '../services/pet.service';
import { Pet } from '../interfaces/pet.interface';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { firstValueFrom, forkJoin, of } from 'rxjs';
import { switchMap, map } from 'rxjs/operators';
import { WeightService } from '../services/weight.service';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    IonHeader,
    IonToolbar,
    IonAvatar,
    IonTitle,
    IonContent,
    IonList,
    IonItem,
    IonLabel,
    IonButton,
    IonIcon,
    IonCard,
    IonCardContent,
    IonInput,
    IonButtons,
    IonFab,
    IonFabButton,
    IonSelect,
    IonSelectOption,
    IonModal
  ],
})
export class Tab1Page implements OnInit {
  pets: (Pet & { latestWeight?: number })[] = [];
  petForm: FormGroup;
  pet_picture!: File;
  isModalOpen = false;

  constructor(
    private petService: PetService,
    private weightService: WeightService,
    private fb: FormBuilder,
    private toastCtrl: ToastController,
    private modalCtrl: ModalController
  ) {
    addIcons({ add, pawOutline, trashOutline, createOutline, scaleOutline, medicalOutline });
    this.petForm = this.fb.group({
      name: ['', Validators.required],
      species: ['', Validators.required],
      breed: ['', Validators.required],
      date_of_birth: ['']
    });
  }

  onFileSelected(event: any) {
    this.pet_picture = event.target.files[0];
  }

  ngOnInit() {
    this.loadPets();
  }

  loadPets() {
    this.petService.getUserPets().pipe(
      switchMap(pets => {
        if (pets.length === 0) {
          return of([]);
        }

        // Create an array of observables for each pet's latest weight
        const weightObservables = pets.map(pet =>
          this.weightService.getLatestWeight(pet.pet_id).pipe(
            map(weight => ({
              ...pet,
              latestWeight: weight?.weight_value
            }))
          )
        );

        return forkJoin(weightObservables);
      })
    ).subscribe({
      next: (petsWithWeights) => {
        this.pets = petsWithWeights;
      },
      error: (error) => {
        this.toastCtrl.create({
          message: 'Failed to load pets. Please try again.',
          duration: 3000,
          color: 'danger'
        }).then(toast => toast.present());
      }
    });
  }

  async addPet() {
    if (this.petForm.valid) {
      const formData = new FormData();

      // Append all form fields
      Object.keys(this.petForm.value).forEach(key => {
        if (this.petForm.value[key] !== null) {
          formData.append(key, this.petForm.value[key]);
        }
      });

      // Append the image file if selected
      if(this.pet_picture){
        formData.append('pet_picture', this.pet_picture);
      }
      try {
        await firstValueFrom(this.petService.addPet(formData));
        this.petForm.reset();
        this.isModalOpen = false;
        this.loadPets();

        const toast = await this.toastCtrl.create({
          message: 'Pet added successfully!',
          duration: 3000,
          color: 'success'
        });
        await toast.present();
      } catch (error) {
        const toast = await this.toastCtrl.create({
          message: 'Failed to add pet. Please try again.',
          duration: 3000,
          color: 'danger'
        });
        await toast.present();
      }
    }
  }

  async deletePet(petId: number) {
    try {
      await firstValueFrom(this.petService.deletePet(petId));
      await this.loadPets();

      const toast = await this.toastCtrl.create({
        message: 'Pet deleted successfully!',
        duration: 3000,
        color: 'success'
      });
      await toast.present();
    } catch (error) {
      const toast = await this.toastCtrl.create({
        message: 'Failed to delete pet. Please try again.',
        duration: 3000,
        color: 'danger'
      });
      await toast.present();
    }
  }


  openAddPetModal() {
    this.isModalOpen = true;
    this.petForm.reset();
  }

  closeModal() {
    this.isModalOpen = false;
  }
}
