import { signToken } from '../../src/utils/jwt';

export function getAdminAuthHeader(): { Authorization: string } {
  return {
    Authorization: `Bearer ${signToken({
      sub: 'test-admin-id',
      email: 'admin@techinventory.com',
      role: 'ADMIN',
    })}`,
  };
}
