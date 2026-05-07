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

export const POST = async () =>
  new Response(
    "Not implemented yet — finish the chat-agent workshop step to enable this route.",
    { status: 501 },
  );
