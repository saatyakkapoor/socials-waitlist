export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ error: 'Message is required' });
  }

  try {
    const result = await fetch("https://openrouter.ai/api/v1/chat/completions", {
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

    const data = await result.json();
    res.status(result.status).json(data);
  } catch (error) {
    console.error("Fetch Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
