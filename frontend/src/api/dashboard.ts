import client from './client';
import type { ApiResponse, Task, Standup, Evaluation } from '../types';

export interface InternDashboardData {
  tasks: Task[];
  standups: Standup[];
  latestEvaluation: Evaluation | null;
}

export interface MentorDashboardData {
  intern: { id: number; name: string; email: string };
  taskCount: number;
  completedCount: number;
  lastStandup: string | null;
}

export const getInternDashboard = async (): Promise<ApiResponse<InternDashboardData>> => {
  const { data } = await client.get('/dashboard/intern');
  return data;
};

export const getMentorDashboard = async (): Promise<ApiResponse<MentorDashboardData[]>> => {
  const { data } = await client.get('/dashboard/mentor');
  return data;
};
