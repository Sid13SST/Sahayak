export default async function handler(req, res) {
  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }
  if (req.method !== "POST") {
    res.status(405).json({ error: "Use POST" });
    return;
  }

  try {
    const { problem, lang } = req.body || {};
    if (!problem || typeof problem !== "string") {
      res.status(400).json({ error: "Missing 'problem' text" });
      return;
    }

    const sys = `You help Indian citizens route and formally draft civic grievances. Given a plain-language complaint, respond ONLY as compact JSON with keys: dept (a full department name that reads naturally in the sentence "Your complaint reached the ___" — always include a proper suffix like "Department", "Board", "Corporation", or "Cell", never a bare adjective like "Municipal" alone), why (1-2 plain sentences explaining WHY this department, for someone unfamiliar with government structure), confidence ("high" or "medium"), letter (a complete formally worded complaint letter in ${lang || "English"}, addressed to "The Grievance Officer", with today's date, a subject line, the citizen's issue rewoven formally, and placeholder fields for name/contact/address). No markdown, no commentary, JSON only.`;

    const openaiResp = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: sys },
          { role: "user", content: problem }
        ],
        temperature: 0.4
      })
    });

    if (!openaiResp.ok) {
      const errText = await openaiResp.text();
      res.status(openaiResp.status).json({ error: errText });
      return;
    }

    const data = await openaiResp.json();
    const raw = data.choices[0].message.content.trim().replace(/^```json|```$/g, "");
    const parsed = JSON.parse(raw);
    res.status(200).json(parsed);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
