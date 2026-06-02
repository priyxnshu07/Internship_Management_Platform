import client from './client';
import type { User, ApiResponse } from '../types';

export const login = async (credentials: any): Promise<ApiResponse<{ token: string; user: User }>> => {
  const { data } = await client.post('/auth/login', credentials);
  return data;
};

export const getMe = async (): Promise<ApiResponse<User>> => {
  const { data } = await client.get('/auth/me');
  return data;
};
