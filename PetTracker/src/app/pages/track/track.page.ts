import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, IonLabel, IonFab, IonFabButton, IonIcon, IonButton, IonButtons, IonModal, IonTextarea, IonInput, IonListHeader, IonSegment, IonSegmentButton, IonBackButton } from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import { WeightService } from '../../services/weight.service';
import { MedicationService } from '../../services/medication.service';
import { PetService } from '../../services/pet.service';
import { Pet } from '../../interfaces/pet.interface';
import { weight } from '../../interfaces/weight.interface';
import { Medication } from '../../interfaces/medication.interface';
import { Chart, registerables } from 'chart.js';
import { addIcons } from 'ionicons';
import { add, trashOutline, scaleOutline, medicalOutline, chevronBack } from 'ionicons/icons';
import { ToastController } from '@ionic/angular/standalone';
import { ActivatedRoute } from '@angular/router';

Chart.register(...registerables);

@Component({
  selector: 'app-tracker',
  templateUrl: './track.page.html',
  styleUrls: ['./track.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonList,
    IonItem,
    IonLabel,
    IonFab,
    IonFabButton,
    IonIcon,
    IonButton,
    IonButtons,
    IonModal,
    IonTextarea,
    IonInput,
    IonListHeader,
    IonSegment,
    IonSegmentButton,
    IonBackButton
  ]
})
export class TrackPage implements OnInit {
  @ViewChild('weightChart') private chartRef!: ElementRef;
  private chart: Chart | undefined;

  selectedSegment = 'weight';
  pet: Pet | null = null;
  petId: number | null = null;
  weights: weight[] = [];
  medications: Medication[] = [];
  isWeightModalOpen = false;
  isMedicationModalOpen = false;
  weightForm: FormGroup;
  medicationForm: FormGroup;

  get sortedWeights() {
    return [...this.weights].sort((a, b) =>
      new Date(b.weight_date).getTime() - new Date(a.weight_date).getTime()
    );
  }

  get sortedMedications() {
    return [...this.medications].sort((a, b) =>
      new Date(b.start_date).getTime() - new Date(a.start_date).getTime()
    );
  }

  constructor(
    private weightService: WeightService,
    private medicationService: MedicationService,
    private petService: PetService,
    private fb: FormBuilder,
    private toastCtrl: ToastController,
    private route: ActivatedRoute
  ) {
    addIcons({ add, trashOutline, scaleOutline, medicalOutline, chevronBack });

    this.weightForm = this.fb.group({
      weight_value: ['', [Validators.required, Validators.min(0.1)]],
      weight_date: [new Date().toISOString().split('T')[0], Validators.required],
      notes: ['']
    });

    this.medicationForm = this.fb.group({
      medication_name: ['', Validators.required],
      dosage: ['', Validators.required],
      start_date: [new Date().toISOString().split('T')[0], Validators.required],
      end_date: [''],
      frequency: ['', Validators.required],
      notes: ['']
    });
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      console.log('Route params:', params);
      if (params['id']) {
        this.petId = +params['id'];
        this.selectedSegment = params['section'] || 'weight';
        this.loadPetDetails();
        this.loadWeights();
        this.loadMedications();
      }
    });
  }

  loadPetDetails() {
    if (!this.petId) return;
    console.log('Loading pet with ID:', this.petId);

    this.petService.getPet(this.petId).subscribe({
      next: (pet) => {
        console.log('Pet data received:', pet);
        this.pet = pet;
        console.log('Pet after assignment:', this.pet);
      },
      error: (error) => {
        console.error('Failed to load pet details:', error);
      }
    });
  }

  segmentChanged(event: any) {
    this.selectedSegment = event.detail.value;
    if (this.petId) {
      if (this.selectedSegment === 'weights') {
        this.loadWeights();
      } else if (this.selectedSegment === 'medications') {
        this.loadMedications();
      }
    }
  }

  // Weight Management
  loadWeights() {
    if (!this.petId) return;

    this.weightService.getWeightsByPetId(this.petId).subscribe({
      next: (weights) => {
        this.weights = weights;
        if (this.selectedSegment === 'weights') {
          this.updateChart();
        }
      },
      error: (error) => {
        console.error('Failed to load weights:', error);
      }
    });
  }

  openAddWeightModal() {
    this.isWeightModalOpen = true;
    this.weightForm.reset({
      weight_date: new Date().toISOString().split('T')[0]
    });
  }

  closeWeightModal() {
    this.isWeightModalOpen = false;
  }

  async addWeight() {
    if (this.weightForm.valid && this.petId) {
      const weightData = {
        ...this.weightForm.value,
        pet_id: this.petId,
        weight_date: new Date(this.weightForm.value.weight_date).toISOString()
      };

      try {
        await this.weightService.addWeight(this.petId, weightData).toPromise();
        this.closeWeightModal();
        this.loadWeights();

        const toast = await this.toastCtrl.create({
          message: 'Weight record added successfully!',
          duration: 3000,
          color: 'success'
        });
        await toast.present();
      } catch (error) {
        const toast = await this.toastCtrl.create({
          message: 'Failed to add weight record. Please try again.',
          duration: 3000,
          color: 'danger'
        });
        await toast.present();
      }
    }
  }

  async deleteWeight(weightId: number) {
    try {
      await this.weightService.deleteWeight(weightId).toPromise();
      this.loadWeights();

      const toast = await this.toastCtrl.create({
        message: 'Weight record deleted successfully!',
        duration: 3000,
        color: 'success'
      });
      await toast.present();
    } catch (error) {
      const toast = await this.toastCtrl.create({
        message: 'Failed to delete weight record. Please try again.',
        duration: 3000,
        color: 'danger'
      });
      await toast.present();
    }
  }

  // Medication Management
  loadMedications() {
    if (!this.petId) return;

    this.medicationService.getMedicationsByPetId(this.petId).subscribe({
      next: (medications) => {
        this.medications = medications;
      },
      error: (error) => {
        console.error('Failed to load medications:', error);
      }
    });
  }

  openAddMedicationModal() {
    this.isMedicationModalOpen = true;
    this.medicationForm.reset({
      start_date: new Date().toISOString().split('T')[0]
    });
  }

  closeMedicationModal() {
    this.isMedicationModalOpen = false;
  }

  async addMedication() {
    if (this.medicationForm.valid && this.petId) {
      const medicationData = {
        ...this.medicationForm.value,
        pet_id: this.petId,
        start_date: new Date(this.medicationForm.value.start_date).toISOString(),
        end_date: this.medicationForm.value.end_date ?
          new Date(this.medicationForm.value.end_date).toISOString() : null
      };

      try {
        await this.medicationService.addMedication(this.petId, medicationData).toPromise();
        this.closeMedicationModal();
        this.loadMedications();

        const toast = await this.toastCtrl.create({
          message: 'Medication added successfully!',
          duration: 3000,
          color: 'success'
        });
        await toast.present();
      } catch (error) {
        const toast = await this.toastCtrl.create({
          message: 'Failed to add medication. Please try again.',
          duration: 3000,
          color: 'danger'
        });
        await toast.present();
      }
    }
  }

  async deleteMedication(medicationId: number) {
    try {
      await this.medicationService.deleteMedication(medicationId).toPromise();
      this.loadMedications();

      const toast = await this.toastCtrl.create({
        message: 'Medication deleted successfully!',
        duration: 3000,
        color: 'success'
      });
      await toast.present();
    } catch (error) {
      const toast = await this.toastCtrl.create({
        message: 'Failed to delete medication. Please try again.',
        duration: 3000,
        color: 'danger'
      });
      await toast.present();
    }
  }

  private updateChart() {
    if (this.chart) {
      this.chart.destroy();
    }

    if (!this.chartRef || !this.weights.length) return;

    const sortedWeights = [...this.weights].sort((a, b) =>
      new Date(a.weight_date).getTime() - new Date(b.weight_date).getTime()
    );

    const dates = sortedWeights.map(w => new Date(w.weight_date).toLocaleDateString());
    const weightValues = sortedWeights.map(w => w.weight_value);

    this.chart = new Chart(this.chartRef.nativeElement, {
      type: 'line',
      data: {
        labels: dates,
        datasets: [{
          label: 'Weight (kg)',
          data: weightValues,
          fill: false,
          borderColor: 'rgb(75, 192, 192)',
          tension: 0.1
        }]
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: false,
            title: {
              display: true,
              text: 'Weight (kg)'
            }
          },
          x: {
            title: {
              display: true,
              text: 'Date'
            }
          }
        }
      }
    });
  }
}
