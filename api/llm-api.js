export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { message } = req.body;

  if (!message || typeof message !== 'string') {
    return res.status(400).json({ error: 'Invalid message format' });
  }

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": "Bearer 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",
        "HTTP-Referer": "https://socials-waitlist.vercel.app",
        "X-Title": "Socials Waitlist",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "meta-llama/llama-3.3-8b-instruct:free",
        messages: [
          {
            role: "user",
            content: message
          }
        ]
      })
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({ error: data });
    }

    return res.status(200).json({ response: data });
  } catch (err) {
    console.error("Error calling OpenRouter:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}
