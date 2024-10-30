import { NextApiRequest, NextApiResponse } from 'next';
import mercadopago from 'mercadopago';

// Configuração do Mercado Pago
mercadopago.configure({
  access_token: 'APP_USR-7757243395799799-101720-7dace157bdd88e3ed4eff645a686a947-820552196', // Insira seu Access Token
});

// Definição dos planos
const plans = [
  {
    id: 1,
    title: 'Plano Horas',
    price: 1.90, // ajuste para formato numérico
    duration: '12 horas',
    processor: 'AMD EPYC',
    gpu: 'NVIDIA Tesla T4',
    ram: '28 GB',
    storage: '256 GB SSD',
  },
  {
    id: 2,
    title: 'Plano Semanal',
    price: 27.99,
    duration: 'semanal',
    processor: 'AMD EPYC',
    gpu: 'NVIDIA Tesla T4',
    ram: '28 GB',
    storage: '256 GB SSD',
  },
  {
    id: 3,
    title: 'Plano Mensal',
    price: 69.99,
    duration: 'mensal',
    processor: 'AMD EPYC',
    gpu: 'NVIDIA Tesla T4',
    ram: '28 GB',
    storage: '256 GB SSD',
  },
];

const handlePayment = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    const { planId } = req.body; // Recebe o ID do plano

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
            unit_price: plan.price, // Preço já é numérico
            quantity: 1,
          },
        ],
        back_urls: {
          success: 'https://cyphercloud.store/payment-success', // URL de sucesso
          failure: 'https://cyphercloud.store/payment-failure', // URL de falha
          pending: 'https://cyphercloud.store/payment-pending', // URL de pendência
        },
        auto_return: 'approved',
        notification_url: 'https://cyphercloud.store/api/webhook', // URL do webhook
      };

      // Criação da preferência
      const mercadoPagoResponse = await mercadopago.preferences.create(preference);
      
      // Responde com o link de pagamento
      res.status(200).json({ link: mercadoPagoResponse.body.init_point });
    } catch (error: any) { // Definindo o tipo do erro como any
      // Melhora a mensagem de erro
      const errorMessage = error.response?.data || error.message;
      console.error('Erro ao criar preferência de pagamento:', errorMessage);
      res.status(500).json({ error: 'Erro ao processar o pagamento.', details: errorMessage });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
};

export default handlePayment;
