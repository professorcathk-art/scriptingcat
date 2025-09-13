"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Copy, Check } from "lucide-react"

interface TranscriptDisplayProps {
  transcript: string
  polishedTranscript?: string
  platform: string
  language: string
}

export function TranscriptDisplay({ transcript, polishedTranscript, platform, language }: TranscriptDisplayProps) {
  const [copiedOriginal, setCopiedOriginal] = useState(false)
  const [copiedPolished, setCopiedPolished] = useState(false)

  if (!transcript) return null

  const copyToClipboard = async (text: string, type: 'original' | 'polished') => {
    try {
      await navigator.clipboard.writeText(text)
      if (type === 'original') {
        setCopiedOriginal(true)
        setTimeout(() => setCopiedOriginal(false), 2000)
      } else {
        setCopiedPolished(true)
        setTimeout(() => setCopiedPolished(false), 2000)
      }
    } catch (err) {
      console.error('Failed to copy text: ', err)
    }
  }

  return (
    <div className="space-y-6 mb-6">
      {/* Original Transcript */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-primary rounded-full"></div>
              {language === "zh" ? "原始文字稿" : "Original Transcript"}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => copyToClipboard(transcript, 'original')}
              className="flex items-center gap-2"
            >
              {copiedOriginal ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              {copiedOriginal 
                ? (language === "zh" ? "已複製" : "Copied") 
                : (language === "zh" ? "複製" : "Copy")
              }
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-muted/50 p-4 rounded-lg">
            <p className="text-sm text-muted-foreground mb-2">
              {language === "zh" ? `來源: ${platform}` : `Source: ${platform}`}
            </p>
            <p className="text-foreground leading-relaxed whitespace-pre-wrap">{transcript}</p>
          </div>
        </CardContent>
      </Card>

      {/* Polished Transcript */}
      {polishedTranscript && polishedTranscript !== transcript && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                {language === "zh" ? "AI 優化文字稿" : "AI Polished Transcript"}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => copyToClipboard(polishedTranscript, 'polished')}
                className="flex items-center gap-2"
              >
                {copiedPolished ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                {copiedPolished 
                  ? (language === "zh" ? "已複製" : "Copied") 
                  : (language === "zh" ? "複製" : "Copy")
                }
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-200 dark:border-green-800">
              <p className="text-sm text-muted-foreground mb-2">
                {language === "zh" 
                  ? "AI 已優化標點符號和拼寫，保持原始訊息不變" 
                  : "AI optimized punctuation and spelling while preserving original message"
                }
              </p>
              <p className="text-foreground leading-relaxed whitespace-pre-wrap">{polishedTranscript}</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
