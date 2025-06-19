export interface Medication {
  medication_id: number;
  pet_id: number;
  medication_name: string;
  dosage: string;
  start_date: string;
  end_date?: string;
  frequency: string;
  notes?: string;
  created_at?: string;
  updated_at?: string;
} 