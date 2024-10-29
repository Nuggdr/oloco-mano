// pages/payment-failure.tsx
import { useEffect } from 'react';
import { useRouter } from 'next/router';

const PaymentFailure = () => {
  const router = useRouter();

  useEffect(() => {
    // Redirecionar após 5 segundos
    const timer = setTimeout(() => {
      router.push('/'); // Redireciona para a página inicial ou qualquer outra página
    }, 5000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center">
      <h1 className="text-5xl font-bold">Pagamento Falhou!</h1>
      <p className="mt-4 text-lg">Infelizmente, houve um problema com sua compra. Você será redirecionado em breve.</p>
    </div>
  );
};

export default PaymentFailure;
