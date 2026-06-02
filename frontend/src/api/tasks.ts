import client from './client';
import type { Task, ApiResponse } from '../types';

export const getTasks = async (): Promise<ApiResponse<Task[]>> => {
  const { data } = await client.get('/tasks');
  return data;
};

export const createTask = async (task: Partial<Task>): Promise<ApiResponse<Task>> => {
  const { data } = await client.post('/tasks', task);
  return data;
};

export const updateTaskStatus = async (id: number, status: string): Promise<ApiResponse<Task>> => {
  const { data } = await client.patch(`/tasks/${id}`, { status });
  return data;
};
