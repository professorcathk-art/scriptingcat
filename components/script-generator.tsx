"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"

const Loader2Icon = () => (
  <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
    <path
      className="opacity-75"
      fill="currentColor"
      d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
    ></path>
  </svg>
)

const Wand2Icon = () => (
  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
    />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="m16 16 4-4 4 4M7 10l5 5 5-5M12 15V3" />
  </svg>
)

const CopyIcon = () => (
  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <rect x="9" y="9" width="13" height="13" rx="2" ry="2" strokeWidth={2}></rect>
    <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" strokeWidth={2}></path>
  </svg>
)

const DownloadIcon = () => (
  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3"
    />
  </svg>
)

const RefreshCwIcon = () => (
  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
    />
  </svg>
)

interface GeneratedScript {
  hook: string
  body: string
  cta: string
  framework_used: string
  estimated_duration: string
}

interface ScriptGeneratorProps {
  analysis: any
  language?: string
}

export function ScriptGenerator({ analysis, language = "en" }: ScriptGeneratorProps) {
  const [userHook, setUserHook] = useState("")
  const [userBody, setUserBody] = useState("")
  const [userCTA, setUserCTA] = useState("")
  const [scriptDuration, setScriptDuration] = useState("60")
  const [customDuration, setCustomDuration] = useState("")
  const [variations, setVariations] = useState("1")
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedScripts, setGeneratedScripts] = useState<GeneratedScript[]>([])
  const { toast } = useToast()

  const translations = {
    en: {
      title: "Generate Custom Scripts",
      description: "Create scripts based on analysis results with your specific requirements",
      hookLabel: "Hook (Optional)",
      hookPlaceholder: "e.g., 'You won't believe what happened next...' or leave blank for AI generation",
      bodyLabel: "Body Content",
      bodyPlaceholder: "Paste a news link, describe your story, or outline the main points you want to cover...",
      ctaLabel: "Call-to-Action (Optional)",
      ctaPlaceholder: "e.g., 'Comment your thoughts below' or 'Follow for more tips' or leave blank for AI generation",
      durationLabel: "Script Duration",
      customDurationLabel: "Custom Duration (seconds)",
      customPlaceholder: "Enter seconds (max 900)",
      variations: "Number of Variations",
      generateBtn: "Generate Scripts",
      generating: "Generating...",
      frameworksUsed: "Will use these frameworks from analysis:",
      generatedTitle: "Generated Scripts",
      regenerate: "Regenerate",
      variation: "Variation",
      copy: "Copy",
      download: "Download",
      hook: "Hook",
      body: "Body",
      cta: "Call-to-Action",
      duration: "Duration",
      enterBody: "Please enter body content",
      enterBodyDesc: "The main content is required to generate scripts.",
      scriptsGenerated: "Scripts generated!",
      scriptsGeneratedDesc: "Successfully generated {count} script variation(s).",
      generationFailed: "Generation failed",
      generationFailedDesc: "There was an error generating your scripts. Please try again.",
      scriptCopied: "Script copied!",
      scriptCopiedDesc: "The script has been copied to your clipboard.",
      invalidDuration: "Invalid duration",
      invalidDurationDesc: "Duration must be between 1 and 900 seconds.",
    },
    zh: {
      title: "生成自定義腳本",
      description: "根據分析結果和您的具體要求創建腳本",
      hookLabel: "開場白（可選）",
      hookPlaceholder: "例如：'現在竟然有這種事...' 或留空讓AI生成",
      bodyLabel: "主體內容",
      bodyPlaceholder: "可以直接貼新聞連結或描述您的故事，或概述您想要涵蓋的要點...",
      ctaLabel: "行動呼籲（可選）",
      ctaPlaceholder: "例如：'留言分享你的想法' 或 '關注獲取更多技巧' 或留空讓AI生成",
      durationLabel: "腳本時長",
      customDurationLabel: "自定義時長（秒）",
      customPlaceholder: "輸入秒數（最多900）",
      variations: "變化數量",
      generateBtn: "生成腳本",
      generating: "生成中...",
      frameworksUsed: "將使用分析中的這些框架：",
      generatedTitle: "生成的腳本",
      regenerate: "重新生成",
      variation: "變化",
      copy: "複製",
      download: "下載",
      hook: "開場白",
      body: "主體",
      cta: "行動呼籲",
      duration: "時長",
      enterBody: "請輸入主體內容",
      enterBodyDesc: "生成腳本需要主體內容。",
      scriptsGenerated: "腳本已生成！",
      scriptsGeneratedDesc: "成功生成了 {count} 個腳本變化。",
      generationFailed: "生成失敗",
      generationFailedDesc: "生成腳本時出現錯誤。請重試。",
      scriptCopied: "腳本已複製！",
      scriptCopiedDesc: "腳本已複製到您的剪貼板。",
      invalidDuration: "無效時長",
      invalidDurationDesc: "時長必須在1到900秒之間。",
    },
  }

  const t = translations[language as keyof typeof translations] || translations.en

  const handleGenerate = async () => {
    if (!userBody.trim()) {
      toast({
        title: t.enterBody,
        description: t.enterBodyDesc,
        variant: "destructive",
      })
      return
    }

    const finalDuration = scriptDuration === "custom" ? customDuration : scriptDuration
    const durationNum = Number.parseInt(finalDuration)
    if (!durationNum || durationNum < 1 || durationNum > 900) {
      toast({
        title: t.invalidDuration,
        description: t.invalidDurationDesc,
        variant: "destructive",
      })
      return
    }

    setIsGenerating(true)
    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          analysis,
          userRequirements: {
            hook: userHook.trim() || null,
            body: userBody.trim(),
            cta: userCTA.trim() || null,
            duration: durationNum,
          },
          variations: Number.parseInt(variations),
          language,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to generate scripts")
      }

      const result = await response.json()
      setGeneratedScripts(result.scripts || [])

      toast({
        title: t.scriptsGenerated,
        description: t.scriptsGeneratedDesc.replace("{count}", result.scripts?.length || 0),
      })
    } catch (error) {
      console.error("Generation error:", error)
      toast({
        title: t.generationFailed,
        description: t.generationFailedDesc,
        variant: "destructive",
      })
    } finally {
      setIsGenerating(false)
    }
  }

  const copyToClipboard = (script: GeneratedScript) => {
    const fullScript = `${script.hook}\n\n${script.body}\n\n${script.cta}`
    navigator.clipboard.writeText(fullScript)
    toast({
      title: t.scriptCopied,
      description: t.scriptCopiedDesc,
    })
  }

  const downloadScript = (script: GeneratedScript, index: number) => {
    const fullScript = `${t.hook}: ${script.hook}\n\n${t.body}: ${script.body}\n\n${t.cta}: ${script.cta}\n\nFramework: ${script.framework_used}\nDuration: ${script.estimated_duration}`
    const blob = new Blob([fullScript], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `script-variation-${index + 1}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Input Section */}
      <Card className="shadow-lg border-0 bg-card/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
            <Wand2Icon />
            <span className="truncate">{t.title}</span>
          </CardTitle>
          <CardDescription className="text-sm sm:text-base">{t.description}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">{t.hookLabel}</label>
              <Textarea
                placeholder={t.hookPlaceholder}
                value={userHook}
                onChange={(e) => setUserHook(e.target.value)}
                className="min-h-[80px] resize-none text-sm sm:text-base"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">{t.bodyLabel} *</label>
              <Textarea
                placeholder={t.bodyPlaceholder}
                value={userBody}
                onChange={(e) => setUserBody(e.target.value)}
                className="min-h-[120px] resize-none text-sm sm:text-base"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">{t.ctaLabel}</label>
              <Textarea
                placeholder={t.ctaPlaceholder}
                value={userCTA}
                onChange={(e) => setUserCTA(e.target.value)}
                className="min-h-[80px] resize-none text-sm sm:text-base"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">{t.durationLabel}</label>
              <Select value={scriptDuration} onValueChange={setScriptDuration}>
                <SelectTrigger className="h-12">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="30">{language === "zh" ? "30秒" : "30 seconds"}</SelectItem>
                  <SelectItem value="60">{language === "zh" ? "60秒" : "60 seconds"}</SelectItem>
                  <SelectItem value="90">{language === "zh" ? "90秒" : "90 seconds"}</SelectItem>
                  <SelectItem value="custom">{language === "zh" ? "自定義" : "Custom"}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {scriptDuration === "custom" && (
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">{t.customDurationLabel}</label>
                <Input
                  type="number"
                  min="1"
                  max="900"
                  placeholder={t.customPlaceholder}
                  value={customDuration}
                  onChange={(e) => setCustomDuration(e.target.value)}
                  className="h-12"
                />
              </div>
            )}
          </div>

          <div className="flex flex-col sm:flex-row gap-4 sm:items-end">
            <div className="space-y-2 flex-1">
              <label className="text-sm font-medium text-foreground">{t.variations}</label>
              <Select value={variations} onValueChange={setVariations}>
                <SelectTrigger className="h-12">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">{language === "zh" ? "1 個變化" : "1 Variation"}</SelectItem>
                  <SelectItem value="3">{language === "zh" ? "3 個變化" : "3 Variations"}</SelectItem>
                  <SelectItem value="5">{language === "zh" ? "5 個變化" : "5 Variations"}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button
              onClick={handleGenerate}
              disabled={isGenerating}
              className="px-6 h-12 font-medium transition-all duration-200 hover:scale-105"
              size="lg"
            >
              {isGenerating ? (
                <>
                  <Loader2Icon />
                  <span className="ml-2 hidden sm:inline">{t.generating}</span>
                  <span className="ml-2 sm:hidden">{language === "zh" ? "生成中" : "Generating"}</span>
                </>
              ) : (
                <>
                  <Wand2Icon />
                  <span className="ml-2 hidden sm:inline">{t.generateBtn}</span>
                  <span className="ml-2 sm:hidden">{language === "zh" ? "生成" : "Generate"}</span>
                </>
              )}
            </Button>
          </div>

          {analysis?.overall_assessment?.framework_identification && (
            <div className="pt-2 border-t">
              <p className="text-xs sm:text-sm text-muted-foreground mb-2">{t.frameworksUsed}</p>
              <div className="flex flex-wrap gap-2">
                {analysis.overall_assessment.framework_identification
                  .slice(0, 3)
                  .map((framework: string, index: number) => (
                    <Badge key={index} variant="outline" className="text-xs hover:bg-secondary/20 transition-colors">
                      {framework}
                    </Badge>
                  ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Generated Scripts */}
      {generatedScripts.length > 0 && (
        <div className="space-y-4 animate-in slide-in-from-bottom-4 duration-500">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <h3 className="text-lg font-semibold text-foreground">{t.generatedTitle}</h3>
            <Button
              variant="outline"
              size="sm"
              onClick={handleGenerate}
              disabled={isGenerating}
              className="w-fit bg-transparent"
            >
              <RefreshCwIcon />
              <span className="ml-2">{t.regenerate}</span>
            </Button>
          </div>

          {generatedScripts.map((script, index) => (
            <Card
              key={index}
              className="group hover:shadow-lg transition-all duration-300 border-0 bg-card/80 backdrop-blur-sm"
            >
              <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <CardTitle className="text-base sm:text-lg">
                    {t.variation} {index + 1}
                  </CardTitle>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyToClipboard(script)}
                      className="hover:bg-secondary/20 transition-colors"
                    >
                      <CopyIcon />
                      <span className="ml-1 hidden sm:inline">{t.copy}</span>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => downloadScript(script, index)}
                      className="hover:bg-secondary/20 transition-colors"
                    >
                      <DownloadIcon />
                      <span className="ml-1 hidden sm:inline">{t.download}</span>
                    </Button>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="text-xs">
                    {script.framework_used}
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    {script.estimated_duration}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="p-3 bg-accent/5 rounded-lg hover:bg-accent/10 transition-colors">
                    <h4 className="text-xs sm:text-sm font-semibold text-accent mb-1">{t.hook}</h4>
                    <p className="text-xs sm:text-sm text-foreground leading-relaxed">{script.hook}</p>
                  </div>

                  <div className="p-3 bg-primary/5 rounded-lg hover:bg-primary/10 transition-colors">
                    <h4 className="text-xs sm:text-sm font-semibold text-primary mb-1">{t.body}</h4>
                    <p className="text-xs sm:text-sm text-foreground leading-relaxed">{script.body}</p>
                  </div>

                  <div className="p-3 bg-secondary/5 rounded-lg hover:bg-secondary/10 transition-colors">
                    <h4 className="text-xs sm:text-sm font-semibold text-secondary mb-1">{t.cta}</h4>
                    <p className="text-xs sm:text-sm text-foreground leading-relaxed">{script.cta}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
