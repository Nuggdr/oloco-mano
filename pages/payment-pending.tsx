// pages/payment-pending.tsx
import { useEffect } from 'react';
import { useRouter } from 'next/router';

const PaymentPending = () => {
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
      <h1 className="text-5xl font-bold">Pagamento Pendente!</h1>
      <p className="mt-4 text-lg">Seu pagamento está sendo processado. Você será redirecionado em breve.</p>
    </div>
  );
};

export default PaymentPending;
