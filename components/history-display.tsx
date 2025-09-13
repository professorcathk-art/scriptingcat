"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"

interface HistoryItem {
  id: string
  timestamp: string
  platform: string
  url?: string
  manualText?: string
  transcript: string
  analysis: any
  isFavorite: boolean
}

const ClockIcon = () => (
  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
)

const HeartIcon = () => (
  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
  </svg>
)

const HeartFilledIcon = () => (
  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
    <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
  </svg>
)

const ExternalLinkIcon = () => (
  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
  </svg>
)

const TrashIcon = () => (
  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
  </svg>
)

interface HistoryDisplayProps {
  language: string
}

export function HistoryDisplay({ language }: HistoryDisplayProps) {
  const [history, setHistory] = useState<HistoryItem[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'favorites'>('all')
  const { toast } = useToast()

  useEffect(() => {
    loadHistory()
  }, [])

  const loadHistory = async () => {
    try {
      setLoading(true)
      // Load from localStorage for now, in production this would be an API call
      const savedHistory = localStorage.getItem('analysis-history')
      if (savedHistory) {
        const parsedHistory = JSON.parse(savedHistory)
        setHistory(parsedHistory)
      }
    } catch (error) {
      console.error('Failed to load history:', error)
      toast({
        title: language === "zh" ? "載入失敗" : "Load Failed",
        description: language === "zh" ? "無法載入歷史記錄" : "Failed to load history",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const toggleFavorite = async (id: string) => {
    try {
      const updatedHistory = history.map(item => 
        item.id === id ? { ...item, isFavorite: !item.isFavorite } : item
      )
      setHistory(updatedHistory)
      localStorage.setItem('analysis-history', JSON.stringify(updatedHistory))
      
      toast({
        title: language === "zh" ? "已更新" : "Updated",
        description: language === "zh" ? "收藏狀態已更新" : "Favorite status updated",
      })
    } catch (error) {
      console.error('Failed to toggle favorite:', error)
    }
  }

  const deleteHistoryItem = async (id: string) => {
    if (!confirm(language === "zh" ? "確定要刪除此記錄嗎？" : "Are you sure you want to delete this record?")) {
      return
    }

    try {
      const updatedHistory = history.filter(item => item.id !== id)
      setHistory(updatedHistory)
      localStorage.setItem('analysis-history', JSON.stringify(updatedHistory))
      
      toast({
        title: language === "zh" ? "已刪除" : "Deleted",
        description: language === "zh" ? "記錄已刪除" : "Record deleted",
      })
    } catch (error) {
      console.error('Failed to delete history item:', error)
    }
  }

  const getPlatformIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
      case 'youtube':
        return <div className="h-3 w-3 bg-red-500 rounded-full mr-1"></div>
      case 'tiktok':
        return <div className="h-3 w-3 bg-black rounded-full mr-1"></div>
      case 'instagram':
        return <div className="h-3 w-3 bg-pink-500 rounded-full mr-1"></div>
      case 'manual input':
        return <div className="h-3 w-3 bg-blue-500 rounded-full mr-1"></div>
      default:
        return <div className="h-3 w-3 bg-gray-500 rounded-full mr-1"></div>
    }
  }

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp)
    return date.toLocaleDateString(language === "zh" ? "zh-TW" : "en-US", {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const filteredHistory = filter === 'favorites' 
    ? history.filter(item => item.isFavorite)
    : history

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-muted-foreground">
          {language === "zh" ? "載入中..." : "Loading..."}
        </span>
      </div>
    )
  }

  if (history.length === 0) {
    return (
      <div className="text-center py-8">
        <ClockIcon className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
        <h3 className="text-lg font-semibold mb-2">
          {language === "zh" ? "尚無歷史記錄" : "No History Yet"}
        </h3>
        <p className="text-muted-foreground mb-4">
          {language === "zh" ? "開始分析內容來建立您的歷史記錄" : "Start analyzing content to build your history"}
        </p>
        <Button onClick={() => window.location.href = '/'}>
          {language === "zh" ? "開始分析" : "Start Analyzing"}
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Filter Buttons */}
      <div className="flex gap-2">
        <Button
          variant={filter === 'all' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFilter('all')}
        >
          {language === "zh" ? "全部" : "All"} ({history.length})
        </Button>
        <Button
          variant={filter === 'favorites' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFilter('favorites')}
        >
          <HeartIcon className="h-4 w-4 mr-1" />
          {language === "zh" ? "收藏" : "Favorites"} ({history.filter(item => item.isFavorite).length})
        </Button>
      </div>

      {/* History List */}
      <div className="space-y-4">
        {filteredHistory.map((item) => (
          <Card key={item.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    {getPlatformIcon(item.platform)}
                    <Badge variant="secondary" className="text-xs">
                      {item.platform}
                    </Badge>
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <ClockIcon />
                      {formatDate(item.timestamp)}
                    </span>
                  </div>
                  <CardTitle className="text-sm line-clamp-2">
                    {item.url ? (
                      <a 
                        href={item.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="hover:text-blue-600 transition-colors flex items-center gap-1"
                      >
                        {item.url}
                        <ExternalLinkIcon />
                      </a>
                    ) : (
                      <span className="text-muted-foreground">
                        {language === "zh" ? "手動輸入文字" : "Manual Text Input"}
                      </span>
                    )}
                  </CardTitle>
                </div>
                <div className="flex items-center gap-2 ml-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleFavorite(item.id)}
                    className="p-1 h-8 w-8"
                  >
                    {item.isFavorite ? (
                      <HeartFilledIcon className="h-4 w-4 text-red-500" />
                    ) : (
                      <HeartIcon className="h-4 w-4" />
                    )}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => deleteHistoryItem(item.id)}
                    className="p-1 h-8 w-8 text-red-500 hover:text-red-700"
                  >
                    <TrashIcon />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <CardDescription className="line-clamp-3">
                {item.transcript}
              </CardDescription>
              {item.analysis && (
                <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
                  <span>
                    {language === "zh" ? "評分" : "Score"}: {item.analysis.overall_assessment?.overall_score || 'N/A'}/10
                  </span>
                  <span>•</span>
                  <span>
                    {language === "zh" ? "類型" : "Type"}: {item.analysis.overall_assessment?.framework_identification?.[0] || 'N/A'}
                  </span>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredHistory.length === 0 && filter === 'favorites' && (
        <div className="text-center py-8">
          <HeartIcon className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">
            {language === "zh" ? "尚無收藏項目" : "No Favorites Yet"}
          </h3>
          <p className="text-muted-foreground">
            {language === "zh" ? "點擊心形圖標來收藏您喜歡的分析結果" : "Click the heart icon to favorite analysis results you like"}
          </p>
        </div>
      )}
    </div>
  )
}
