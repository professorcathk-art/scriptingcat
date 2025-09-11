import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

interface AnalysisDisplayProps {
  analysis: any
  language?: string
}

const BarChartIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
    />
  </svg>
)

const MessageCircleIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-3.582 8-8 8a8.013 8.013 0 01-2.319-.371l-3.681.736.736-3.681A8.013 8.013 0 013 12c0-4.418 3.582-8 8-8s8 3.582 8 8z"
    />
  </svg>
)

const BookOpenIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C20.168 18.477 18.582 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
    />
  </svg>
)

const StarIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
    />
  </svg>
)

export function AnalysisDisplay({ analysis, language = "en" }: AnalysisDisplayProps) {
  console.log("[v0] AnalysisDisplay rendering with analysis:", analysis)

  if (!analysis) {
    console.log("[v0] No analysis data provided")
    return (
      <Card className="p-6">
        <p className="text-muted-foreground">{language === "zh" ? "沒有分析數據" : "No analysis data available"}</p>
      </Card>
    )
  }

  const getScoreNumber = (score: string | number): number => {
    if (typeof score === "number") return score
    if (typeof score === "string") {
      const match = score.match(/(\d+)/)
      return match ? Number.parseInt(match[1]) : 0
    }
    return 0
  }

  const overallAssessment = analysis.overall_assessment || analysis
  const contentStructure = analysis.content_structure || analysis.structure_analysis
  const languageTechniques = analysis.language_techniques || analysis.language_analysis
  const storytellingTechniques = analysis.storytelling_techniques || analysis

  return (
    <div className="space-y-6 mt-8">
      <Card className="shadow-lg border-l-4 border-l-blue-500">
        <CardHeader>
          <CardTitle className="text-xl text-blue-600 flex items-center gap-2">
            <StarIcon />
            {language === "zh" ? "綜合評估" : "Overall Assessment"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="font-semibold">{language === "zh" ? "綜合評分" : "Overall Score"}</span>
                  <Badge variant="outline" className="text-lg px-3 py-1">
                    {overallAssessment?.overall_score || "N/A"}
                  </Badge>
                </div>
                <Progress value={getScoreNumber(overallAssessment?.overall_score) * 10} className="h-3" />
              </div>

              <div>
                <h4 className="font-semibold mb-2">{language === "zh" ? "病毒傳播潛力" : "Viral Potential"}</h4>
                <Badge variant="secondary" className="capitalize">
                  {overallAssessment?.viral_potential || "N/A"}
                </Badge>
              </div>

              <div>
                <h4 className="font-semibold mb-2">{language === "zh" ? "轉換可能性" : "Conversion Likelihood"}</h4>
                <Badge variant="secondary" className="capitalize">
                  {overallAssessment?.conversion_likelihood || "N/A"}
                </Badge>
              </div>
            </div>

            <div className="space-y-4">
              {(overallAssessment?.framework_identification || overallAssessment?.frameworks_identified) && (
                <div>
                  <h4 className="font-semibold mb-2">{language === "zh" ? "識別框架" : "Identified Frameworks"}</h4>
                  <div className="flex flex-wrap gap-2">
                    {(overallAssessment.framework_identification || overallAssessment.frameworks_identified || []).map(
                      (framework: string, index: number) => (
                        <Badge key={index} variant="outline" className="bg-blue-50">
                          {framework}
                        </Badge>
                      ),
                    )}
                  </div>
                </div>
              )}

              {(overallAssessment?.key_strengths || overallAssessment?.immediate_improvements) && (
                <div>
                  <h4 className="font-semibold mb-2">{language === "zh" ? "主要優勢" : "Key Strengths"}</h4>
                  <ul className="space-y-1">
                    {(overallAssessment.key_strengths || overallAssessment.immediate_improvements || []).map(
                      (strength: string, index: number) => (
                        <li key={index} className="text-sm text-green-700 bg-green-50 px-2 py-1 rounded">
                          • {strength}
                        </li>
                      ),
                    )}
                  </ul>
                </div>
              )}
            </div>
          </div>

          {(overallAssessment?.improvement_suggestions || overallAssessment?.optimization_suggestions) && (
            <div className="mt-6 p-4 bg-amber-50 rounded-lg border border-amber-200">
              <h4 className="font-semibold mb-2 text-amber-800">
                {language === "zh" ? "改進建議" : "Improvement Suggestions"}
              </h4>
              <ul className="space-y-1">
                {(overallAssessment.improvement_suggestions || overallAssessment.optimization_suggestions || []).map(
                  (suggestion: string, index: number) => (
                    <li key={index} className="text-sm text-amber-700">
                      • {suggestion}
                    </li>
                  ),
                )}
              </ul>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="shadow-lg border-l-4 border-l-green-500">
        <CardHeader>
          <CardTitle className="text-xl text-green-600 flex items-center gap-2">
            <BarChartIcon />
            {language === "zh" ? "內容結構分析" : "Content Structure Analysis"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {contentStructure?.opening_analysis && (
              <div className="space-y-3">
                <h4 className="font-semibold text-green-700">{language === "zh" ? "開場分析" : "Opening Analysis"}</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>{language === "zh" ? "開場類型" : "Hook Type"}:</span>
                    <Badge variant="outline">{contentStructure.opening_analysis.hook_type}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>{language === "zh" ? "注意力錨定" : "Attention Anchor"}:</span>
                    <Badge variant="outline">{contentStructure.opening_analysis.attention_anchor}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>{language === "zh" ? "效果評分" : "Effectiveness"}:</span>
                    <Badge variant="outline">{contentStructure.opening_analysis.effectiveness_score}/10</Badge>
                  </div>
                </div>
              </div>
            )}

            {contentStructure?.narrative_pacing && (
              <div className="space-y-3">
                <h4 className="font-semibold text-green-700">{language === "zh" ? "敘事節奏" : "Narrative Pacing"}</h4>
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="font-medium">{language === "zh" ? "信息密度" : "Information Density"}:</span>
                    <p className="text-muted-foreground">{contentStructure.narrative_pacing.information_density}</p>
                  </div>
                  <div>
                    <span className="font-medium">{language === "zh" ? "節奏模式" : "Rhythm Pattern"}:</span>
                    <p className="text-muted-foreground">{contentStructure.narrative_pacing.rhythm_pattern}</p>
                  </div>
                </div>
              </div>
            )}

            {contentStructure?.information_hierarchy && (
              <div className="space-y-3">
                <h4 className="font-semibold text-green-700">
                  {language === "zh" ? "信息層級" : "Information Hierarchy"}
                </h4>
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="font-medium">{language === "zh" ? "核心觀點" : "Core Viewpoint"}:</span>
                    <p className="text-muted-foreground">{contentStructure.information_hierarchy.core_viewpoint}</p>
                  </div>
                  <div>
                    <span className="font-medium">{language === "zh" ? "邏輯流向" : "Logical Flow"}:</span>
                    <p className="text-muted-foreground">{contentStructure.information_hierarchy.logical_flow}</p>
                  </div>
                </div>
              </div>
            )}

            {contentStructure?.conclusion_cta && (
              <div className="space-y-3">
                <h4 className="font-semibold text-green-700">{language === "zh" ? "結尾與CTA" : "Conclusion & CTA"}</h4>
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="font-medium">{language === "zh" ? "情感昇華" : "Emotional Climax"}:</span>
                    <p className="text-muted-foreground">{contentStructure.conclusion_cta.emotional_climax}</p>
                  </div>
                  <div>
                    <span className="font-medium">{language === "zh" ? "CTA自然度" : "CTA Naturalness"}:</span>
                    <p className="text-muted-foreground">{contentStructure.conclusion_cta.cta_naturalness}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-lg border-l-4 border-l-purple-500">
        <CardHeader>
          <CardTitle className="text-xl text-purple-600 flex items-center gap-2">
            <MessageCircleIcon />
            {language === "zh" ? "語言技巧分析" : "Language Techniques Analysis"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {languageTechniques?.tone_analysis && (
              <div className="space-y-3">
                <h4 className="font-semibold text-purple-700">{language === "zh" ? "語調分析" : "Tone Analysis"}</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>{language === "zh" ? "情感色彩" : "Emotional Color"}:</span>
                    <Badge variant="outline">{languageTechniques.tone_analysis.emotional_color}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>{language === "zh" ? "權威性" : "Authority Level"}:</span>
                    <Badge variant="outline">{languageTechniques.tone_analysis.authority_level}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>{language === "zh" ? "親和力" : "Affinity Index"}:</span>
                    <Badge variant="outline">{languageTechniques.tone_analysis.affinity_index}</Badge>
                  </div>
                </div>
              </div>
            )}

            {languageTechniques?.rhetorical_devices && (
              <div className="space-y-3">
                <h4 className="font-semibold text-purple-700">
                  {language === "zh" ? "修辭手法" : "Rhetorical Devices"}
                </h4>
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="font-medium">{language === "zh" ? "比喻運用" : "Metaphor Usage"}:</span>
                    <p className="text-muted-foreground">{languageTechniques.rhetorical_devices.metaphor_usage}</p>
                  </div>
                  <div>
                    <span className="font-medium">{language === "zh" ? "排比結構" : "Parallel Structure"}:</span>
                    <p className="text-muted-foreground">{languageTechniques.rhetorical_devices.parallel_structure}</p>
                  </div>
                </div>
              </div>
            )}

            {languageTechniques?.emotional_triggers && (
              <div className="space-y-3">
                <h4 className="font-semibold text-purple-700">
                  {language === "zh" ? "情感觸發" : "Emotional Triggers"}
                </h4>
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="font-medium">{language === "zh" ? "正面詞彙" : "Positive Words"}:</span>
                    <p className="text-muted-foreground">{languageTechniques.emotional_triggers.positive_words}</p>
                  </div>
                  <div>
                    <span className="font-medium">{language === "zh" ? "強度分佈" : "Intensity Distribution"}:</span>
                    <p className="text-muted-foreground">
                      {languageTechniques.emotional_triggers.intensity_distribution}
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-3">
              <h4 className="font-semibold text-purple-700">
                {language === "zh" ? "其他語言特徵" : "Other Language Features"}
              </h4>
              <div className="space-y-2 text-sm">
                {languageTechniques?.rhythm_feel && (
                  <div>
                    <span className="font-medium">{language === "zh" ? "節奏感" : "Rhythm Feel"}:</span>
                    <p className="text-muted-foreground">{languageTechniques.rhythm_feel}</p>
                  </div>
                )}
                {languageTechniques?.conversational_design && (
                  <div>
                    <span className="font-medium">{language === "zh" ? "對話感" : "Conversational Design"}:</span>
                    <p className="text-muted-foreground">{languageTechniques.conversational_design}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-lg border-l-4 border-l-orange-500">
        <CardHeader>
          <CardTitle className="text-xl text-orange-600 flex items-center gap-2">
            <BookOpenIcon />
            {language === "zh" ? "故事敘述技巧分析" : "Storytelling Techniques Analysis"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {storytellingTechniques?.character_development && (
              <div className="space-y-3">
                <h4 className="font-semibold text-orange-700">
                  {language === "zh" ? "角色塑造" : "Character Development"}
                </h4>
                <p className="text-sm text-muted-foreground">{storytellingTechniques.character_development}</p>
              </div>
            )}

            {storytellingTechniques?.conflict_setup && (
              <div className="space-y-3">
                <h4 className="font-semibold text-orange-700">{language === "zh" ? "衝突設置" : "Conflict Setup"}</h4>
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="font-medium">{language === "zh" ? "衝突類型" : "Conflict Type"}:</span>
                    <p className="text-muted-foreground">{storytellingTechniques.conflict_setup.conflict_type}</p>
                  </div>
                  <div>
                    <span className="font-medium">{language === "zh" ? "升級機制" : "Escalation Mechanism"}:</span>
                    <p className="text-muted-foreground">
                      {storytellingTechniques.conflict_setup.escalation_mechanism}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {storytellingTechniques?.emotional_arc && (
              <div className="space-y-3">
                <h4 className="font-semibold text-orange-700">{language === "zh" ? "情感弧線" : "Emotional Arc"}</h4>
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="font-medium">{language === "zh" ? "軌跡設計" : "Trajectory Design"}:</span>
                    <p className="text-muted-foreground">{storytellingTechniques.emotional_arc.trajectory_design}</p>
                  </div>
                  <div>
                    <span className="font-medium">{language === "zh" ? "高潮營造" : "Climax Creation"}:</span>
                    <p className="text-muted-foreground">{storytellingTechniques.emotional_arc.climax_creation}</p>
                  </div>
                </div>
              </div>
            )}

            {storytellingTechniques?.resonance_creation && (
              <div className="space-y-3">
                <h4 className="font-semibold text-orange-700">
                  {language === "zh" ? "共鳴創造" : "Resonance Creation"}
                </h4>
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="font-medium">{language === "zh" ? "普世連接" : "Universal Connection"}:</span>
                    <p className="text-muted-foreground">
                      {storytellingTechniques.resonance_creation.universal_connection}
                    </p>
                  </div>
                  <div>
                    <span className="font-medium">{language === "zh" ? "個性化共鳴" : "Personalized Resonance"}:</span>
                    <p className="text-muted-foreground">
                      {storytellingTechniques.resonance_creation.personalized_resonance}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
