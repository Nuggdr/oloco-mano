import { NextApiRequest, NextApiResponse } from 'next';
import mercadopago from 'mercadopago';
import dbConnect from '../../lib/dbConnect'; // Ajuste o caminho se necessário
import Payment from '../../models/Payment'; // Ajuste o caminho do modelo de Payment

// Configuração do Mercado Pago
mercadopago.configure({
  access_token: 'APP_USR-7757243395799799-101720-7dace157bdd88e3ed4eff645a686a947-820552196', // Insira seu Access Token
});

// Definição dos planos
const plans = [
  {
    id: 1,
    title: 'Plano Horas',
    price: '1.90',
    duration: '12 horas',
    processor: 'AMD EPYC',
    gpu: 'NVIDIA Tesla T4',
    ram: '28 GB',
    storage: '256 GB SSD',
  },
  {
    id: 2,
    title: 'Plano Semanal',
    price: '27.99',
    duration: 'semanal',
    processor: 'AMD EPYC',
    gpu: 'NVIDIA Tesla T4',
    ram: '28 GB',
    storage: '256 GB SSD',
  },
  {
    id: 3,
    title: 'Plano Mensal',
    price: '69.99',
    duration: 'mensal',
    processor: 'AMD EPYC',
    gpu: 'NVIDIA Tesla T4',
    ram: '28 GB',
    storage: '256 GB SSD',
  },
];

const handlePayment = async (req: NextApiRequest, res: NextApiResponse) => {
  await dbConnect(); // Conecta ao banco de dados

  if (req.method === 'POST') {
    const { planId, userId } = req.body; // Recebe o ID do plano e o ID do usuário

    // Verifica se planId e userId são válidos
    if (typeof planId !== 'number' || typeof userId !== 'string') {
      return res.status(400).json({ error: 'ID do plano deve ser um número e o ID do usuário deve ser uma string.' });
    }

    // Encontre o plano baseado no ID
    const plan = plans.find((p) => p.id === planId);

    if (!plan) {
      return res.status(400).json({ error: 'Plano não encontrado.' });
    }

    // Criação da preferência de pagamento
    try {
      const preference = {
        items: [
          {
            title: plan.title,
            unit_price: parseFloat(plan.price),
            quantity: 1,
          },
        ],
        back_urls: {
          success: 'https://cyphercloud.store/payment-success',
          failure: 'https://cyphercloud.store/payment-failure',
          pending: 'https://cyphercloud.store/payment-pending',
        },
        auto_return: 'approved',
        notification_url: 'https://cyphercloud.store/api/webhook',
      };

      const mercadoPagoResponse = await mercadopago.preferences.create(preference);

      // Salva o pagamento no banco de dados
      const newPayment = new Payment({
        userId: userId, // ID do usuário
        planId: planId, // ID do plano
        paymentLink: mercadoPagoResponse.body.init_point, // Link de pagamento
        status: 'pending', // Status inicial do pagamento
      });

      await newPayment.save(); // Salva no banco de dados

      res.status(200).json({ link: mercadoPagoResponse.body.init_point });
    } catch (error) {
      // Tratamento do erro sem usar any
      if (error instanceof Error) {
        console.error('Erro ao criar preferência de pagamento:', error.message);
      } else if (typeof error === 'object' && error !== null && 'response' in error) {
        console.error('Erro ao criar preferência de pagamento:', (error as { response?: { data?: unknown } }).response?.data || error);
      } else {
        console.error('Erro inesperado:', error);
      }
      res.status(500).json({ error: 'Erro ao processar o pagamento.' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
};

export default handlePayment;
