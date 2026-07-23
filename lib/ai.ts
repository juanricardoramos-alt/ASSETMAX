// Internal Anthropic (Claude) API service — the single entry point every AI
// module uses. All features degrade gracefully when ANTHROPIC_API_KEY is not
// configured: callers must check aiEnabled() and provide a non-AI fallback.

const API_URL = "https://api.anthropic.com/v1/messages";
const MODEL = process.env.AI_MODEL ?? "claude-sonnet-5";

export function aiEnabled(): boolean {
  return Boolean(process.env.ANTHROPIC_API_KEY);
}

type ContentBlock =
  | { type: "text"; text: string }
  | {
      type: "document";
      source: { type: "base64"; media_type: "application/pdf"; data: string };
    };

export type AiMessage = {
  role: "user" | "assistant";
  content: string | ContentBlock[];
};

export async function askClaude({
  system,
  messages,
  maxTokens = 2048,
  temperature = 0.3,
}: {
  system: string;
  messages: AiMessage[];
  maxTokens?: number;
  temperature?: number;
}): Promise<string> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) throw new Error("ANTHROPIC_API_KEY is not configured");

  const res = await fetch(API_URL, {
    method: "POST",
    headers: {
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
      "content-type": "application/json",
    },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: maxTokens,
      temperature,
      system,
      messages,
    }),
  });

  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    throw new Error(`Anthropic API error ${res.status}: ${detail.slice(0, 300)}`);
  }

  const data = (await res.json()) as {
    content: { type: string; text?: string }[];
  };
  return data.content
    .filter((b) => b.type === "text")
    .map((b) => b.text ?? "")
    .join("\n");
}

/** Ask for strict JSON output and parse it, tolerating fenced code blocks. */
export async function askClaudeJson<T>(opts: {
  system: string;
  messages: AiMessage[];
  maxTokens?: number;
}): Promise<T> {
  const raw = await askClaude({
    ...opts,
    system:
      opts.system +
      "\n\nRespond ONLY with a single valid JSON object. No prose, no markdown fences.",
    temperature: 0,
  });
  const cleaned = raw.trim().replace(/^```(?:json)?/i, "").replace(/```$/, "").trim();
  try {
    return JSON.parse(cleaned) as T;
  } catch {
    const start = cleaned.indexOf("{");
    const end = cleaned.lastIndexOf("}");
    if (start >= 0 && end > start) {
      return JSON.parse(cleaned.slice(start, end + 1)) as T;
    }
    throw new Error("AI returned non-JSON output");
  }
}
