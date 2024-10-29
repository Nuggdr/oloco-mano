// pages/api/updatePlanStatus.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '../../lib/dbConnect';
import User from '../../models/User';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await dbConnect();

  if (req.method === 'POST') {
    const { userId, planId } = req.body;

    try {
      // Atualiza o usuário para incluir o plano adquirido
      await User.findByIdAndUpdate(userId, { planId });
      res.status(200).json({ message: 'Plano do usuário atualizado com sucesso' });
    } catch (error) {
      console.error('Erro ao atualizar o plano do usuário:', error);
      res.status(500).json({ error: 'Erro ao atualizar o plano do usuário' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Método ${req.method} não permitido`);
  }
}
