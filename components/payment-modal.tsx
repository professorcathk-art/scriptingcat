"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Check, CreditCard, Lock, Zap } from "lucide-react"
import { SUBSCRIPTION_TIERS, type SubscriptionTier } from "@/lib/subscription"
import { useToast } from "@/hooks/use-toast"

interface PaymentModalProps {
  isOpen: boolean
  onClose: () => void
  selectedTier: SubscriptionTier | null
  onPaymentSuccess: (tierId: string) => void
  language?: string
}

const CheckIcon = () => (
  <Check className="h-4 w-4 text-green-500" />
)

const CreditCardIcon = () => (
  <CreditCard className="h-5 w-5" />
)

const LockIcon = () => (
  <Lock className="h-4 w-4 text-green-500" />
)

const ZapIcon = () => (
  <Zap className="h-5 w-5 text-blue-500" />
)

export function PaymentModal({ isOpen, onClose, selectedTier, onPaymentSuccess, language = "en" }: PaymentModalProps) {
  const [isProcessing, setIsProcessing] = useState(false)
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const { toast } = useToast()

  if (!selectedTier) return null

  const handlePayment = async () => {
    if (!email.trim()) {
      toast({
        title: language === "zh" ? "請輸入電子郵件" : "Email Required",
        description: language === "zh" ? "請輸入您的電子郵件地址" : "Please enter your email address",
        variant: "destructive",
      })
      return
    }

    setIsProcessing(true)
    
    try {
      const response = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tierId: selectedTier.id,
          email: email.trim(),
          name: name.trim() || undefined,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to create checkout session')
      }

      const { sessionId } = await response.json()
      
      // Redirect to Stripe Checkout
      const stripe = await import('@stripe/stripe-js').then(({ loadStripe }) => 
        loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)
      )
      
      if (stripe) {
        const { error } = await stripe.redirectToCheckout({ sessionId })
        if (error) {
          throw new Error(error.message)
        }
      }
    } catch (error) {
      console.error('Payment failed:', error)
      toast({
        title: language === "zh" ? "付款失敗" : "Payment Failed",
        description: error instanceof Error ? error.message : 'An error occurred',
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ZapIcon />
            {language === "zh" ? "升級到" : "Upgrade to"} {selectedTier.name}
          </DialogTitle>
          <DialogDescription>
            {language === "zh" 
              ? "選擇您的付款方式並完成升級"
              : "Choose your payment method and complete your upgrade"
            }
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Plan Summary */}
          <Card className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">{selectedTier.name} Plan</CardTitle>
              <CardDescription>
                {selectedTier.dailyLimit} {language === "zh" ? "次腳本生成/天" : "script generations/day"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold">${selectedTier.price}</span>
                <span className="text-muted-foreground">/month</span>
              </div>
            </CardContent>
          </Card>

          {/* Features */}
          <div>
            <h4 className="font-semibold mb-2">
              {language === "zh" ? "包含功能" : "What's included"}
            </h4>
            <ul className="space-y-1">
              {selectedTier.features.map((feature, index) => (
                <li key={index} className="flex items-center gap-2 text-sm">
                  <CheckIcon />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Information */}
          <div>
            <h4 className="font-semibold mb-2">
              {language === "zh" ? "客戶資訊" : "Customer Information"}
            </h4>
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  {language === "zh" ? "電子郵件" : "Email"} *
                </label>
                <Input
                  type="email"
                  placeholder={language === "zh" ? "your@email.com" : "your@email.com"}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1"
                />
              </div>
              
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  {language === "zh" ? "姓名" : "Name"} ({language === "zh" ? "選填" : "Optional"})
                </label>
                <Input
                  type="text"
                  placeholder={language === "zh" ? "您的姓名" : "Your name"}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mt-1"
                />
              </div>
            </div>
          </div>

          {/* Payment Method */}
          <div>
            <h4 className="font-semibold mb-2">
              {language === "zh" ? "付款方式" : "Payment Method"}
            </h4>
            <div className="flex items-center gap-2 p-3 border rounded-lg bg-muted/50">
              <CreditCardIcon />
              <span className="text-sm">
                {language === "zh" ? "安全信用卡付款 (由 Stripe 處理)" : "Secure card payment (processed by Stripe)"}
              </span>
            </div>
          </div>

          {/* Security Notice */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <LockIcon />
            <span>
              {language === "zh" 
                ? "您的付款信息是安全的，我們使用銀行級加密"
                : "Your payment information is secure with bank-level encryption"
              }
            </span>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 pt-4">
            <Button variant="outline" onClick={onClose} className="flex-1">
              {language === "zh" ? "取消" : "Cancel"}
            </Button>
            <Button 
              onClick={handlePayment}
              disabled={isProcessing}
              className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              {isProcessing ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  {language === "zh" ? "處理中..." : "Processing..."}
                </>
              ) : (
                <>
                  {language === "zh" ? "立即付款" : "Pay Now"} ${selectedTier.price}
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
