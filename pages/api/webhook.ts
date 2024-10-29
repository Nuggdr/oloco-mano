import { NextApiRequest, NextApiResponse } from 'next';
import mercadopago from 'mercadopago';
import dbConnect from '../../lib/dbConnect'; // Função de conexão com o MongoDB
import Payment from '../../models/Payment'; // Modelo do pagamento

mercadopago.configure({
  access_token: 'APP_USR-7757243395799799-101720-7dace157bdd88e3ed4eff645a686a947-820552196',
});

const webhookHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  await dbConnect(); // Conecta ao MongoDB

  if (req.method === 'POST') {
    const { type, data } = req.body;

    // Verifica se é notificação de pagamento
    if (type === 'payment') {
      try {
        // Obtém informações do pagamento pelo ID recebido
        const paymentResponse = await (mercadopago as any).payment.findById(data.id);
        const status = paymentResponse.body.status;
        
        // Atualiza ou insere o status no banco de dados
        await Payment.updateOne(
          { paymentId: data.id }, // Busca pelo ID do pagamento
          { status },              // Atualiza o status
          { upsert: true }         // Insere caso não exista
        );

        res.status(200).json({ message: 'Pagamento processado com sucesso', status });
      } catch (error) {
        console.error('Erro ao verificar pagamento:', error);
        res.status(500).json({ error: 'Erro ao verificar pagamento.' });
      }
    } else {
      res.status(400).json({ error: 'Tipo de notificação desconhecido.' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
};

export default webhookHandler;
