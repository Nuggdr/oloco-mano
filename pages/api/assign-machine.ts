import { NextApiRequest, NextApiResponse } from 'next';
import MachineModel from '../../models/Machine'; // Ajuste conforme necessário
import UserModel from '../../models/User'; // Ajuste conforme necessário

const assignMachine = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    const { userId } = req.body; // Altere para receber userId

    // Verifique se o usuário existe
    const user = await UserModel.findById(userId); // Buscando pelo ID do usuário
    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }

    // Encontre uma máquina disponível
    const machine = await MachineModel.findOne({ assigned: false });
    if (!machine) {
      return res.status(404).json({ message: 'Nenhuma máquina disponível' });
    }

    // Atribua a máquina ao usuário
    user.assignedMachine = machine._id; // Altere o campo conforme seu modelo
    await user.save();

    // Marque a máquina como atribuída
    machine.assigned = true; // Altere o campo conforme seu modelo
    await machine.save();

    return res.status(200).json({ message: 'Máquina atribuída com sucesso!' });
  } else {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Método ${req.method} não permitido`);
  }
};

export default assignMachine;
