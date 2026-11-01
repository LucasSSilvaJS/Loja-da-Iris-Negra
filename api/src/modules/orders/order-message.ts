export type OrderMessageItem = {
  name: string;
  size: string;
  color?: string;
  quantity: number;
  unitPriceCents: number;
  note?: string;
};

export type OrderMessageInput = {
  code: string;
  items: OrderMessageItem[];
  totalCents: number;
  boxSize?: string;
};

export function formatCents(cents: number): string {
  return (cents / 100).toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });
}

export function buildOrderMessage(order: OrderMessageInput): string {
  const consult = order.items.some((item) => item.unitPriceCents === 0);
  const lines = [
    `Pedido ${order.code} — Loja Íris Negra`,
    '',
    'Itens:',
    ...order.items.map((item) => {
      const variant = [item.size, item.color].filter((part) => part && part.length > 0);
      const amount =
        item.unitPriceCents === 0
          ? 'sob consulta'
          : formatCents(item.unitPriceCents * item.quantity);
      const shown = item.note ? variant.filter((part) => part !== '\u00fanico') : variant;
      const head = shown.length
        ? `\u2022 ${item.quantity}\u00d7 ${item.name} (${shown.join(', ')}) \u2014 ${amount}`
        : `\u2022 ${item.quantity}\u00d7 ${item.name} \u2014 ${amount}`;
      if (!item.note) return head;
      const details = item.note
        .split('\n')
        .map((line) => line.trim())
        .filter((line) => line.length > 0)
        .map((line) => `  ${line}`);
      return [head, ...details].join('\n');
    }),
    '',
    `Total: ${formatCents(order.totalCents)}`,
  ];
  if (order.items.some((item) => item.note)) {
    lines.push(
      '',
      'As pe\u00e7as ficam entre o valor da caixa e 10% a mais.',
      'O valor cobrado \u00e9 o pre\u00e7o da caixa, n\u00e3o a soma das pe\u00e7as.',
    );
  } else if (order.boxSize) {
    lines.push('', `Caixa ${order.boxSize} montada no site.`);
  }
  if (consult) {
    lines.push('', 'Itens sob consulta combinam o valor no WhatsApp.');
  }
  lines.push('', 'Vim pelo site e quero combinar o pagamento e a entrega.');
  return lines.join('\n');
}

export function buildWhatsappUrl(
  phone: string | undefined,
  text: string,
): string | null {
  const digits = (phone ?? '').replace(/\D/g, '');
  if (!digits) return null;
  const withCountry = digits.length === 10 || digits.length === 11 ? `55${digits}` : digits;
  return `https://wa.me/${withCountry}?text=${encodeURIComponent(text)}`;
}
