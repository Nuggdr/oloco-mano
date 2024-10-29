import { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '../../lib/dbConnect';
import Payment from '../../models/Payment';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await dbConnect();

  if (req.method === 'POST') {
    const { planId, username } = req.body;

    try {
      // Criação da preferência de pagamento no Mercado Pago
      const mercadoPagoResponse = await fetch('https://api.mercadopago.com/checkout/preferences', {
        method: 'POST',
        headers: {
          Authorization: `Bearer APP_USR-7757243395799799-101720-7dace157bdd88e3ed4eff645a686a947-820552196`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items: [{ title: `Plano ${planId}`, quantity: 1, unit_price: parseFloat(planId) }],
          external_reference: `user_${username}_plan_${planId}`, // Referência única
        }),
      });

      if (!mercadoPagoResponse.ok) {
        throw new Error('Erro ao criar preferência de pagamento.');
      }

      const { id, init_point } = await mercadoPagoResponse.json();

      // Salve o pagamento no banco de dados com `paymentId`
      await Payment.create({
        userId: username,
        planId,
        paymentId: id,
        paymentLink: init_point,
        status: 'pending',
      });

      res.status(200).json({ link: init_point });
    } catch (error) {
      console.error('Erro ao criar preferência de pagamento:', error);
      res.status(500).json({ message: 'Erro ao criar preferência de pagamento.' });
    }
  } else {
    res.status(405).json({ message: 'Método não permitido' });
  }
}
