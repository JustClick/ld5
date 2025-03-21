export interface User {
  id: string;
  email: string;
  displayName: string;
  photoURL?: string;
  role: 'super_admin' | 'employee';
  department?: string;
  jobTitle?: string;
  phoneNumber?: string;
  active: boolean;
}

export interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
}