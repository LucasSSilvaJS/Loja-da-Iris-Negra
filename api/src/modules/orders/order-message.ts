export type OrderMessageItem = {
  name: string;
  size: string;
  quantity: number;
  unitPriceCents: number;
};

export type OrderMessageInput = {
  code: string;
  items: OrderMessageItem[];
  totalCents: number;
};

export function formatCents(cents: number): string {
  return (cents / 100).toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });
}

export function buildOrderMessage(order: OrderMessageInput): string {
  const lines = [
    `Pedido ${order.code} — Loja Íris Negra`,
    '',
    'Itens:',
    ...order.items.map(
      (item) =>
        `• ${item.quantity}× ${item.name} (${item.size}) — ${formatCents(item.unitPriceCents * item.quantity)}`,
    ),
    '',
    `Total: ${formatCents(order.totalCents)}`,
    '',
    'Vim pelo site e quero combinar o pagamento e a entrega.',
  ];
  return lines.join('\n');
}

export function buildWhatsappUrl(
  phone: string | undefined,
  text: string,
): string | null {
  const digits = (phone ?? '').replace(/\D/g, '');
  if (!digits) return null;
  return `https://wa.me/${digits}?text=${encodeURIComponent(text)}`;
}
