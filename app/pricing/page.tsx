"use client"

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Check, Crown, Zap, Star } from 'lucide-react'
import { SUBSCRIPTION_TIERS } from '@/lib/subscription'
import { useRouter } from 'next/navigation'

const CheckIcon = () => (
  <Check className="h-4 w-4 text-green-500" />
)

const CrownIcon = () => (
  <Crown className="h-5 w-5 text-yellow-500" />
)

const ZapIcon = () => (
  <Zap className="h-5 w-5 text-blue-500" />
)

const StarIcon = () => (
  <Star className="h-5 w-5 text-purple-500" />
)

export default function PricingPage() {
  const router = useRouter()
  const [selectedTier, setSelectedTier] = useState<string | null>(null)

  const handleUpgrade = (tierId: string) => {
    // Redirect to main app with upgrade intent
    router.push(`/?upgrade=${tierId}`)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900 dark:to-purple-900">
      <div className="container mx-auto px-4 py-16 max-w-6xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
            Choose Your Plan
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Unlock the full potential of AI-powered script generation with our flexible pricing plans.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {SUBSCRIPTION_TIERS.map((tier) => (
            <Card 
              key={tier.id} 
              className={`relative transition-all duration-200 hover:shadow-lg ${
                selectedTier === tier.id ? 'ring-2 ring-blue-500 shadow-lg' : ''
              } ${tier.id === 'pro' ? 'border-green-200 dark:border-green-800 scale-105' : ''}`}
            >
              {tier.id === 'pro' && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                    Most Popular
                  </Badge>
                </div>
              )}
              
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    {tier.id === 'free' ? <ZapIcon /> : 
                     tier.id === 'pro' ? <StarIcon /> : <CrownIcon />}
                    {tier.name}
                  </CardTitle>
                  <div className="text-right">
                    <p className="text-2xl font-bold">${tier.price}</p>
                    <p className="text-sm text-muted-foreground">/month</p>
                  </div>
                </div>
                <CardDescription>
                  {tier.dailyLimit} script generations/day
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <ul className="space-y-2">
                  {tier.features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-2 text-sm">
                      <CheckIcon />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <Button 
                  className="w-full mt-4"
                  variant={tier.id === 'pro' ? 'default' : 'outline'}
                  onClick={() => handleUpgrade(tier.id)}
                  disabled={tier.id === 'free'}
                >
                  {tier.id === 'free' ? 'Current Plan' : `Upgrade to ${tier.name}`}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-muted-foreground mb-4">
            Need help choosing? Contact our support team.
          </p>
          <Button variant="outline" onClick={() => router.push('/')}>
            Back to App
          </Button>
        </div>
      </div>
    </div>
  )
}


