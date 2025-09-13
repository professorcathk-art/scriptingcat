import { NextRequest, NextResponse } from 'next/server'
import { createCheckoutSession, createStripeCustomer } from '@/lib/stripe'
import { getSubscriptionTier } from '@/lib/subscription'

export async function POST(request: NextRequest) {
  try {
    const { tierId, email, name } = await request.json()

    if (!tierId || !email) {
      return NextResponse.json(
        { error: 'Missing required fields: tierId and email' },
        { status: 400 }
      )
    }

    const tier = getSubscriptionTier(tierId)
    if (!tier) {
      return NextResponse.json(
        { error: 'Invalid subscription tier' },
        { status: 400 }
      )
    }

    // Create or get Stripe customer
    const customer = await createStripeCustomer(email, name)

    // Get the price ID for the tier
    const priceId = process.env[`STRIPE_${tierId.toUpperCase()}_PRICE_ID`]
    if (!priceId) {
      return NextResponse.json(
        { error: 'Price ID not configured for this tier' },
        { status: 500 }
      )
    }

    // Create checkout session
    const session = await createCheckoutSession(
      customer.id,
      priceId,
      `${process.env.NEXT_PUBLIC_APP_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      `${process.env.NEXT_PUBLIC_APP_URL}/pricing`
    )

    return NextResponse.json({ sessionId: session.id })
  } catch (error) {
    console.error('Stripe checkout error:', error)
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    )
  }
}
