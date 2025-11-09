export default async function handler(req: any, res: any) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', req.headers.origin || '*');
  res.setHeader('Vary', 'Origin');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method Not Allowed' });
    return;
  }

  try {
    const { email, password } = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {});
    if (!email || !password) {
      res.status(400).json({ error: 'Email and password are required' });
      return;
    }
    // Mock auth: accept any credentials
    const token = Buffer.from(`${email}:${Date.now()}`).toString('base64');
    res.status(200).json({ token });
  } catch (e: any) {
    res.status(500).json({ error: e?.message || 'Internal Server Error' });
  }
}
