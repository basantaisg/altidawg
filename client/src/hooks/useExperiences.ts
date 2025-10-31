import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import type { Experience } from '@/types/experience';

interface UseExperiencesParams {
  city?: string;
  tag?: string;
}

export function useExperiences(params?: UseExperiencesParams) {
  return useQuery({
    queryKey: ['experiences', params],
    queryFn: async () => {
      const { data } = await api.get<Experience[]>('/v1/public/experiences', { params });
      return data;
    },
  });
}
