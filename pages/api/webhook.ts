import { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '../../lib/dbConnect';
import Payment from '../../models/Payment';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await dbConnect();

  if (req.method === 'POST') {
    const { type, data } = req.body;

    if (type === 'payment') {
      const paymentId = data.id;

      try {
        // Obtenha os detalhes do pagamento diretamente da API do Mercado Pago
        const mercadoPagoResponse = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
          headers: {
            Authorization: `Bearer APP_USR-7757243395799799-101720-7dace157bdd88e3ed4eff645a686a947-820552196`,
          },
        });

        if (!mercadoPagoResponse.ok) {
          return res.status(500).json({ message: 'Erro ao obter detalhes do pagamento.' });
        }

        const paymentData = await mercadoPagoResponse.json();

        // Atualize o status do pagamento no banco de dados
        await Payment.updateOne(
          { paymentLink: paymentData.external_reference },
          { status: paymentData.status }
        );

        return res.status(200).json({ message: 'Status atualizado com sucesso' });
      } catch (error) {
        console.error('Erro ao processar o webhook:', error);
        return res.status(500).json({ message: 'Erro interno ao processar o webhook.' });
      }
    } else {
      return res.status(400).json({ message: 'Tipo de evento desconhecido' });
    }
  } else {
    return res.status(405).json({ message: 'Método não permitido' });
  }
}
