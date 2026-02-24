import { API_BASE_URL, TENANTS_BY_EMAIL_ENDPOINT } from '../api-config';
import { getTenantsByEmail } from './tenantsApi';

const EMAIL = 'herwidget@gmail.com';
const ENCODED_EMAIL = 'herwidget%40gmail.com';

describe('getTenantsByEmail', () => {
  beforeEach(() => {
    global.fetch = jest.fn();
  });

  it('calls GET /tenants/by-email with encoded email', async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({ email: EMAIL, tenants: [] }),
      statusText: 'OK',
    });

    const res = await getTenantsByEmail(EMAIL);
    expect(res.ok).toBe(true);

    const calledUrl = (global.fetch as jest.Mock).mock.calls[0][0] as string;
    expect(calledUrl).toContain(`${API_BASE_URL}${TENANTS_BY_EMAIL_ENDPOINT}`);
    expect(calledUrl).toContain(`email=${ENCODED_EMAIL}`);
  });
});

