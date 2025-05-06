export interface ProfileFormData {
  id?: number;
  first_name?: string;
  last_name?: string;
  email?: string | null;
  year_of_study?: { value: string; display: string } | null;  
  hobbies?: { value: string; display: string } | null; 
  course?: { value: string; display: string } | null; 
  phone_number?: string | null;
  student_number?: string | null;
  github_url?: string | null;
  linkedin_url?: string | null;
}
