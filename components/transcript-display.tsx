import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface TranscriptDisplayProps {
  transcript: string
  platform: string
  language: string
}

export function TranscriptDisplay({ transcript, platform, language }: TranscriptDisplayProps) {
  if (!transcript) return null

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <div className="w-2 h-2 bg-primary rounded-full"></div>
          {language === "zh" ? "原始文字稿" : "Original Transcript"}
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
  )
}
