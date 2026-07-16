import { DurableAgent } from "@workflow/ai/agent";
import { getWritable } from "workflow";
import {
  convertToModelMessages,
  type UIMessage,
  type UIMessageChunk,
} from "ai";
import {
  searchProducts,
  getAllCategories,
  returnOrder,
  getProductDetails,
} from "@/lib/tools";

export async function chatFlow(messages: UIMessage[]) {
  "use workflow";

  const modelMessages = await convertToModelMessages(messages);

  const agent = new DurableAgent({
    model: "anthropic/claude-sonnet-4.6",
    instructions: `You are a helpful assistant for the Vercel swag store.
    When the user asks about products, availability, or recommendations, use the searchProducts tool to look up real catalog data before answering.
    When asked about a type or category of product use the getAllCategories tool for getting valid categories before using searchProducts
    When asked for details about a specific product use the getProductDetails tool to retrieve all information
    When the user wants to return an order, use the returnOrder tool. Ask for the order ID and reason if they haven't provided them. Example order IDs are 11111, 22222, and 33333.`,
    tools: { searchProducts, getAllCategories, returnOrder, getProductDetails },
  });

  await agent.stream({
    messages: modelMessages,
    writable: getWritable<UIMessageChunk>(),
  });
}
