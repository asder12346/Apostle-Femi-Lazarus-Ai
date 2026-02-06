import { Message, MessageRole, SourceReference } from "../types";

export const sendMessageToGemini = async (
  prompt: string,
  history: Message[]
): Promise<{ text: string; sources: SourceReference[] }> => {
  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt, history }),
    });

    if (!response.ok) {
      let details = '';
      try {
        const maybeJson = await response.json();
        details = maybeJson?.error || maybeJson?.details || JSON.stringify(maybeJson);
      } catch {
        try {
          details = await response.text();
        } catch {
          details = '';
        }
      }

      throw new Error(
        details
          ? `Backend error (${response.status}): ${details}`
          : `Backend error (${response.status})`
      );
    }

    const data = await response.json();
    return {
      text: data.text || "No response received.",
      sources: data.sources || []
    };
  } catch (error) {
    console.error("Backend API Error:", error);
    throw error;
  }
};

