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

  it('lista as peças da caixa e cobra o valor da box', () => {
    const text = buildOrderMessage({
      code: 'IRN-0002',
      totalCents: 4200,
      boxSize: 'P',
      items: [
        {
          name: 'Caixa P \u2014 Noite curta',
          size: '\u00fanico',
          quantity: 1,
          unitPriceCents: 4200,
          note: 'Camisa \u00cdris (P, preto)\nSeda (Slim)',
        },
      ],
    });

    expect(text).toContain('Caixa P \u2014 Noite curta');
    expect(text).toContain('Camisa \u00cdris (P, preto)');
    expect(text).toContain('  Seda (Slim)');
    expect(text).not.toContain('(\u00fanico)');
    expect(text).toContain('As pe\u00e7as ficam entre o valor da caixa e 10% a mais.');
    expect(text).toContain('O valor cobrado \u00e9 o pre\u00e7o da caixa, n\u00e3o a soma das pe\u00e7as.');
    expect(text).not.toContain('Caixa P montada no site.');
  });

  it('monta o link do WhatsApp só quando existe número', () => {
    expect(buildWhatsappUrl(undefined, 'oi')).toBeNull();
    expect(buildWhatsappUrl('55 (81) 99999-0000', 'oi')).toBe(
      'https://wa.me/5581999990000?text=oi',
    );
    expect(buildWhatsappUrl('81983437379', 'oi')).toBe(
      'https://wa.me/5581983437379?text=oi',
    );
  });
});
