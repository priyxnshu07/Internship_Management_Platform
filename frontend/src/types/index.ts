export type UserRole = 'admin' | 'mentor' | 'intern';

export interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  created_at: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  error?: string;
}

export interface Task {
  id: number;
  title: string;
  description: string;
  status: 'todo' | 'in_progress' | 'done';
  assigned_to: number;
  assigned_by: number;
  due_date: string;
  created_at: string;
  assigned_to_name?: string;
}

export interface Standup {
  id: number;
  intern_id: number;
  yesterday: string;
  today: string;
  blockers: string;
  submitted_at: string;
  intern_name?: string;
}

export interface Evaluation {
  id: number;
  intern_id: number;
  reviewer_id: number;
  score: number;
  feedback: string;
  created_at: string;
  intern_name?: string;
  reviewer_name?: string;
}
