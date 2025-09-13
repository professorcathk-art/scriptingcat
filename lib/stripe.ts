import Stripe from 'stripe'

// Server-side Stripe instance
export const stripe = process.env.STRIPE_SECRET_KEY 
  ? new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2024-12-18.acacia',
    })
  : null

// Client-side Stripe instance
export const getStripe = () => {
  if (typeof window !== 'undefined') {
    return require('@stripe/stripe-js').loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)
  }
  return null
}

// Subscription tier mapping
export const STRIPE_PRICE_IDS = {
  pro: process.env.STRIPE_PRO_PRICE_ID || 'price_pro_monthly',
  expert: process.env.STRIPE_EXPERT_PRICE_ID || 'price_expert_monthly',
}

// Create Stripe customer
export async function createStripeCustomer(email: string, name?: string) {
  if (!stripe) {
    throw new Error('Stripe not configured')
  }
  
  try {
    const customer = await stripe.customers.create({
      email,
      name,
      metadata: {
        source: 'scriptingcat'
      }
    })
    return customer
  } catch (error) {
    console.error('Error creating Stripe customer:', error)
    throw error
  }
}

// Create Stripe checkout session
export async function createCheckoutSession(
  customerId: string,
  priceId: string,
  successUrl: string,
  cancelUrl: string
) {
  if (!stripe) {
    throw new Error('Stripe not configured')
  }
  
  try {
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: {
        source: 'scriptingcat'
      }
    })
    return session
  } catch (error) {
    console.error('Error creating checkout session:', error)
    throw error
  }
}

// Create billing portal session
export async function createBillingPortalSession(customerId: string, returnUrl: string) {
  if (!stripe) {
    throw new Error('Stripe not configured')
  }
  
  try {
    const session = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: returnUrl,
    })
    return session
  } catch (error) {
    console.error('Error creating billing portal session:', error)
    throw error
  }
}

// Get subscription details
export async function getSubscription(subscriptionId: string) {
  if (!stripe) {
    throw new Error('Stripe not configured')
  }
  
  try {
    const subscription = await stripe.subscriptions.retrieve(subscriptionId)
    return subscription
  } catch (error) {
    console.error('Error retrieving subscription:', error)
    throw error
  }
}

// Cancel subscription
export async function cancelSubscription(subscriptionId: string) {
  if (!stripe) {
    throw new Error('Stripe not configured')
  }
  
  try {
    const subscription = await stripe.subscriptions.cancel(subscriptionId)
    return subscription
  } catch (error) {
    console.error('Error canceling subscription:', error)
    throw error
  }
}
