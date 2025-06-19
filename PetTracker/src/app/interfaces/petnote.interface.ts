export interface PetNote {
  note_id?: number;
  pet_id: number;
  note_type: 'General' | 'Feeding' | 'Vet';
  note_text: string;
  note_date?: Date;
  feeding_time?: string;
  food_type?: string;
  portion_size?: string;
  appointment_date?: Date;
  vet_name?: string;
  purpose?: string;
  created_at?: Date;
}
