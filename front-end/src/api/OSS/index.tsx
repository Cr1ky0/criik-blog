import service from '@/utils/request';
import { improvedCatchAsync } from '@/api';
import { OSSConfig } from '@/interface/OSSApi';

//GetAliOSS Policy-Token
export const getOSSPolicy = improvedCatchAsync(async () => {
  const response = await service.get('/api/policy');
  return Promise.resolve(response);
});

export const setOSSObject = improvedCatchAsync(async (config: OSSConfig) => {
  const response = await service.post('/api/policy/setConfig', config);
  return Promise.resolve(response);
});

export const getOSSObject = improvedCatchAsync(async () => {
  const response = await service.get('/api/policy/getConfig');
  return Promise.resolve(response);
});
