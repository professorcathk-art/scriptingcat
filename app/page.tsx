"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AnalysisDisplay } from "@/components/analysis-display"
import { ScriptGenerator } from "@/components/script-generator"
import { TranscriptDisplay } from "@/components/transcript-display"
import { SubscriptionManager } from "@/components/subscription-manager"
import { PaymentModal } from "@/components/payment-modal"
import { useToast } from "@/hooks/use-toast"
import { 
  type UserSubscription, 
  getDefaultSubscription, 
  canGenerateScript, 
  incrementUsage, 
  resetDailyUsage,
  getSubscriptionTier 
} from "@/lib/subscription"

const LoaderIcon = () => (
  <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
    ></path>
  </svg>
)

const SparklesIcon = () => (
  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M5 3l3.057 3.943L5 10l3.057-3.057L11 10l-3.057-3.057L11 3 7.943 6.057z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M19 13l-2.5 2.5L19 18l-2.5-2.5L14 18l2.5-2.5L14 13l2.5 2.5z"
    ></path>
  </svg>
)

const LinkIcon = () => (
  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
    />
  </svg>
)

const YoutubeIcon = () => (
  <svg className="h-5 w-5 text-red-500" fill="currentColor" viewBox="0 0 24 24">
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93-.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
  </svg>
)

const InstagramIcon = () => (
  <svg className="h-5 w-5 text-pink-500" fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.849.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.281-.073-1.689-.073-4.948 0-3.204.013-3.583.072-4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
  </svg>
)

const ArrowDownIcon = () => (
  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
  </svg>
)

const StarIcon = () => (
  <svg className="h-4 w-4 fill-yellow-400 text-yellow-400" viewBox="0 0 24 24">
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
  </svg>
)

const UsersIcon = () => (
  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
    />
  </svg>
)

const TrendingIcon = () => (
  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
  </svg>
)

export default function SocialMediaAnalyzer() {
  const [url, setUrl] = useState("")
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysis, setAnalysis] = useState<any>(null)
  const [transcript, setTranscript] = useState("")
  const [language, setLanguage] = useState("en")
  const [showLanguageSelector, setShowLanguageSelector] = useState(false)
  const [userSubscription, setUserSubscription] = useState<UserSubscription>(getDefaultSubscription())
  const [showSubscriptionManager, setShowSubscriptionManager] = useState(false)
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [selectedTierForPayment, setSelectedTierForPayment] = useState<string | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    const savedLanguage = localStorage.getItem("preferred-language")
    if (savedLanguage) {
      setLanguage(savedLanguage)
    } else {
      const browserLang = navigator.language.toLowerCase()
      if (browserLang.includes("zh") || browserLang.includes("tw") || browserLang.includes("hk")) {
        setShowLanguageSelector(true)
      }
    }

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
  }, [])

  const handleLanguageSelect = (selectedLang: string) => {
    setLanguage(selectedLang)
    localStorage.setItem("preferred-language", selectedLang)
    setShowLanguageSelector(false)
  }

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

  const handleAnalyze = async () => {
    if (!url.trim()) {
      toast({
        title: language === "zh" ? "請輸入網址" : "Please enter a URL",
        description:
          language === "zh" ? "請輸入有效的社交媒體網址進行分析。" : "Enter a valid social media URL to analyze.",
        variant: "destructive",
      })
      return
    }

    // Reset daily usage if it's a new day
    const updatedSubscription = resetDailyUsage(userSubscription)
    if (updatedSubscription !== userSubscription) {
      setUserSubscription(updatedSubscription)
    }

    // Check if user can generate scripts
    if (!canGenerateScript(updatedSubscription)) {
      toast({
        title: language === "zh" ? "使用次數已達上限" : "Usage limit reached",
        description: language === "zh" 
          ? "您今日的使用次數已達上限。請升級方案以獲得更多使用次數。"
          : "You've reached your daily usage limit. Please upgrade your plan for more uses.",
        variant: "destructive",
      })
      setShowSubscriptionManager(true)
      return
    }

    if (analysis) {
      const shouldContinue = window.confirm(
        language === "zh"
          ? "分析新內容將會清除當前的生成腳本。是否繼續？"
          : "Analyzing new content will refresh the generated script. Continue?",
      )
      if (!shouldContinue) {
        return
      }
    }

    setIsAnalyzing(true)
    setAnalysis(null)
    setTranscript("")

    try {
      console.log("[v0] Starting analysis for URL:", url)

      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url, language }),
      })

      console.log("[v0] Response status:", response.status)
      console.log("[v0] Response ok:", response.ok)
      console.log("[v0] Response headers:", Object.fromEntries(response.headers.entries()))

      if (!response.ok) {
        const errorText = await response.text()
        console.log("[v0] Error response body:", errorText)

        let errorMessage = language === "zh" ? "分析內容失敗" : "Failed to analyze content"
        try {
          const errorJson = JSON.parse(errorText)
          errorMessage = errorJson.error || errorMessage
          console.log("[v0] Parsed error:", errorJson)
        } catch (e) {
          console.log("[v0] Could not parse error as JSON, raw text:", errorText)
        }

        throw new Error(`HTTP ${response.status}: ${errorMessage}`)
      }

      const responseText = await response.text()
      console.log("[v0] Success response body:", responseText)

      const analysisResult = JSON.parse(responseText)
      console.log("[v0] Parsed analysis result:", analysisResult)

      setAnalysis(analysisResult)
      setTranscript(analysisResult.transcript || "")

      // Increment usage count
      const newSubscription = incrementUsage(updatedSubscription)
      setUserSubscription(newSubscription)
      localStorage.setItem('user-subscription', JSON.stringify(newSubscription))

      toast({
        title: language === "zh" ? "分析完成！" : "Analysis complete!",
        description: language === "zh" ? "您的內容已成功分析。" : "Your content has been analyzed successfully.",
      })
    } catch (error) {
      console.error("[v0] Analysis error details:", error)
      console.error("[v0] Error message:", error.message)
      console.error("[v0] Error stack:", error.stack)

      toast({
        title: language === "zh" ? "分析失敗" : "Analysis failed",
        description: `${language === "zh" ? "錯誤" : "Error"}: ${error.message}`,
        variant: "destructive",
      })
    } finally {
      setIsAnalyzing(false)
    }
  }

  const getPlatformIcon = (url: string) => {
    if (url.includes("youtube.com") || url.includes("youtu.be")) {
      return <YoutubeIcon />
    }
    if (url.includes("instagram.com")) {
      return <InstagramIcon />
    }
    if (url.includes("tiktok.com")) {
      return (
        <div className="h-5 w-5 bg-black rounded-full flex items-center justify-center text-white text-xs font-bold">
          T
        </div>
      )
    }
    if (url.includes("threads.net") || url.includes("threads.com")) {
      return (
        <div className="h-5 w-5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
          @
        </div>
      )
    }
    return <LinkIcon />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900 dark:to-purple-900">
      {showLanguageSelector && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle className="text-center">Choose Language / 選擇語言</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button
                onClick={() => handleLanguageSelect("en")}
                className="w-full h-12 text-left justify-start"
                variant="outline"
              >
                🇺🇸 English
              </Button>
              <Button
                onClick={() => handleLanguageSelect("zh")}
                className="w-full h-12 text-left justify-start"
                variant="outline"
              >
                🇹🇼 繁體中文
              </Button>
            </CardContent>
          </Card>
        </div>
      )}

      <header className="border-b bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg shrink-0">
                <SparklesIcon />
              </div>
              <div className="min-w-0">
                <h1 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent truncate">
                  {language === "zh" ? "社交媒體爆款內容複製器" : "ScriptAnalyzer AI"}
                </h1>
                <p className="text-xs sm:text-sm text-muted-foreground hidden sm:block">
                  {language === "zh" ? "分析與生成社交媒體腳本" : "Analyze & Generate Social Media Scripts"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowSubscriptionManager(true)}
                className="hidden sm:flex items-center gap-2"
              >
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                {getSubscriptionTier(userSubscription.tier)?.name}
              </Button>
              <Select value={language} onValueChange={(value) => handleLanguageSelect(value)}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="zh">繁體中文</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 max-w-6xl">
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-4 text-balance leading-tight">
            {language === "zh" ? "社交媒體爆款內容複製器" : "Decode Viral Content with AI"}
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground mb-6 sm:mb-8 text-pretty max-w-2xl mx-auto leading-relaxed">
            {language === "zh"
              ? "貼上任何 YouTube、TikTok、Instagram 或 Threads 網址，分析文案框架並生成類似的高轉換腳本。"
              : "Paste any YouTube, TikTok, Instagram, or Threads URL to analyze copywriting frameworks and generate similar high-converting scripts."}
          </p>

          <div className="flex flex-wrap justify-center items-center gap-6 mb-8 text-sm">
            <div className="flex items-center gap-2 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-full px-4 py-2 shadow-sm">
              <UsersIcon />
              <span className="font-semibold text-blue-600">10,000+</span>
              <span className="text-muted-foreground">{language === "zh" ? "活躍用戶" : "Active Users"}</span>
            </div>
            <div className="flex items-center gap-2 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-full px-4 py-2 shadow-sm">
              <TrendingIcon />
              <span className="font-semibold text-purple-600">100K+</span>
              <span className="text-muted-foreground">{language === "zh" ? "腳本已生成" : "Scripts Generated"}</span>
            </div>
            <div className="flex items-center gap-2 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-full px-4 py-2 shadow-sm">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <StarIcon key={i} />
                ))}
              </div>
              <span className="font-semibold text-yellow-600">4.9</span>
              <span className="text-muted-foreground">{language === "zh" ? "用戶評分" : "User Rating"}</span>
            </div>
          </div>

          {!analysis && (
            <div className="flex justify-center animate-bounce">
              <ArrowDownIcon />
            </div>
          )}
        </div>

        <Card className="mb-6 sm:mb-8 shadow-xl border-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
              <LinkIcon />
              <span className="truncate">{language === "zh" ? "貼上社交媒體網址" : "Paste Social Media URL"}</span>
            </CardTitle>
            <CardDescription className="text-sm sm:text-base">
              {language === "zh"
                ? "輸入 YouTube、TikTok、Instagram 或 Threads 的網址來分析腳本"
                : "Enter a URL from YouTube, TikTok, Instagram, or Threads to analyze the script"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Input
                  type="url"
                  placeholder="https://youtube.com/watch?v=... or https://tiktok.com/@user/video/..."
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="pl-12 h-12 text-sm sm:text-base border-2 focus:border-blue-500 transition-colors"
                  onKeyDown={(e) => e.key === "Enter" && handleAnalyze()}
                />
                <div className="absolute left-3 top-1/2 -translate-y-1/2">{getPlatformIcon(url)}</div>
              </div>
              <Button
                onClick={handleAnalyze}
                disabled={!url.trim() || isAnalyzing}
                className="px-6 h-12 text-sm sm:text-base font-medium transition-all duration-200 hover:scale-105 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                size="lg"
              >
                {isAnalyzing ? (
                  <>
                    <LoaderIcon />
                    <span className="ml-2 hidden sm:inline">{language === "zh" ? "分析中..." : "Analyzing..."}</span>
                    <span className="ml-2 sm:hidden">{language === "zh" ? "分析中" : "Analyzing"}</span>
                  </>
                ) : (
                  <>
                    <SparklesIcon />
                    <span className="ml-2 hidden sm:inline">{language === "zh" ? "分析腳本" : "Analyze Script"}</span>
                    <span className="ml-2 sm:hidden">{language === "zh" ? "分析" : "Analyze"}</span>
                  </>
                )}
              </Button>
            </div>

            <div className="flex flex-wrap gap-2 pt-2">
              <Badge variant="secondary" className="text-xs hover:bg-red-100 hover:text-red-700 transition-colors">
                <YoutubeIcon />
                <span className="ml-1">YouTube</span>
              </Badge>
              <Badge variant="secondary" className="text-xs hover:bg-gray-100 hover:text-gray-700 transition-colors">
                <div className="h-3 w-3 bg-black rounded-full mr-1"></div>
                TikTok
              </Badge>
              <Badge variant="secondary" className="text-xs hover:bg-pink-100 hover:text-pink-700 transition-colors">
                <InstagramIcon />
                <span className="ml-1">Instagram</span>
              </Badge>
              <Badge
                variant="secondary"
                className="text-xs hover:bg-purple-100 hover:text-purple-700 transition-colors"
              >
                <div className="h-3 w-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mr-1"></div>
                Threads
              </Badge>
            </div>
          </CardContent>
        </Card>

        {transcript && (
          <div className="mb-6 sm:mb-8 animate-in slide-in-from-bottom-4 duration-300">
            <TranscriptDisplay 
              transcript={transcript} 
              polishedTranscript={analysis?.polished_transcript}
              platform={analysis?.platform || "Unknown"} 
              language={language} 
            />
          </div>
        )}

        {analysis && (
          <div className="mb-6 sm:mb-8 animate-in slide-in-from-bottom-4 duration-500">
            {console.log("[v0] Rendering AnalysisDisplay with analysis:", analysis)}
            <AnalysisDisplay analysis={analysis} language={language} />
          </div>
        )}

        {analysis && (
          <div className="mb-6 sm:mb-8 animate-in slide-in-from-bottom-4 duration-700">
            <div className="bg-gradient-to-r from-green-500 to-blue-500 p-1 rounded-xl mb-4">
              <div className="bg-white dark:bg-gray-900 rounded-lg p-6 text-center">
                <h3 className="text-2xl font-bold mb-2 bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                  {language === "zh" ? "🚀 生成您的爆款腳本" : "🚀 Generate Your Viral Script"}
                </h3>
                <p className="text-muted-foreground mb-4">
                  {language === "zh"
                    ? "基於分析結果，創建您的專屬高轉換腳本"
                    : "Create your custom high-converting script based on the analysis"}
                </p>
              </div>
            </div>
            {console.log("[v0] Rendering ScriptGenerator with analysis:", analysis)}
            <ScriptGenerator analysis={analysis} language={language} />
          </div>
        )}

        {!analysis && (
          <div className="mb-12 sm:mb-16">
            <h3 className="text-2xl sm:text-3xl font-bold text-center mb-8 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {language === "zh" ? "用戶好評" : "What Our Users Say"}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                <CardContent className="pt-6">
                  <div className="flex mb-3">
                    {[...Array(5)].map((_, i) => (
                      <StarIcon key={i} />
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                    {language === "zh"
                      ? "這個工具完全改變了我的內容創作流程。AI 分析非常準確，生成的腳本質量很高！"
                      : "This tool completely transformed my content creation workflow. The AI analysis is spot-on and the generated scripts are high quality!"}
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                      S
                    </div>
                    <div>
                      <p className="font-semibold text-sm">Sarah Chen</p>
                      <p className="text-xs text-muted-foreground">
                        {language === "zh" ? "內容創作者" : "Content Creator"}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                <CardContent className="pt-6">
                  <div className="flex mb-3">
                    {[...Array(5)].map((_, i) => (
                      <StarIcon key={i} />
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                    {language === "zh"
                      ? "作為行銷人員，這個工具幫我節省了大量時間。框架分析功能特別有用！"
                      : "As a marketer, this tool saves me hours of work. The framework analysis feature is incredibly useful!"}
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                      M
                    </div>
                    <div>
                      <p className="font-semibold text-sm">Mike Rodriguez</p>
                      <p className="text-xs text-muted-foreground">
                        {language === "zh" ? "數位行銷專家" : "Digital Marketer"}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 md:col-span-2 lg:col-span-1">
                <CardContent className="pt-6">
                  <div className="flex mb-3">
                    {[...Array(5)].map((_, i) => (
                      <StarIcon key={i} />
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                    {language === "zh"
                      ? "多平台支援太棒了！我可以分析 TikTok 和 Instagram 的內容，然後為 YouTube 生成腳本。"
                      : "The multi-platform support is amazing! I can analyze TikTok and Instagram content, then generate scripts for YouTube."}
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                      A
                    </div>
                    <div>
                      <p className="font-semibold text-sm">Alex Kim</p>
                      <p className="text-xs text-muted-foreground">
                        {language === "zh" ? "社群媒體經理" : "Social Media Manager"}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mt-8 sm:mt-12">
          <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform shrink-0">
                  <SparklesIcon />
                </div>
                <h3 className="font-semibold text-sm sm:text-base">
                  {language === "zh" ? "AI 智能分析" : "AI-Powered Analysis"}
                </h3>
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                {language === "zh"
                  ? "先進的 AI 識別文案框架、開場白和病毒式內容中使用的轉換技巧。"
                  : "Advanced AI identifies copywriting frameworks, hooks, and conversion techniques used in viral content."}
              </p>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-gradient-to-r from-red-500 to-pink-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform shrink-0">
                  <YoutubeIcon />
                </div>
                <h3 className="font-semibold text-sm sm:text-base">
                  {language === "zh" ? "多平台支援" : "Multi-Platform Support"}
                </h3>
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                {language === "zh"
                  ? "分析來自 YouTube、TikTok、Instagram Reels 和 Threads 的內容，提供平台專屬洞察。"
                  : "Analyze content from YouTube, TikTok, Instagram Reels, and Threads with platform-specific insights."}
              </p>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm sm:col-span-2 lg:col-span-1">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-blue-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform shrink-0">
                  <LinkIcon />
                </div>
                <h3 className="font-semibold text-sm sm:text-base">
                  {language === "zh" ? "腳本生成" : "Script Generation"}
                </h3>
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                {language === "zh"
                  ? "基於分析框架生成類似的高轉換腳本，提供多種變化版本。"
                  : "Generate similar high-converting scripts based on analyzed frameworks with multiple variations."}
              </p>
            </CardContent>
          </Card>
        </div>

        <footer className="mt-12 sm:mt-16 pt-8 border-t border-border/50">
          <div className="text-center">
            <p className="text-xs sm:text-sm text-muted-foreground mb-2">
              {language === "zh"
                ? "由先進 AI 驅動，幫助內容創作者和行銷人員"
                : "Powered by advanced AI to help content creators and marketers"}
            </p>
            <div className="flex justify-center items-center gap-4 text-xs text-muted-foreground">
              <span>{language === "zh" ? "快速分析" : "Fast Analysis"}</span>
              <span>•</span>
              <span>{language === "zh" ? "多種變化" : "Multiple Variations"}</span>
              <span>•</span>
              <span>{language === "zh" ? "框架檢測" : "Framework Detection"}</span>
            </div>
          </div>
        </footer>
      </main>

      {/* Subscription Manager Modal */}
      {showSubscriptionManager && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-900 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">
                  {language === "zh" ? "訂閱方案" : "Subscription Plans"}
                </h2>
                <Button variant="ghost" onClick={() => setShowSubscriptionManager(false)}>
                  ✕
                </Button>
              </div>
              <SubscriptionManager
                userSubscription={userSubscription}
                onUpgrade={handleUpgrade}
                language={language}
              />
            </div>
          </div>
        </div>
      )}

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
