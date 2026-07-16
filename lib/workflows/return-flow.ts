import {
  createReturn,
  getOrder,
  notifyReturnInProcess,
  preauthorizeRefund,
} from "@/lib/api";
import type { Order, Return } from "@/lib/types";

export async function returnFlow(orderId: string, reason: string) {
  "use workflow";
  const order = await getOrderStep(orderId);
  await notifyReturnInProcessStep(orderId);
  await preauthorizeRefundStep(orderId);
  const filed = await createReturnStep(order, reason);
  return { orderId, returnId: filed.id };
}

async function getOrderStep(orderId: string): Promise<Order> {
  "use step";
  return getOrder(orderId);
}
async function notifyReturnInProcessStep(orderId: string): Promise<void> {
  "use step";
  await notifyReturnInProcess(orderId);
}
async function preauthorizeRefundStep(orderId: string): Promise<void> {
  "use step";
  await preauthorizeRefund(orderId);
}
async function createReturnStep(order: Order, reason: string): Promise<Return> {
  "use step";
  return createReturn({
    orderId: order.id,
    items: order.items.map((i) => ({
      productId: i.productId,
      quantity: i.quantity,
    })),
    reason,
  });
}
