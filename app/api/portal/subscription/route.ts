import { type NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-12-18.acacia",
})

export async function GET(request: NextRequest) {
  try {
    // In a real application, you would:
    // 1. Authenticate the user
    // 2. Get user ID from session/token
    // 3. Fetch subscription from database/Stripe
    
    const { searchParams } = new URL(request.url)
    const customerId = searchParams.get('customer_id')
    
    if (!customerId) {
      return NextResponse.json(
        { error: "Customer ID is required" },
        { status: 400 }
      )
    }

    // Get customer's subscriptions from Stripe
    const subscriptions = await stripe.subscriptions.list({
      customer: customerId,
      status: 'all',
      expand: ['data.default_payment_method'],
    })

    // Get customer details
    const customer = await stripe.customers.retrieve(customerId)

    return NextResponse.json({
      customer,
      subscriptions: subscriptions.data,
    })
  } catch (error) {
    console.error("Failed to fetch subscription:", error)
    return NextResponse.json(
      { error: "Failed to fetch subscription" },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const { action, subscriptionId, customerId } = await request.json()
    
    // In a real application, you would:
    // 1. Authenticate the user
    // 2. Validate the action and data
    // 3. Update the subscription in Stripe
    
    switch (action) {
      case "cancel":
        // Cancel subscription
        const canceledSubscription = await stripe.subscriptions.update(subscriptionId, {
          cancel_at_period_end: true,
        })
        return NextResponse.json({ 
          success: true, 
          subscription: canceledSubscription,
          message: "Subscription will be canceled at the end of the current period"
        })
      
      case "reactivate":
        // Reactivate subscription
        const reactivatedSubscription = await stripe.subscriptions.update(subscriptionId, {
          cancel_at_period_end: false,
        })
        return NextResponse.json({ 
          success: true, 
          subscription: reactivatedSubscription,
          message: "Subscription reactivated"
        })
      
      case "update_payment_method":
        // Update payment method
        const { paymentMethodId } = await request.json()
        await stripe.subscriptions.update(subscriptionId, {
          default_payment_method: paymentMethodId,
        })
        return NextResponse.json({ 
          success: true, 
          message: "Payment method updated"
        })
      
      case "create_portal_session":
        // Create Stripe customer portal session
        const portalSession = await stripe.billingPortal.sessions.create({
          customer: customerId,
          return_url: `${process.env.NEXT_PUBLIC_APP_URL}/portal`,
        })
        return NextResponse.json({ 
          success: true, 
          url: portalSession.url 
        })
      
      default:
        return NextResponse.json(
          { error: "Invalid action" },
          { status: 400 }
        )
    }
  } catch (error) {
    console.error("Failed to update subscription:", error)
    return NextResponse.json(
      { error: "Failed to update subscription" },
      { status: 500 }
    )
  }
}
