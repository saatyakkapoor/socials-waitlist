// api/llm-api.js
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ error: 'No message provided' });
  }

  try {
    const openrouterRes = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`, // Make sure this is set in Vercel!
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://socials-waitlist.vercel.app',
        'X-Title': 'Socials Waitlist'
      },
      body: JSON.stringify({
        model: 'meta-llama/llama-3.3-8b-instruct:free',
        messages: [
          {
            role: 'user',
            content: message
          }
        ]
      })
    });

    const data = await openrouterRes.json();

    if (!openrouterRes.ok) {
      return res.status(openrouterRes.status).json({ error: data });
    }

    res.status(200).json(data);
  } catch (err) {
    console.error('LLM API Error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}
