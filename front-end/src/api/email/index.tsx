import service from '@/utils/request';
import { improvedCatchAsync } from '@/api';
import { SMTPConfig } from '@/interface/emailApi';

export const setSMTPConfig = improvedCatchAsync(async (config: SMTPConfig) => {
  const response = await service.post('/api/email', config);
  return Promise.resolve(response);
});

export const getSMTPConfig = improvedCatchAsync(async () => {
  const response = await service.get('/api/email');
  return Promise.resolve(response);
});
