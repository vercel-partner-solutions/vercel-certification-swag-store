"use client";

/**
 * Welcome! This is the chat panel you will edit for the workshop!
 *
 * During the workshop you'll connect it to a real agent: swap the
 * local `useState` for `useChat` from the AI SDK, point the form
 * at `sendMessage`, and render each message's `parts` inside
 * `<ConversationContent>`.
 *
 * Workshop docs: https://agent-foundations-certification.vercel.app/docs/admin-chat-agent
 */
import { useState } from "react";
import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
} from "@/components/ai-elements/conversation";
import {
  PromptInput,
  PromptInputBody,
  PromptInputFooter,
  type PromptInputMessage,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputTools,
} from "@/components/ai-elements/prompt-input";
import { Suggestion, Suggestions } from "@/components/ai-elements/suggestion";
import {
  Message,
  MessageContent,
  MessageResponse,
} from "./ai-elements/message";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";

//admin login: letmeinadminagent
const SUGGESTIONS = [
  "Show me low-stock items",
  "What were yesterday's top sellers?",
  "Summarize this week's revenue",
];

export function AdminAgentChat() {
  const [input, setInput] = useState("");

  const { messages, error, sendMessage } = useChat({
    // we need to point to a different API route because this is a different agent
    transport: new DefaultChatTransport({ api: "/api/admin/chat" }),
  });

  const handleSubmit = (message: PromptInputMessage) => {
    sendMessage({ text: input });
    setInput("");
  };

  const handleSuggestionClick = (suggestion: string) => {
    sendMessage({ text: suggestion });
  };

  if (error) return <div>{error.message}</div>;

  return (
    <div className="flex h-full min-h-0 flex-col">
      <Conversation className="flex-1">
        <ConversationContent>
          {messages.map((m) =>
            m.parts.map((p, i) => {
              switch (p.type) {
                case "text":
                  return (
                    <Message key={`${m.id}-${i}`} from={m.role}>
                      <MessageContent>
                        <MessageResponse>{p.text}</MessageResponse>
                      </MessageContent>
                    </Message>
                  );
                case "tool-bash": {
                  const input = p.input as { command?: string } | undefined;
                  const output = p.output as
                    | { stdout?: string; stderr?: string }
                    | undefined;
                  return (
                    <div
                      key={`${m.id}-${i}`}
                      className="my-2 rounded-lg bg-neutral-900 font-mono text-sm overflow-hidden border border-neutral-800"
                    >
                      <div className="flex items-center gap-2 px-3 py-2 bg-neutral-800/50 border-b border-neutral-800 text-neutral-400">
                        <svg
                          className="size-4"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={2}
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="m6.75 7.5 3 2.25-3 2.25m4.5 0h3m-9 8.25h13.5A2.25 2.25 0 0 0 21 18V6a2.25 2.25 0 0 0-2.25-2.25H5.25A2.25 2.25 0 0 0 3 6v12a2.25 2.25 0 0 0 2.25 2.25Z"
                          />
                        </svg>
                        <span className="text-xs">
                          {p.state === "output-available"
                            ? "Terminal"
                            : "Running…"}
                        </span>
                      </div>
                      <div className="px-3 py-2">
                        <div className="text-neutral-100 font-semibold">
                          $ {input?.command}
                        </div>
                        {p.state === "output-available" && output && (
                          <div className="mt-1 text-neutral-300">
                            {output.stdout && (
                              <pre className="whitespace-pre-wrap">
                                {output.stdout}
                              </pre>
                            )}
                            {output.stderr && (
                              <pre className="whitespace-pre-wrap text-red-400">
                                {output.stderr}
                              </pre>
                            )}
                          </div>
                        )}
                        {p.state !== "output-available" && (
                          <div className="mt-1 flex items-center gap-1 text-neutral-500">
                            <span className="animate-pulse">▊</span>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                }
                default:
                  return null;
              }
            }),
          )}
        </ConversationContent>
        <ConversationScrollButton />
      </Conversation>

      <div className="flex flex-col gap-3 border-t p-3">
        <Suggestions>
          {SUGGESTIONS.map((s) => (
            <Suggestion
              key={s}
              suggestion={s}
              onClick={handleSuggestionClick}
            />
          ))}
        </Suggestions>
        <PromptInput onSubmit={handleSubmit}>
          <PromptInputBody>
            <PromptInputTextarea
              value={input}
              onChange={(e) => setInput(e.currentTarget.value)}
              placeholder="Ask the admin agent…"
            />
          </PromptInputBody>
          <PromptInputFooter>
            <PromptInputTools />
            <PromptInputSubmit status="ready" disabled={!input.trim()} />
          </PromptInputFooter>
        </PromptInput>
      </div>
    </div>
  );
}
