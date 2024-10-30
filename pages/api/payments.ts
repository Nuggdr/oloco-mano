import { NextApiRequest, NextApiResponse } from 'next';
import mercadopago from 'mercadopago';
import dbConnect from '../../lib/dbConnect'; // Importa sua função de conexão ao banco
import Payment from '../../models/Payment'; // Importa o modelo de pagamento

// Configuração do Mercado Pago
mercadopago.configure({
  access_token: 'APP_USR-7757243395799799-101720-7dace157bdd88e3ed4eff645a686a947-820552196', // Insira seu Access Token
});

// Definição dos planos
const plans = [
  {
    id: 1,
    title: 'Plano Horas',
    price: 1.90,
  },
  {
    id: 2,
    title: 'Plano Semanal',
    price: 27.99,
  },
  {
    id: 3,
    title: 'Plano Mensal',
    price: 69.99,
  },
];

const handlePayment = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    const { planId, userId } = req.body; // Recebe o ID do plano e o ID do usuário

    const plan = plans.find((p) => p.id === planId);

    if (!plan) {
      return res.status(400).json({ error: 'Plano não encontrado.' });
    }

    try {
      await dbConnect(); // Conecta ao banco de dados

      // Criação da preferência de pagamento
      const preference = {
        items: [
          {
            title: plan.title,
            unit_price: plan.price,
            quantity: 1,
          },
        ],
        back_urls: {
          success: 'https://www.cyphercloud.store/api/webhook',
          failure: 'https://www.cyphercloud.store/api/webhook',
          pending: 'https://www.cyphercloud.store/api/webhook',
        },
        auto_return: 'approved',
        notification_url: 'https://www.cyphercloud.store/api/webhook',
      };

      // Criar preferência no Mercado Pago
      const mercadoPagoResponse = await mercadopago.preferences.create(preference);

      // Salva o pagamento no banco de dados, incluindo o paymentId
      const paymentData = new Payment({
        userId, // Armazena o ID do usuário
        planId,
        paymentId: mercadoPagoResponse.body.id, // Adiciona o paymentId retornado
        status: 'pending', // Status inicial
        amount: plan.price, // Valor do plano
      });

      await paymentData.save(); // Salva os dados no MongoDB

      // Retorna o link para a inicialização do pagamento
      res.status(200).json({ link: mercadoPagoResponse.body.init_point });
    } catch (error: unknown) {
      let errorMessage = 'Erro ao processar o pagamento.';
      if (error instanceof Error) {
        errorMessage = error.message;
      }

      console.error('Erro ao criar preferência de pagamento:', errorMessage);
      res.status(500).json({ error: errorMessage });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
};

export default handlePayment;
