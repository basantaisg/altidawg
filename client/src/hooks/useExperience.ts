import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import type { Experience } from '@/types/experience';

export function useExperience(id: string) {
  return useQuery({
    queryKey: ['experience', id],
    queryFn: async () => {
      const { data } = await api.get<Experience>(`/v1/public/experiences/${id}`);
      return data;
    },
    enabled: !!id,
  });
}
