const NOWPAYMENTS_API_URL = 'https://api.nowpayments.io/v1';

interface CreatePaymentParams {
  priceAmount: number;
  priceCurrency: string;
  payCurrency: string; // e.g., 'btc', 'ada'
  orderId: string;
  orderDescription?: string;
}

interface NowPaymentResponse {
  payment_id: string;
  payment_status: string;
  pay_address: string;
  pay_amount: number;
  pay_currency: string;
  price_amount: number;
  price_currency: string;
  order_id: string;
  [key: string]: unknown;
}

export async function createPayment(params: CreatePaymentParams): Promise<NowPaymentResponse> {
  const res = await fetch(`${NOWPAYMENTS_API_URL}/payment`, {
    method: 'POST',
    headers: {
      'x-api-key': process.env.NOWPAYMENTS_API_KEY!,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      price_amount: params.priceAmount,
      price_currency: params.priceCurrency,
      pay_currency: params.payCurrency,
      order_id: params.orderId,
      order_description: params.orderDescription,
      ipn_callback_url: `${process.env.NEXT_PUBLIC_APP_URL}/api/webhooks/nowpayments`,
    }),
  });

  if (!res.ok) {
    const error = await res.text();
    throw new Error(`NOWPayments API error: ${error}`);
  }

  return res.json();
}

export async function getPaymentStatus(paymentId: string): Promise<NowPaymentResponse> {
  const res = await fetch(`${NOWPAYMENTS_API_URL}/payment/${paymentId}`, {
    headers: {
      'x-api-key': process.env.NOWPAYMENTS_API_KEY!,
    },
  });

  if (!res.ok) throw new Error('Failed to fetch payment status');
  return res.json();
}
