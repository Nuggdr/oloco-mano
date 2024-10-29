import { useEffect } from 'react';
import { useRouter } from 'next/router';

const PaymentSuccess = () => {
  const router = useRouter();

  useEffect(() => {
    const { userId } = router.query; // Pegue o parâmetro do userId na URL
    console.log('userId:', userId); // Adicione este log para verificar se userId está definido

    // Função para atribuir a máquina
    const assignMachine = async () => {
      if (userId) {
        try {
          const response = await fetch('/api/assign-machine', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userId }), // Envie o userId
          });

          const data = await response.json(); // Obtenha a resposta JSON

          if (!response.ok) {
            throw new Error(data.message || 'Erro ao atribuir a máquina');
          }

          console.log(data.message); // Mensagem de sucesso
        } catch (error) {
          console.error('Erro ao atribuir a máquina:', error);
        }
      } else {
        console.warn('userId não está definido'); // Log se userId não estiver definido
      }
    };

    assignMachine();
  }, [router.query]);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h1 className="text-3xl font-bold text-green-600">Pagamento Bem-sucedido!</h1>
      <p className="mt-4 text-lg text-green-500">Obrigado pela sua compra!</p>
      <p className="mt-2 text-lg text-green-500">Uma máquina foi atribuída a você.</p>
    </div>
  );
};

export default PaymentSuccess;
