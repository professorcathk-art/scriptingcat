"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import { 
  type UserSubscription, 
  getDefaultSubscription,
  getSubscriptionTier 
} from "@/lib/subscription"
import { SubscriptionManager } from "@/components/subscription-manager"
import { PaymentModal } from "@/components/payment-modal"
import { HistoryDisplay } from "@/components/history-display"
import { FavoritesDisplay } from "@/components/favorites-display"

const UserIcon = () => (
  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
)

const HistoryIcon = () => (
  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
)

const HeartIcon = () => (
  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
  </svg>
)

const SettingsIcon = () => (
  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
)

export default function UserPortal() {
  const [userSubscription, setUserSubscription] = useState<UserSubscription>(getDefaultSubscription())
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [selectedTierForPayment, setSelectedTierForPayment] = useState<string | null>(null)
  const [language, setLanguage] = useState("en")
  const [activeTab, setActiveTab] = useState("subscription")
  const { toast } = useToast()

  useEffect(() => {
    // Load saved subscription data
    const savedSubscription = localStorage.getItem("user-subscription")
    if (savedSubscription) {
      try {
        const subscription = JSON.parse(savedSubscription)
        setUserSubscription(subscription)
      } catch (error) {
        console.error("Failed to parse saved subscription:", error)
      }
    }

    // Load language preference
    const savedLanguage = localStorage.getItem("preferred-language")
    if (savedLanguage) {
      setLanguage(savedLanguage)
    }
  }, [])

  const handleUpgrade = (tierId: string) => {
    setSelectedTierForPayment(tierId)
    setShowPaymentModal(true)
  }

  const handlePaymentSuccess = (tierId: string) => {
    const newSubscription = {
      ...userSubscription,
      tier: tierId,
      status: 'active' as const,
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // 30 days from now
    }
    setUserSubscription(newSubscription)
    localStorage.setItem('user-subscription', JSON.stringify(newSubscription))
    
    toast({
      title: language === "zh" ? "升級成功！" : "Upgrade successful!",
      description: language === "zh" 
        ? `您已成功升級到 ${getSubscriptionTier(tierId)?.name} 方案`
        : `You've successfully upgraded to ${getSubscriptionTier(tierId)?.name} plan`,
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900 dark:to-purple-900">
      <header className="border-b bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg shrink-0">
                <UserIcon />
              </div>
              <div className="min-w-0">
                <h1 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent truncate">
                  {language === "zh" ? "用戶中心" : "User Portal"}
                </h1>
                <p className="text-xs sm:text-sm text-muted-foreground hidden sm:block">
                  {language === "zh" ? "管理您的訂閱和內容" : "Manage your subscription and content"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.location.href = '/'}
                className="hidden sm:flex items-center gap-2"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                {language === "zh" ? "返回首頁" : "Back to Home"}
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 max-w-6xl">
        {/* User Status Card */}
        <Card className="mb-6 shadow-xl border-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <UserIcon />
                  {language === "zh" ? "帳戶狀態" : "Account Status"}
                </CardTitle>
                <CardDescription>
                  {language === "zh" ? "查看您的訂閱詳情和使用情況" : "View your subscription details and usage"}
                </CardDescription>
              </div>
              <Badge 
                variant={userSubscription.status === 'active' ? 'default' : 'secondary'}
                className="text-sm"
              >
                {getSubscriptionTier(userSubscription.tier)?.name}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-muted/50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">
                  {userSubscription.dailyUsage}
                </div>
                <div className="text-sm text-muted-foreground">
                  {language === "zh" ? "今日使用次數" : "Today's Usage"}
                </div>
              </div>
              <div className="text-center p-4 bg-muted/50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">
                  {getSubscriptionTier(userSubscription.tier)?.dailyLimit || 0}
                </div>
                <div className="text-sm text-muted-foreground">
                  {language === "zh" ? "每日限制" : "Daily Limit"}
                </div>
              </div>
              <div className="text-center p-4 bg-muted/50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">
                  {userSubscription.totalUsage}
                </div>
                <div className="text-sm text-muted-foreground">
                  {language === "zh" ? "總使用次數" : "Total Usage"}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Portal Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="subscription" className="flex items-center gap-2">
              <SettingsIcon />
              <span className="hidden sm:inline">
                {language === "zh" ? "訂閱管理" : "Subscription"}
              </span>
            </TabsTrigger>
            <TabsTrigger value="history" className="flex items-center gap-2">
              <HistoryIcon />
              <span className="hidden sm:inline">
                {language === "zh" ? "歷史記錄" : "History"}
              </span>
            </TabsTrigger>
            <TabsTrigger value="favorites" className="flex items-center gap-2">
              <HeartIcon />
              <span className="hidden sm:inline">
                {language === "zh" ? "我的收藏" : "Favorites"}
              </span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="subscription" className="space-y-6">
            <Card className="shadow-xl border-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <SettingsIcon />
                  {language === "zh" ? "訂閱管理" : "Subscription Management"}
                </CardTitle>
                <CardDescription>
                  {language === "zh" ? "管理您的訂閱方案和付款方式" : "Manage your subscription plan and payment methods"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <SubscriptionManager
                  userSubscription={userSubscription}
                  onUpgrade={handleUpgrade}
                  language={language}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="history" className="space-y-6">
            <Card className="shadow-xl border-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <HistoryIcon />
                  {language === "zh" ? "分析歷史" : "Analysis History"}
                </CardTitle>
                <CardDescription>
                  {language === "zh" ? "查看您過去的腳本分析和轉錄記錄" : "View your past script analysis and transcript records"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <HistoryDisplay language={language} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="favorites" className="space-y-6">
            <Card className="shadow-xl border-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <HeartIcon />
                  {language === "zh" ? "我的收藏" : "My Favorites"}
                </CardTitle>
                <CardDescription>
                  {language === "zh" ? "管理您收藏的轉錄和分析結果" : "Manage your favorite transcripts and analysis results"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <FavoritesDisplay language={language} />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      {/* Payment Modal */}
      <PaymentModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        selectedTier={selectedTierForPayment ? getSubscriptionTier(selectedTierForPayment) || null : null}
        onPaymentSuccess={handlePaymentSuccess}
        language={language}
      />
    </div>
  )
}
