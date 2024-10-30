// pages/api/webhook.ts
import { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '../../lib/dbConnect';
import Payment from '../../models/Payment'; // Ajuste o caminho conforme necessário

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      await dbConnect(); // Conectar ao MongoDB
      
      // Obter os dados do pagamento do corpo da requisição
      const paymentData = req.body;

      // Verifique o status do pagamento
      if (paymentData.type === 'payment') {
        const paymentId = paymentData.data.id;
        const paymentStatus = paymentData.data.status;

        // Atualize o status do pagamento no banco de dados
        await Payment.updateOne(
          { paymentId },
          { status: paymentStatus }
        );

        res.status(200).json({ message: 'Status do pagamento atualizado com sucesso' });
      } else {
        res.status(400).json({ message: 'Tipo de evento não suportado' });
      }
    } catch (error) {
      console.error('Erro ao processar webhook:', error);
      res.status(500).json({ message: 'Erro interno do servidor' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
