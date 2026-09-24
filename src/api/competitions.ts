import { apiClient } from './client';
import { Competition, RegistrationResponse, SubmissionResponse } from './types';

export const getCompetition = async (
  competitionId: string,
  token?: string | null
): Promise<Competition> => {
  const { data } = await apiClient.get<Competition>(`/competitions/${competitionId}`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  return data;
};

export const registerForCompetition = async (
  competitionId: string,
  token: string
): Promise<RegistrationResponse> => {
  const { data } = await apiClient.post<RegistrationResponse>(
    `/competitions/${competitionId}/register`,
    {},
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return data;
};

export const submitEntry = async (
  competitionId: string,
  token: string,
  submissionUrl: string,
  notes?: string
): Promise<SubmissionResponse> => {
  const { data } = await apiClient.post<SubmissionResponse>(
    `/competitions/${competitionId}/submission`,
    { submissionUrl, notes },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return data;
};
