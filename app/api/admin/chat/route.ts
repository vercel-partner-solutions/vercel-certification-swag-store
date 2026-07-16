/**
 * This is where the admin chat API route will live.
 *
 * During the workshop you'll wire this up to the agent in `lib/agent.ts`
 * using `createAgentUIStreamResponse` from the AI SDK. The chat panel in
 * `components/agent-chat.tsx` posts here once you swap its placeholder
 * `useState` for `useChat`.
 *
 * Workshop docs: https://agent-foundations-certification.vercel.app/docs/admin-chat-agent
 */

import { adminChatFlow } from "@/lib/workflows/admin-chat-flow";
import { createUIMessageStreamResponse } from "ai";
import type { UIMessage } from "ai";
import { start } from "workflow/api";

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json();
  const run = await start(adminChatFlow, [messages]);
  return createUIMessageStreamResponse({ stream: run.readable });
}
