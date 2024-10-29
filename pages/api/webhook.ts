import { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '../../lib/dbConnect';
import Payment from '../../models/Payment';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await dbConnect();

  if (req.method === 'POST') {
    const { type, data } = req.body;

    if (type === 'payment') {
      const paymentId = data.id;
      console.log('ID do pagamento recebido:', paymentId);

      try {
        // Obtenha os detalhes do pagamento diretamente da API do Mercado Pago
        const mercadoPagoResponse = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
          headers: {
            Authorization: `Bearer APP_USR-7757243395799799-101720-7dace157bdd88e3ed4eff645a686a947-820552196`,
          },
        });

        if (!mercadoPagoResponse.ok) {
          console.error('Erro ao obter detalhes do pagamento:', mercadoPagoResponse.statusText);
          return res.status(500).json({ message: 'Erro ao obter detalhes do pagamento.' });
        }

        const paymentData = await mercadoPagoResponse.json();
        console.log('Dados do pagamento obtidos:', paymentData);

        // Atualize o status do pagamento no banco de dados
        const updateResult = await Payment.updateOne(
          { paymentLink: paymentData.external_reference },
          { status: paymentData.status }
        );

        if (updateResult.modifiedCount === 0) {
          console.warn('Nenhum pagamento atualizado no banco de dados.');
          return res.status(404).json({ message: 'Pagamento não encontrado no banco de dados.' });
        }

        console.log('Status atualizado com sucesso no banco de dados.');
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
