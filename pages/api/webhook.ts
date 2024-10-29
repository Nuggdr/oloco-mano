// pages/api/webhook.ts
import { NextApiRequest, NextApiResponse } from 'next';

const webhookHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    const { data } = req.body;

    // Lógica para tratar os dados recebidos do Mercado Pago
    console.log('Notificação recebida:', data);

    // Verifique o status do pagamento e atualize seu banco de dados, se necessário
    if (data.status === 'approved') {
      // Código para tratar o pagamento aprovado
    }

    res.status(200).send('OK');
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
};

export default webhookHandler;
