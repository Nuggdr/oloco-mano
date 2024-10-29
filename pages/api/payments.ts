// pages/api/payments.ts
import { NextApiRequest, NextApiResponse } from 'next';
import mercadopago from 'mercadopago';

// Configuração do Mercado Pago
mercadopago.configure({
  access_token: 'APP_USR-7555421413075086-101720-8a09af40ce7a699b5c60416b6d0cba85-820552196', // Insira seu Access Token
});

// Defina os planos
const plans = [
  {
    id: 1,
    title: 'Plano Horas',
    price: '1,90',
    duration: '12 horas',
    processor: 'AMD EPYC',
    gpu: 'NVIDIA Tesla T4',
    ram: '28 GB',
    storage: '256 GB SSD',
  },
  {
    id: 2,
    title: 'Plano Semanal',
    price: '27,99',
    duration: 'semanal',
    processor: 'AMD EPYC',
    gpu: 'NVIDIA Tesla T4',
    ram: '28 GB',
    storage: '256 GB SSD',
  },
  {
    id: 3,
    title: 'Plano Mensal',
    price: '69,99',
    duration: 'mensal',
    processor: 'AMD EPYC',
    gpu: 'NVIDIA Tesla T4',
    ram: '28 GB',
    storage: '256 GB SSD',
  },
];

const handlePayment = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    const { planId } = req.body; // Removi o 'username'

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
            unit_price: parseFloat(plan.price.replace(',', '.')), // Converte o preço para float
            quantity: 1,
          },
        ],
        back_urls: {
          success: 'http://localhost:3000/payment-success', // URL de sucesso
          failure: 'http://localhost:3000/payment-failure', // URL de falha
          pending: 'http://localhost:3000/payment-pending', // URL de pendência
        },
        auto_return: 'approved',
      };

      const mercadoPagoResponse = await mercadopago.preferences.create(preference);
      res.status(200).json({ link: mercadoPagoResponse.body.init_point });
    } catch (error) {
      console.error('Erro ao criar preferência de pagamento:', error);
      res.status(500).json({ error: 'Erro ao processar o pagamento.' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
};

export default handlePayment;
