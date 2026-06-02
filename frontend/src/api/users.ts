import client from './client';
import type { ApiResponse, User } from '../types';

export const getUsers = async (): Promise<ApiResponse<User[]>> => {
  const { data } = await client.get('/users');
  return data;
};

export const createUser = async (user: any): Promise<ApiResponse<User>> => {
  const { data } = await client.post('/users', user);
  return data;
};
