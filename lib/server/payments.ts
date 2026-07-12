import 'server-only'

import { MARKETPLACE_MODEL, type PaymentStatus } from '@/lib/marketplace'
import { sessionEconomics } from '@/lib/platform'

export const STRIPE_REQUIRED_WEBHOOKS = [
  'checkout.session.completed',
  'checkout.session.expired',
  'payment_intent.processing',
  'payment_intent.payment_failed',
  'charge.refunded',
  'charge.dispute.created',
  'charge.dispute.closed',
  'account.updated',
  'payout.paid',
  'payout.failed',
] as const

export interface CheckoutContract {
  bookingId: string
  candidateEmail: string
  professionalStripeAccountId: string
  priceDkk: number
  contributionPercent: number
}

export function paymentConfiguration() {
  const configured = Boolean(
    process.env.STRIPE_SECRET_KEY
    && process.env.STRIPE_WEBHOOK_SECRET
    && process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
  )
  const enabled = configured && process.env.PAYMENTS_ENABLED === 'true'
  return {
    provider: 'stripe',
    connectModel: MARKETPLACE_MODEL.chargeModel,
    configured,
    enabled,
    currency: 'dkk',
  } as const
}

export function checkoutAmounts(contract: CheckoutContract) {
  const economics = sessionEconomics(contract.priceDkk, contract.contributionPercent)
  return {
    amount: economics.candidatePrice * 100,
    currency: 'dkk' as const,
    professionalTransferAmount: economics.professionalPayout * 100,
    platformAmount: economics.platformFee * 100,
    contributionAmount: economics.contribution * 100,
    vatAmount: economics.vat * 100,
  }
}

export function assertPaymentsEnabled() {
  const config = paymentConfiguration()
  if (!config.configured) throw new Error('Stripe is not configured.')
  if (!config.enabled) throw new Error('Payments are intentionally disabled until legal and operational approval.')
  return config
}

export function paymentStatusFromEvent(eventType: string): PaymentStatus | null {
  if (eventType === 'checkout.session.completed') return 'paid'
  if (eventType === 'payment_intent.processing') return 'processing'
  if (eventType === 'payment_intent.payment_failed' || eventType === 'checkout.session.expired') return 'failed'
  if (eventType === 'charge.refunded') return 'refunded'
  return null
}
