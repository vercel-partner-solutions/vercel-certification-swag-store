/**
 * This is where we'll add a route for resuming a stream for an agent chat.
 *
 * During the workshop you will wire this up in the Workflows chapter.
 *
 * Workshop docs: https://agent-foundations-certification.vercel.app/docs/workflows
 */

import { createUIMessageStreamResponse } from "ai";
import { getRun } from "workflow/api";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const { searchParams } = new URL(request.url);
  const startIndexParam = searchParams.get("startIndex");
  const startIndex = startIndexParam
    ? parseInt(startIndexParam, 10)
    : undefined;

  const run = getRun(id);
  const readable = run.getReadable({ startIndex });
  const tailIndex = await readable.getTailIndex();

  return createUIMessageStreamResponse({
    stream: readable,
    headers: {
      "x-workflow-stream-tail-index": String(tailIndex),
    },
  });
}

export const POST = async () =>
  new Response(
    "Not implemented yet — finish the chat-agent workshop step to enable this route.",
    { status: 501 },
  );
