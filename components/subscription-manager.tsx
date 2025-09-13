"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Check, Crown, Zap, Star } from "lucide-react"
import { SUBSCRIPTION_TIERS, type UserSubscription, getRemainingUsage } from "@/lib/subscription"

interface SubscriptionManagerProps {
  userSubscription: UserSubscription
  onUpgrade: (tierId: string) => void
  language?: string
}

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

export function SubscriptionManager({ userSubscription, onUpgrade, language = "en" }: SubscriptionManagerProps) {
  const [selectedTier, setSelectedTier] = useState<string | null>(null)
  
  const remainingUsage = getRemainingUsage(userSubscription)
  const currentTier = SUBSCRIPTION_TIERS.find(tier => tier.id === userSubscription.tier)
  
  const isCurrentTier = (tierId: string) => tierId === userSubscription.tier
  const isUpgrade = (tierId: string) => {
    const currentIndex = SUBSCRIPTION_TIERS.findIndex(tier => tier.id === userSubscription.tier)
    const targetIndex = SUBSCRIPTION_TIERS.findIndex(tier => tier.id === tierId)
    return targetIndex > currentIndex
  }

  return (
    <div className="space-y-6">
      {/* Current Usage Status */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border-blue-200 dark:border-blue-800">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            {currentTier?.id === 'free' ? <ZapIcon /> : 
             currentTier?.id === 'pro' ? <StarIcon /> : <CrownIcon />}
            <span>
              {language === "zh" ? "當前方案" : "Current Plan"}
            </span>
            <Badge variant="secondary" className="ml-auto">
              {currentTier?.name}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">
                {language === "zh" ? "今日剩餘使用次數" : "Remaining uses today"}
              </p>
              <p className="text-2xl font-bold text-blue-600">
                {remainingUsage} / {currentTier?.dailyLimit}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">
                {language === "zh" ? "方案價格" : "Plan Price"}
              </p>
              <p className="text-lg font-semibold">
                ${currentTier?.price}/month
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Upgrade Options */}
      {userSubscription.tier !== 'expert' && (
        <div>
          <h3 className="text-xl font-semibold mb-4">
            {language === "zh" ? "升級方案" : "Upgrade Plans"}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {SUBSCRIPTION_TIERS.filter(tier => tier.id !== userSubscription.tier).map((tier) => (
              <Card 
                key={tier.id} 
                className={`relative cursor-pointer transition-all duration-200 hover:shadow-lg ${
                  selectedTier === tier.id ? 'ring-2 ring-blue-500 shadow-lg' : ''
                } ${isUpgrade(tier.id) ? 'border-green-200 dark:border-green-800' : ''}`}
                onClick={() => setSelectedTier(tier.id)}
              >
                {tier.id === 'pro' && (
                  <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                      {language === "zh" ? "最受歡迎" : "Most Popular"}
                    </Badge>
                  </div>
                )}
                
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      {tier.id === 'pro' ? <StarIcon /> : <CrownIcon />}
                      {tier.name}
                    </CardTitle>
                    <div className="text-right">
                      <p className="text-2xl font-bold">${tier.price}</p>
                      <p className="text-sm text-muted-foreground">/month</p>
                    </div>
                  </div>
                  <CardDescription>
                    {tier.dailyLimit} {language === "zh" ? "次腳本生成/天" : "script generations/day"}
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="space-y-3">
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
                    onClick={(e) => {
                      e.stopPropagation()
                      onUpgrade(tier.id)
                    }}
                  >
                    {language === "zh" ? "升級到" : "Upgrade to"} {tier.name}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Usage Limit Reached */}
      {remainingUsage === 0 && (
        <Card className="border-orange-200 dark:border-orange-800 bg-orange-50 dark:bg-orange-900/20">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/50 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="h-6 w-6 text-orange-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">
                {language === "zh" ? "今日使用次數已達上限" : "Daily Limit Reached"}
              </h3>
              <p className="text-muted-foreground mb-4">
                {language === "zh" 
                  ? "您已用完今日的免費使用次數。升級方案以獲得更多使用次數。"
                  : "You've used all your free generations for today. Upgrade your plan for more uses."
                }
              </p>
              <Button 
                onClick={() => onUpgrade('pro')}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                {language === "zh" ? "立即升級" : "Upgrade Now"}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Stay Free Option */}
      <div className="text-center pt-6 border-t">
        <p className="text-sm text-muted-foreground mb-4">
          {language === "zh" 
            ? "想要繼續使用免費方案？" 
            : "Want to continue with the free plan?"
          }
        </p>
        <Button 
          variant="outline" 
          onClick={() => window.close()}
          className="px-8"
        >
          {language === "zh" ? "暫時繼續免費使用" : "Continue with Free Plan"}
        </Button>
      </div>
    </div>
  )
}
