/**
 * Stripe Server Integration
 * 
 * CRITICAL: Server-side only - uses secret key.
 * NEVER import in client components.
 */

import Stripe from 'stripe'
import { upgradePlan, cancelSubscription } from './quotaDb'
import { PLANS, type PlanId } from './plans'

const stripeSecretKey = process.env.STRIPE_SECRET_KEY!

if (!stripeSecretKey) {
  console.warn('[stripe] Missing STRIPE_SECRET_KEY - Stripe functionality disabled')
}

export const stripe = stripeSecretKey
  ? new Stripe(stripeSecretKey, {
      apiVersion: '2024-11-20.acacia',
      typescript: true,
    })
  : null

/**
 * Create Stripe checkout session for plan upgrade
 */
export async function createCheckoutSession(
  userId: string,
  planId: PlanId,
  successUrl: string,
  cancelUrl: string
): Promise<string> {
  if (!stripe) {
    throw new Error('Stripe not configured')
  }

  const plan = PLANS.find(p => p.id === planId)
  if (!plan || plan.id === 'trial') {
    throw new Error('Invalid plan for checkout')
  }

  if (!plan.stripe_price_id) {
    throw new Error('Plan missing Stripe price ID')
  }

  try {
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price: plan.stripe_price_id,
          quantity: 1,
        },
      ],
      client_reference_id: userId,
      metadata: {
        user_id: userId,
        plan_id: planId,
      },
      success_url: successUrl,
      cancel_url: cancelUrl,
      subscription_data: {
        metadata: {
          user_id: userId,
          plan_id: planId,
        },
      },
    })

    console.info('[stripe] Checkout session created:', { userId, planId, sessionId: session.id })
    return session.url!
  } catch (error) {
    console.error('[stripe] Error creating checkout session:', error)
    throw error
  }
}

/**
 * Create Stripe billing portal session
 */
export async function createBillingPortalSession(
  stripeCustomerId: string,
  returnUrl: string
): Promise<string> {
  if (!stripe) {
    throw new Error('Stripe not configured')
  }

  try {
    const session = await stripe.billingPortal.sessions.create({
      customer: stripeCustomerId,
      return_url: returnUrl,
    })

    console.info('[stripe] Billing portal session created:', stripeCustomerId)
    return session.url
  } catch (error) {
    console.error('[stripe] Error creating billing portal session:', error)
    throw error
  }
}

/**
 * Webhook Event Handlers
 */

export async function handleCheckoutCompleted(
  event: Stripe.CheckoutSessionCompletedEvent
): Promise<void> {
  const session = event.data.object

  const userId = session.metadata?.user_id
  const planId = session.metadata?.plan_id as PlanId
  const customerId = session.customer as string
  const subscriptionId = session.subscription as string

  if (!userId || !planId) {
    console.error('[stripe] Missing metadata in checkout.session.completed:', session.id)
    return
  }

  console.info('[stripe] Checkout completed:', { userId, planId, customerId, subscriptionId })

  try {
    await upgradePlan(userId, planId, customerId, subscriptionId)
    console.info('[stripe] Plan upgraded successfully after checkout')
  } catch (error) {
    console.error('[stripe] Error upgrading plan after checkout:', error)
    throw error
  }
}

export async function handleSubscriptionUpdated(
  event: Stripe.CustomerSubscriptionUpdatedEvent
): Promise<void> {
  const subscription = event.data.object
  const userId = subscription.metadata?.user_id

  if (!userId) {
    console.error('[stripe] Missing user_id in subscription.updated:', subscription.id)
    return
  }

  console.info('[stripe] Subscription updated:', {
    userId,
    subscriptionId: subscription.id,
    status: subscription.status,
  })

  // Handle subscription status changes
  if (subscription.status === 'canceled' || subscription.status === 'unpaid') {
    try {
      await cancelSubscription(userId)
      console.info('[stripe] Subscription cancelled in database')
    } catch (error) {
      console.error('[stripe] Error cancelling subscription:', error)
      throw error
    }
  }

  // TODO: Handle other status changes (past_due, paused, etc.)
}

export async function handleSubscriptionDeleted(
  event: Stripe.CustomerSubscriptionDeletedEvent
): Promise<void> {
  const subscription = event.data.object
  const userId = subscription.metadata?.user_id

  if (!userId) {
    console.error('[stripe] Missing user_id in subscription.deleted:', subscription.id)
    return
  }

  console.info('[stripe] Subscription deleted:', { userId, subscriptionId: subscription.id })

  try {
    await cancelSubscription(userId)
    console.info('[stripe] Subscription cancelled in database')
  } catch (error) {
    console.error('[stripe] Error cancelling subscription:', error)
    throw error
  }
}

export async function handleInvoicePaymentFailed(
  event: Stripe.InvoicePaymentFailedEvent
): Promise<void> {
  const invoice = event.data.object
  const subscriptionId = invoice.subscription as string

  console.error('[stripe] Invoice payment failed:', {
    invoiceId: invoice.id,
    subscriptionId,
    attemptCount: invoice.attempt_count,
  })

  // TODO: Send email notification to user
  // TODO: Update subscription status to 'past_due' if needed
}

/**
 * Verify Stripe webhook signature
 */
export function verifyWebhookSignature(
  payload: string | Buffer,
  signature: string
): Stripe.Event {
  if (!stripe) {
    throw new Error('Stripe not configured')
  }

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

  if (!webhookSecret) {
    throw new Error('Missing STRIPE_WEBHOOK_SECRET')
  }

  try {
    const event = stripe.webhooks.constructEvent(payload, signature, webhookSecret)
    return event
  } catch (error) {
    console.error('[stripe] Webhook signature verification failed:', error)
    throw new Error('Invalid webhook signature')
  }
}

