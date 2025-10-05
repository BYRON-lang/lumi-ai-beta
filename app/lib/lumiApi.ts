export interface LumiResponse {
  assistant: string;
  userMessage: string;
  reply: string;
  type?: "text" | "code"; // <- new field
  timestamp: string;
  meta?: {
    model: string;
    tokens?: number | null;
    latencyMs?: number | null;
  };
  suggestedActions?: string[];
  conversation?: { user: string; ai: string }[];
  error?: boolean;
  message?: string;
}

const API_URL = "https://apilumi.gridrr.com";

/**
 * Ask Lumi - Non-streaming request
 */
export async function askLumi(
  message: string,
  history: { user: string; ai: string }[] = []
): Promise<LumiResponse> {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ message, history }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Lumi API error: ${response.status} - ${errorText}`);
  }

  const data = await response.json();

  // Ensure type is set, default to text
  if (!("type" in data)) {
    data.type = "text";
  }

  return data;
}
