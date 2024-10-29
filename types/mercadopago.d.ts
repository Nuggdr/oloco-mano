declare module 'mercadopago' {
  interface Payment {
      findById: (id: string) => Promise<{ body: { status: string } }>;
  }

  interface MercadoPago {
      configure: (config: { access_token: string }) => void;
      payment: Payment;
      preferences: {
          create: (data: any) => Promise<any>;
      };
  }

  const mercadopago: MercadoPago;
  export default mercadopago;
}
