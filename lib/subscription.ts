// Subscription and usage management
export interface SubscriptionTier {
  id: string
  name: string
  price: number
  currency: string
  dailyLimit: number
  features: string[]
}

export const SUBSCRIPTION_TIERS: SubscriptionTier[] = [
  {
    id: 'free',
    name: 'Free',
    price: 0,
    currency: 'USD',
    dailyLimit: 5,
    features: [
      '5 script variations per day',
      'Basic analysis',
      'Standard templates'
    ]
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 7.99,
    currency: 'USD',
    dailyLimit: 50,
    features: [
      '50 script variations per day',
      'Advanced analysis',
      'Premium templates',
      'Priority support',
      'Export options',
      'API access',
      '24/7 priority support',
      'White-label options'
    ]
  },
  {
    id: 'expert',
    name: 'Expert',
    price: 19.99,
    currency: 'USD',
    dailyLimit: 500,
    features: [
      '500 script variations per day',
      'AI-powered insights',
      'Custom templates',
      'Everything in Pro plan included'
    ]
  }
]

export interface UserSubscription {
  tier: string
  dailyUsage: number
  lastResetDate: string
  subscriptionId?: string
  status: 'active' | 'cancelled' | 'expired'
  expiresAt?: string
}

export function getSubscriptionTier(tierId: string): SubscriptionTier | undefined {
  return SUBSCRIPTION_TIERS.find(tier => tier.id === tierId)
}

export function canGenerateScript(userSubscription: UserSubscription): boolean {
  const tier = getSubscriptionTier(userSubscription.tier)
  if (!tier) return false
  
  // Check if daily limit is reached
  if (userSubscription.dailyUsage >= tier.dailyLimit) {
    return false
  }
  
  // Check if subscription is active
  if (userSubscription.status !== 'active') {
    return false
  }
  
  // Check if subscription has expired
  if (userSubscription.expiresAt && new Date(userSubscription.expiresAt) < new Date()) {
    return false
  }
  
  return true
}

export function getRemainingUsage(userSubscription: UserSubscription): number {
  const tier = getSubscriptionTier(userSubscription.tier)
  if (!tier) return 0
  
  return Math.max(0, tier.dailyLimit - userSubscription.dailyUsage)
}

export function incrementUsage(userSubscription: UserSubscription): UserSubscription {
  return {
    ...userSubscription,
    dailyUsage: userSubscription.dailyUsage + 1
  }
}

export function resetDailyUsage(userSubscription: UserSubscription): UserSubscription {
  const today = new Date().toISOString().split('T')[0]
  
  if (userSubscription.lastResetDate !== today) {
    return {
      ...userSubscription,
      dailyUsage: 0,
      lastResetDate: today
    }
  }
  
  return userSubscription
}

// Default free subscription
export function getDefaultSubscription(): UserSubscription {
  return {
    tier: 'free',
    dailyUsage: 0,
    lastResetDate: new Date().toISOString().split('T')[0],
    status: 'active'
  }
}
