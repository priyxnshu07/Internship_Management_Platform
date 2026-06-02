import client from './client';
import type { Standup, ApiResponse } from '../types';

export const getStandups = async (internId?: number): Promise<ApiResponse<Standup[]>> => {
  const url = internId ? `/standups?intern_id=${internId}` : '/standups';
  const { data } = await client.get(url);
  return data;
};

export const submitStandup = async (standup: Partial<Standup>): Promise<ApiResponse<Standup>> => {
  const { data } = await client.post('/standups', standup);
  return data;
};
