/**
 * Mock data for development and testing
 * AI-generated mock transactions and analytics data
 */

export const mockTransactions = [
  {
    id: '7f3d8b2a-1c4e-4a9b-8d7f-3e2a1b4c5d6e',
    source: 'stripe',
    merchant_id: '550e8400-e29b-41d4-a716-446655440000',
    amount: 150.00,
    currency: 'USD',
    status: 'completed',
    payload: {
      customer_email: 'customer@example.com',
      stripe_charge_id: 'ch_abc123',
      payment_method: 'card',
      card_brand: 'visa',
      card_last4: '4242'
    },
    created_at: '2024-01-15T10:30:00Z',
    updated_at: '2024-01-15T10:30:00Z'
  },
  {
    id: '8a9b0c1d-2e3f-4a5b-6c7d-8e9f0a1b2c3d',
    source: 'paypal',
    merchant_id: '550e8400-e29b-41d4-a716-446655440000',
    amount: 75.50,
    currency: 'USD',
    status: 'completed',
    payload: {
      payer_email: 'payer@example.com',
      paypal_transaction_id: 'PAYID-ABC123XYZ',
      payment_method: 'paypal_account'
    },
    created_at: '2024-01-14T15:45:00Z',
    updated_at: '2024-01-14T15:45:00Z'
  },
  {
    id: '9b0c1d2e-3f4a-5b6c-7d8e-9f0a1b2c3d4e',
    source: 'square',
    merchant_id: '550e8400-e29b-41d4-a716-446655440000',
    amount: 99.99,
    currency: 'USD',
    status: 'pending',
    payload: {
      customer_id: 'cust_123',
      location_id: 'loc_456',
      payment_method: 'card'
    },
    created_at: '2024-01-14T09:20:00Z',
    updated_at: '2024-01-14T09:20:00Z'
  },
  {
    id: 'a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d',
    source: 'stripe',
    merchant_id: '550e8400-e29b-41d4-a716-446655440000',
    amount: 250.00,
    currency: 'USD',
    status: 'failed',
    payload: {
      customer_email: 'failed@example.com',
      error_code: 'card_declined',
      error_message: 'Your card was declined',
      payment_method: 'card'
    },
    created_at: '2024-01-13T14:10:00Z',
    updated_at: '2024-01-13T14:10:00Z'
  },
  {
    id: 'b2c3d4e5-f6a7-8b9c-0d1e-2f3a4b5c6d7e',
    source: 'paypal',
    merchant_id: '550e8400-e29b-41d4-a716-446655440000',
    amount: 125.75,
    currency: 'USD',
    status: 'completed',
    payload: {
      payer_email: 'buyer@example.com',
      paypal_transaction_id: 'PAYID-XYZ789ABC',
      payment_method: 'paypal_account'
    },
    created_at: '2024-01-12T11:30:00Z',
    updated_at: '2024-01-12T11:30:00Z'
  },
  {
    id: 'c3d4e5f6-a7b8-9c0d-1e2f-3a4b5c6d7e8f',
    source: 'square',
    merchant_id: '550e8400-e29b-41d4-a716-446655440000',
    amount: 450.00,
    currency: 'USD',
    status: 'completed',
    payload: {
      customer_id: 'cust_789',
      location_id: 'loc_456',
      payment_method: 'card',
      card_brand: 'mastercard'
    },
    created_at: '2024-01-11T16:45:00Z',
    updated_at: '2024-01-11T16:45:00Z'
  },
  {
    id: 'd4e5f6a7-b8c9-0d1e-2f3a-4b5c6d7e8f9a',
    source: 'stripe',
    merchant_id: '550e8400-e29b-41d4-a716-446655440000',
    amount: 89.99,
    currency: 'USD',
    status: 'refunded',
    payload: {
      customer_email: 'refund@example.com',
      stripe_charge_id: 'ch_refund123',
      refund_reason: 'customer_request',
      payment_method: 'card'
    },
    created_at: '2024-01-10T08:15:00Z',
    updated_at: '2024-01-10T10:30:00Z'
  },
  {
    id: 'e5f6a7b8-c9d0-1e2f-3a4b-5c6d7e8f9a0b',
    source: 'paypal',
    merchant_id: '550e8400-e29b-41d4-a716-446655440000',
    amount: 320.50,
    currency: 'USD',
    status: 'processing',
    payload: {
      payer_email: 'processing@example.com',
      paypal_transaction_id: 'PAYID-PROC123',
      payment_method: 'paypal_account'
    },
    created_at: '2024-01-09T13:20:00Z',
    updated_at: '2024-01-09T13:25:00Z'
  }
];

export const mockAnalytics = {
  totalVolume: 15750.50,
  totalTransactions: 237,
  countByStatus: {
    pending: 15,
    processing: 8,
    completed: 200,
    failed: 10,
    refunded: 3,
    cancelled: 1
  },
  topSources: [
    {
      source: 'stripe',
      count: 120,
      volume: 8500.00
    },
    {
      source: 'paypal',
      count: 85,
      volume: 5250.50
    },
    {
      source: 'square',
      count: 32,
      volume: 2000.00
    }
  ],
  averageTransactionAmount: 78.75,
  successRate: 84.38,
  volumeOverTime: [
    { date: '2024-01-01', volume: 1200.00, count: 15 },
    { date: '2024-01-02', volume: 850.50, count: 12 },
    { date: '2024-01-03', volume: 2100.00, count: 18 },
    { date: '2024-01-04', volume: 980.25, count: 10 },
    { date: '2024-01-05', volume: 1500.00, count: 20 },
    { date: '2024-01-06', volume: 750.00, count: 8 },
    { date: '2024-01-07', volume: 1890.50, count: 22 }
  ]
};

export const mockPagination = {
  page: 1,
  limit: 50,
  total: 237,
  totalPages: 5
};
