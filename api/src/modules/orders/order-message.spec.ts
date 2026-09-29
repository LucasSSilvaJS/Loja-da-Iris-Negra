import { buildOrderMessage, buildWhatsappUrl } from './order-message';

describe('mensagem do pedido', () => {
  const order = {
    code: 'IRN-0001',
    totalCents: 8900,
    items: [
      {
        name: 'Camiseta Raven',
        size: 'M',
        quantity: 1,
        unitPriceCents: 8900,
      },
    ],
  };

  it('escreve o resumo que vai para o WhatsApp', () => {
    const text = buildOrderMessage(order);

    expect(text).toContain('Pedido IRN-0001 — Loja Íris Negra');
    expect(text).toContain('1× Camiseta Raven (M)');
    expect(text).toContain('Total:');
    expect(text).not.toContain('Nome:');
  });

  it('monta o link do WhatsApp só quando existe número', () => {
    expect(buildWhatsappUrl(undefined, 'oi')).toBeNull();
    expect(buildWhatsappUrl('55 (81) 99999-0000', 'oi')).toBe(
      'https://wa.me/5581999990000?text=oi',
    );
  });
});
