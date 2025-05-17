import fetch from 'node-fetch';

const OPENROUTER_API_KEY = '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';
const SITE_URL = 'https://socials-waitlist.vercel.app';
const SITE_TITLE = 'Socials-Waitlist';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method Not Allowed' });
    return;
  }

  const { message } = req.body;

  if (!message || typeof message !== 'string') {
    res.status(400).json({ error: 'Please provide a valid message string.' });
    return;
  }

  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'HTTP-Referer': SITE_URL,
        'X-Title': SITE_TITLE,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'meta-llama/llama-3.3-8b-instruct:free',
        messages: [
          {
            role: 'user',
            content: message,
          },
        ],
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({ error: data.error || 'Unknown error' });
    }

    // Return the API response
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

