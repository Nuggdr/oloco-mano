import { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '../../lib/dbConnect';
import User from '../../models/User';
import Plan from '../../models/Plan';
import bcrypt from 'bcryptjs';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    await dbConnect();

    if (req.method === 'POST') {
        const { username, email, password } = req.body;

        // Aqui você pode definir qual plano usar, caso um plano padrão seja necessário
        const plan = await Plan.findOne(); // Altere isso para o plano desejado
        console.log('Plano encontrado:', plan); // Log do plano encontrado
        if (!plan) {
            return res.status(400).json({ error: 'Nenhum plano disponível' });
        }

        // Hash da senha antes de salvar
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({
            username,
            email,
            password: hashedPassword,
            planId: plan._id, // Associa o plano, se necessário
            machineId: null, // Nenhuma máquina associada inicialmente
        });

        console.log('Novo usuário:', newUser); // Log do novo usuário antes de salvar

        // Salva o usuário
        await newUser.save();

        res.status(201).json(newUser);
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Método ${req.method} não permitido`);
    }
}
