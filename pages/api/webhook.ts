import { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '../../lib/dbConnect'; // Importa sua função de conexão ao banco
import Payment from '../../models/Payment'; // Importa o modelo de pagamento

const handleWebhook = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    try {
      await dbConnect(); // Conecta ao banco de dados

      // Os dados do pagamento enviados pelo Mercado Pago
      const { id, status } = req.body; // 'id' é o paymentId e 'status' é o novo status do pagamento

      // Encontre o pagamento no banco de dados
      const payment = await Payment.findOne({ paymentId: id });

      if (!payment) {
        return res.status(404).json({ error: 'Pagamento não encontrado.' });
      }

      // Atualize o status do pagamento
      payment.status = status; // Atualiza o status do pagamento
      await payment.save(); // Salva as alterações

      res.status(200).json({ message: 'Pagamento atualizado com sucesso.' });
    } catch (error: unknown) {
      console.error('Erro ao processar webhook:', error);
      res.status(500).json({ error: 'Erro interno do servidor.' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
};

export default handleWebhook;
