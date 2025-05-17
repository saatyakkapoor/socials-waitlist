export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Only POST requests allowed' });
  }

  const OPENROUTER_API_KEY = "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";

  const userMessage = req.body.message;

  if (!userMessage || typeof userMessage !== 'string') {
    return res.status(400).json({ error: 'Message must be a string' });
  }

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://your-site.com",   // Replace with your real domain (or remove)
        "X-Title": "MyLLMApp"                      // Optional, shows on OpenRouter
      },
      body: JSON.stringify({
        model: "meta-llama/llama-3.3-8b-instruct:free",
        messages: [
          {
            role: "user",
            content: userMessage
          }
        ]
      })
    });

    const data = await response.json();
    return res.status(200).json({ response: data });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
