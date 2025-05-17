export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const apiKey = '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'; // hardcoded for now

  try {
    const openRouterRes = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://socials-waitlist.vercel.app',
        'X-Title': 'Socials Waitlist'
      },
      body: JSON.stringify({
        model: 'meta-llama/llama-3.3-8b-instruct:free',
        messages: [
          {
            role: 'user',
            content: req.body.message || 'Default message from proxy.'
          }
        ]
      })
    });

    const data = await openRouterRes.json();
    res.status(openRouterRes.status).json(data);
  } catch (err) {
    console.error('OpenRouter call failed:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
