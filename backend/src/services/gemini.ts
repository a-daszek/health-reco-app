import fetch from "node-fetch";

export const getGeminiRecommendation = async (blood: any): Promise<string> => {
  const prompt = `
Jesteś asystentem zdrowotnym.
Na podstawie wyników krwi podaj krótką, ogólną rekomendację
(max 6-8 zdań, po polsku).
Nie stawiaj diagnozy.

Wyniki:
- Hemoglobina: ${blood.hemoglobin ?? "brak"}
- WBC: ${blood.wbc ?? "brak"}
- Płytki: ${blood.platelets ?? "brak"}
- Glukoza: ${blood.glucose ?? "brak"}
- Cholesterol: ${blood.cholesterolTotal ?? "brak"}
`;

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        safetySettings: [
          {
            category: "HARM_CATEGORY_DANGEROUS_CONTENT",
            threshold: "BLOCK_NONE",
          },
        ],
      }),
    }
  );

  const data: any = await response.json();

  if (!response.ok) {
    console.error("Gemini HTTP error:", data);
    throw new Error("Gemini HTTP error");
  }

  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text ?? null;

  if (!text) {
    console.error("Gemini empty response:", data);
    throw new Error("Gemini returned empty response");
  }

  return text.trim();
};
