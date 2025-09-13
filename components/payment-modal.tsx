"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Check, CreditCard, Lock, Zap } from "lucide-react"
import { SUBSCRIPTION_TIERS, type SubscriptionTier } from "@/lib/subscription"

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
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'paypal'>('card')

  if (!selectedTier) return null

  const handlePayment = async () => {
    setIsProcessing(true)
    
    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // In a real implementation, you would integrate with Stripe, PayPal, etc.
      // For now, we'll simulate a successful payment
      onPaymentSuccess(selectedTier.id)
      onClose()
    } catch (error) {
      console.error('Payment failed:', error)
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

          {/* Payment Methods */}
          <div>
            <h4 className="font-semibold mb-2">
              {language === "zh" ? "付款方式" : "Payment Method"}
            </h4>
            <div className="space-y-2">
              <Button
                variant={paymentMethod === 'card' ? 'default' : 'outline'}
                className="w-full justify-start"
                onClick={() => setPaymentMethod('card')}
              >
                <CreditCardIcon />
                <span className="ml-2">
                  {language === "zh" ? "信用卡/借記卡" : "Credit/Debit Card"}
                </span>
              </Button>
              
              <Button
                variant={paymentMethod === 'paypal' ? 'default' : 'outline'}
                className="w-full justify-start"
                onClick={() => setPaymentMethod('paypal')}
              >
                <div className="w-5 h-5 bg-blue-600 rounded flex items-center justify-center">
                  <span className="text-white text-xs font-bold">P</span>
                </div>
                <span className="ml-2">PayPal</span>
              </Button>
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
