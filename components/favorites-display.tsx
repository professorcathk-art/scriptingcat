"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"

interface FavoriteItem {
  id: string
  timestamp: string
  platform: string
  url?: string
  manualText?: string
  transcript: string
  analysis: any
  tags?: string[]
  notes?: string
}

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

const TagIcon = () => (
  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
  </svg>
)

const ClockIcon = () => (
  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
)

interface FavoritesDisplayProps {
  language: string
}

export function FavoritesDisplay({ language }: FavoritesDisplayProps) {
  const [favorites, setFavorites] = useState<FavoriteItem[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedTag, setSelectedTag] = useState<string>('all')
  const { toast } = useToast()

  useEffect(() => {
    loadFavorites()
  }, [])

  const loadFavorites = async () => {
    try {
      setLoading(true)
      // Load from localStorage for now, in production this would be an API call
      const savedHistory = localStorage.getItem('analysis-history')
      if (savedHistory) {
        const parsedHistory = JSON.parse(savedHistory)
        const favoriteItems = parsedHistory.filter((item: any) => item.isFavorite)
        setFavorites(favoriteItems)
      }
    } catch (error) {
      console.error('Failed to load favorites:', error)
      toast({
        title: language === "zh" ? "載入失敗" : "Load Failed",
        description: language === "zh" ? "無法載入收藏項目" : "Failed to load favorites",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const removeFavorite = async (id: string) => {
    if (!confirm(language === "zh" ? "確定要從收藏中移除此項目嗎？" : "Are you sure you want to remove this item from favorites?")) {
      return
    }

    try {
      // Update the main history to remove favorite status
      const savedHistory = localStorage.getItem('analysis-history')
      if (savedHistory) {
        const parsedHistory = JSON.parse(savedHistory)
        const updatedHistory = parsedHistory.map((item: any) => 
          item.id === id ? { ...item, isFavorite: false } : item
        )
        localStorage.setItem('analysis-history', JSON.stringify(updatedHistory))
        
        // Update local favorites state
        setFavorites(favorites.filter(item => item.id !== id))
        
        toast({
          title: language === "zh" ? "已移除" : "Removed",
          description: language === "zh" ? "已從收藏中移除" : "Removed from favorites",
        })
      }
    } catch (error) {
      console.error('Failed to remove favorite:', error)
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

  const getAllTags = () => {
    const tags = new Set<string>()
    favorites.forEach(item => {
      if (item.analysis?.overall_assessment?.framework_identification) {
        item.analysis.overall_assessment.framework_identification.forEach((tag: string) => {
          tags.add(tag)
        })
      }
    })
    return Array.from(tags)
  }

  const filteredFavorites = selectedTag === 'all' 
    ? favorites
    : favorites.filter(item => 
        item.analysis?.overall_assessment?.framework_identification?.includes(selectedTag)
      )

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

  if (favorites.length === 0) {
    return (
      <div className="text-center py-8">
        <HeartFilledIcon className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
        <h3 className="text-lg font-semibold mb-2">
          {language === "zh" ? "尚無收藏項目" : "No Favorites Yet"}
        </h3>
        <p className="text-muted-foreground mb-4">
          {language === "zh" ? "開始分析內容並收藏您喜歡的結果" : "Start analyzing content and favorite results you like"}
        </p>
        <Button onClick={() => window.location.href = '/'}>
          {language === "zh" ? "開始分析" : "Start Analyzing"}
        </Button>
      </div>
    )
  }

  const allTags = getAllTags()

  return (
    <div className="space-y-4">
      {/* Tag Filter */}
      {allTags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          <Button
            variant={selectedTag === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedTag('all')}
          >
            {language === "zh" ? "全部" : "All"} ({favorites.length})
          </Button>
          {allTags.map((tag) => (
            <Button
              key={tag}
              variant={selectedTag === tag ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedTag(tag)}
            >
              <TagIcon className="h-3 w-3 mr-1" />
              {tag}
            </Button>
          ))}
        </div>
      )}

      {/* Favorites Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredFavorites.map((item) => (
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
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeFavorite(item.id)}
                  className="p-1 h-8 w-8 text-red-500 hover:text-red-700"
                >
                  <TrashIcon />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <CardDescription className="line-clamp-3 mb-3">
                {item.transcript}
              </CardDescription>
              
              {item.analysis && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span>
                      {language === "zh" ? "評分" : "Score"}: {item.analysis.overall_assessment?.overall_score || 'N/A'}/10
                    </span>
                    <span>•</span>
                    <span>
                      {language === "zh" ? "類型" : "Type"}: {item.analysis.overall_assessment?.framework_identification?.[0] || 'N/A'}
                    </span>
                  </div>
                  
                  {item.analysis.overall_assessment?.framework_identification && (
                    <div className="flex flex-wrap gap-1">
                      {item.analysis.overall_assessment.framework_identification.slice(0, 3).map((tag: string, index: number) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredFavorites.length === 0 && selectedTag !== 'all' && (
        <div className="text-center py-8">
          <TagIcon className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">
            {language === "zh" ? "此標籤下無收藏項目" : "No favorites with this tag"}
          </h3>
          <p className="text-muted-foreground">
            {language === "zh" ? "嘗試選擇其他標籤或查看全部收藏" : "Try selecting a different tag or view all favorites"}
          </p>
        </div>
      )}
    </div>
  )
}
