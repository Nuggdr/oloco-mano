import { NextApiRequest, NextApiResponse } from 'next';
import mercadoPago from 'mercadopago';
import dbConnect from '../../lib/dbConnect'; // Ajuste o caminho conforme necessário
import Payment from '../../models/Payment'; // Ajuste o caminho conforme necessário

// Configurar Mercado Pago
mercadoPago.configure({
  access_token: 'TEST-7757243395799799-101720-d13b0e62c96962384b36b29f4c14c5e9-820552196',
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { userId, planId } = req.body;

    try {
      await dbConnect(); // Conectar ao MongoDB

      // Criar a preferência de pagamento
      const mercadoPagoResponse = await mercadoPago.preferences.create({
        items: [
          {
            title: `Plano ${planId}`,
            quantity: 1,
            unit_price: parseFloat(planId), // Ajuste para pegar o preço real do plano
          },
        ],
        back_urls: {
          success: 'https://cyphercloud.store/api/payment-sucesso',
          failure: 'https://cyphercloud.store/api/payment-failure',
          pending: 'https://cyphercloud.store/api/payment-panding',
        },
        auto_return: 'approved',
      });

      const { id, init_point } = mercadoPagoResponse.body;

      // Verifique se o paymentId é válido
      if (!id) {
        throw new Error('Pagamento não foi criado corretamente. ID é nulo.');
      }

      // Salve o pagamento no banco de dados com `paymentId`
      const newPayment = await Payment.create({
        userId,
        planId,
        paymentId: id, // O id deve ser válido
        paymentLink: init_point,
        status: 'pending',
      });

      res.status(201).json(newPayment);
    } catch (error) {
      console.error('Erro ao criar preferência de pagamento:', error);
      res.status(500).json({ message: 'Erro ao criar preferência de pagamento', error: error.message });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
