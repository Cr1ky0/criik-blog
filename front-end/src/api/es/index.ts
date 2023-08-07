import { improvedCatchAsync } from '@/api';
import service from '@/utils/request';

export const searchDoc = improvedCatchAsync(async (match: string) => {
  const response = await service.get(`/api/es?match=${match}`);
  return Promise.resolve(response);
});
