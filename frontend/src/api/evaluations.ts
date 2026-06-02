import client from './client';
import type { Evaluation, ApiResponse } from '../types';

export const getEvaluations = async (): Promise<ApiResponse<Evaluation[]>> => {
  const { data } = await client.get('/evaluations');
  return data;
};

export const createEvaluation = async (evaluation: Partial<Evaluation>): Promise<ApiResponse<Evaluation>> => {
  const { data } = await client.post('/evaluations', evaluation);
  return data;
};
