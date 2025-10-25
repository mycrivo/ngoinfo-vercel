/**
 * Stripe Webhook Handler
 * 
 * Processes Stripe webhook events with signature verification.
 * CRITICAL: Requires raw body - Next.js must not parse it.
 */

import { NextRequest, NextResponse } from 'next/server'
import { headers } from 'next/headers'
import {
  verifyWebhookSignature,
  handleCheckoutCompleted,
  handleSubscriptionUpdated,
  handleSubscriptionDeleted,
  handleInvoicePaymentFailed,
} from '@/lib/stripeServer'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    // Get raw body
    const body = await request.text()
    
    // Get Stripe signature
    const headersList = await headers()
    const signature = headersList.get('stripe-signature')

    if (!signature) {
      console.error('[webhook] Missing stripe-signature header')
      return NextResponse.json(
        { error: 'Missing signature' },
        { status: 400 }
      )
    }

    // Verify signature and construct event
    let event
    try {
      event = verifyWebhookSignature(body, signature)
    } catch (error) {
      console.error('[webhook] Signature verification failed:', error)
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 400 }
      )
    }

    console.info('[webhook] Event received:', {
      type: event.type,
      id: event.id,
    })

    // Handle event types
    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutCompleted(event as any)
        break

      case 'customer.subscription.updated':
        await handleSubscriptionUpdated(event as any)
        break

      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(event as any)
        break

      case 'invoice.payment_failed':
        await handleInvoicePaymentFailed(event as any)
        break

      default:
        console.info('[webhook] Unhandled event type:', event.type)
    }

    return NextResponse.json({ received: true }, { status: 200 })
  } catch (error) {
    console.error('[webhook] Error processing webhook:', error)
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    )
  }
}

