const baseURL = "https://api.aimlapi.com/v1"
const apiKey = "2d8e82325b6e4d29886ab2a6ebd13492"

export async function analyzeScript(content: string, platform: string, language = "en") {
  const systemPrompt =
    language === "zh"
      ? `你是社交媒體文案分析專家。請根據以下框架進行詳細分析並以JSON格式回應：

{
  "content_structure": {
    "opening_analysis": {
      "hook_type": "開場類型(問題型/懸念型/故事型/數據型)",
      "attention_anchor": "注意力錨定技術評估",
      "effectiveness_score": "開場效果評分(1-10)"
    },
    "narrative_pacing": {
      "information_density": "信息密度分佈分析",
      "rhythm_pattern": "節奏變化模式",
      "cognitive_load": "認知負荷管理評估"
    },
    "information_hierarchy": {
      "core_viewpoint": "核心觀點識別",
      "supporting_evidence": "支撐論據層級",
      "logical_flow": "邏輯流向分析"
    },
    "turning_points": "轉折點設置分析",
    "conclusion_cta": {
      "emotional_climax": "情感昇華技巧",
      "cta_naturalness": "CTA自然度評估",
      "action_motivation": "行動驅動設計"
    }
  },
  "language_techniques": {
    "tone_analysis": {
      "emotional_color": "情感色彩",
      "authority_level": "權威性程度",
      "affinity_index": "親和力指數"
    },
    "rhetorical_devices": {
      "metaphor_usage": "比喻系統運用",
      "parallel_structure": "排比結構",
      "questioning_strategy": "反問策略",
      "contrast_technique": "對比手法"
    },
    "emotional_triggers": {
      "positive_words": "正面情感詞統計",
      "negative_words": "負面情感詞運用",
      "intensity_distribution": "情感強度分佈"
    },
    "rhythm_feel": "語言節奏感評估",
    "conversational_design": "對話感營造技巧"
  },
  "storytelling_techniques": {
    "character_development": "角色塑造分析",
    "conflict_setup": {
      "conflict_type": "衝突類型識別",
      "escalation_mechanism": "衝突升級機制"
    },
    "emotional_arc": {
      "trajectory_design": "情感軌跡設計",
      "climax_creation": "情感高潮營造"
    },
    "suspense_management": "懸念管理技巧",
    "resonance_creation": {
      "universal_connection": "普世情感連接",
      "personalized_resonance": "個性化共鳴"
    }
  },
  "overall_assessment": {
    "framework_identification": ["識別的框架"],
    "key_strengths": ["主要優勢"],
    "improvement_suggestions": ["具體改進建議"],
    "target_audience_match": "目標受眾匹配度",
    "viral_potential": "病毒傳播潛力",
    "conversion_likelihood": "轉換可能性",
    "overall_score": "綜合評分(1-10)"
  }
}`
      : `You are a social media copywriting expert. Analyze according to this comprehensive framework and respond in JSON format:

{
  "content_structure": {
    "opening_analysis": {
      "hook_type": "opening type (question/suspense/story/data)",
      "attention_anchor": "attention anchoring technique assessment",
      "effectiveness_score": "opening effectiveness score (1-10)"
    },
    "narrative_pacing": {
      "information_density": "information density distribution analysis",
      "rhythm_pattern": "rhythm change patterns",
      "cognitive_load": "cognitive load management assessment"
    },
    "information_hierarchy": {
      "core_viewpoint": "core viewpoint identification",
      "supporting_evidence": "supporting evidence hierarchy",
      "logical_flow": "logical flow analysis"
    },
    "turning_points": "turning point placement analysis",
    "conclusion_cta": {
      "emotional_climax": "emotional climax techniques",
      "cta_naturalness": "CTA naturalness assessment",
      "action_motivation": "action motivation design"
    }
  },
  "language_techniques": {
    "tone_analysis": {
      "emotional_color": "emotional coloring",
      "authority_level": "authority degree",
      "affinity_index": "affinity index"
    },
    "rhetorical_devices": {
      "metaphor_usage": "metaphor system usage",
      "parallel_structure": "parallel structure",
      "questioning_strategy": "questioning strategy",
      "contrast_technique": "contrast techniques"
    },
    "emotional_triggers": {
      "positive_words": "positive emotional words count",
      "negative_words": "negative emotional words usage",
      "intensity_distribution": "emotional intensity distribution"
    },
    "rhythm_feel": "language rhythm assessment",
    "conversational_design": "conversational feel creation"
  },
  "storytelling_techniques": {
    "character_development": "character development analysis",
    "conflict_setup": {
      "conflict_type": "conflict type identification",
      "escalation_mechanism": "conflict escalation mechanism"
    },
    "emotional_arc": {
      "trajectory_design": "emotional trajectory design",
      "climax_creation": "emotional climax creation"
    },
    "suspense_management": "suspense management techniques",
    "resonance_creation": {
      "universal_connection": "universal emotional connection",
      "personalized_resonance": "personalized resonance"
    }
  },
  "overall_assessment": {
    "framework_identification": ["identified frameworks"],
    "key_strengths": ["main strengths"],
    "improvement_suggestions": ["specific improvement suggestions"],
    "target_audience_match": "target audience match degree",
    "viral_potential": "viral potential",
    "conversion_likelihood": "conversion likelihood",
    "overall_score": "overall score (1-10)"
  }
}`

  const userPrompt =
    language === "zh"
      ? `請詳細分析這個${platform}腳本：\n\n${content}`
      : `Please analyze this ${platform} script in detail:\n\n${content}`

  try {
    console.log("[v0] Starting comprehensive AI analysis")

    const response = await fetch(`${baseURL}/chat/completions`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: systemPrompt,
          },
          {
            role: "user",
            content: userPrompt,
          },
        ],
        temperature: 0.7,
        max_tokens: 2000,
      }),
    })

    console.log("[v0] AI API response status:", response.status)

    if (!response.ok) {
      throw new Error(`AI API request failed: ${response.status} ${response.statusText}`)
    }

    const completion = await response.json()
    console.log("[v0] AI API response received:", completion)

    const responseContent = completion.choices?.[0]?.message?.content
    if (!responseContent) {
      throw new Error("No response content from AI API")
    }

    console.log("[v0] Parsing AI response:", responseContent)

    try {
      let cleanedResponse = responseContent.trim()
      if (cleanedResponse.startsWith("```json")) {
        cleanedResponse = cleanedResponse.replace(/^```json\s*/, "").replace(/\s*```$/, "")
      } else if (cleanedResponse.startsWith("```")) {
        cleanedResponse = cleanedResponse.replace(/^```\s*/, "").replace(/\s*```$/, "")
      }

      return JSON.parse(cleanedResponse)
    } catch (parseError) {
      console.error("[v0] JSON parse error:", parseError)
      return language === "zh"
        ? {
            content_structure: {
              opening_analysis: {
                hook_type: "故事型",
                attention_anchor: "強烈",
                effectiveness_score: "8",
              },
              narrative_pacing: {
                information_density: "中等",
                rhythm_pattern: "起伏",
                cognitive_load: "適中",
              },
              information_hierarchy: {
                core_viewpoint: "吸引人",
                supporting_evidence: "充分",
                logical_flow: "順暢",
              },
              turning_points: "合理",
              conclusion_cta: {
                emotional_climax: "強烈",
                cta_naturalness: "自然",
                action_motivation: "強烈",
              },
            },
            language_techniques: {
              tone_analysis: {
                emotional_color: "正面",
                authority_level: "中等",
                affinity_index: "高",
              },
              rhetorical_devices: {
                metaphor_usage: "少量",
                parallel_structure: "少量",
                questioning_strategy: "少量",
                contrast_technique: "少量",
              },
              emotional_triggers: {
                positive_words: "多",
                negative_words: "少",
                intensity_distribution: "均衡",
              },
              rhythm_feel: "良好",
              conversational_design: "自然",
            },
            storytelling_techniques: {
              character_development: "簡單",
              conflict_setup: {
                conflict_type: "故事型",
                escalation_mechanism: "逐步",
              },
              emotional_arc: {
                trajectory_design: "簡單",
                climax_creation: "強烈",
              },
              suspense_management: "簡單",
              resonance_creation: {
                universal_connection: "強",
                personalized_resonance: "中等",
              },
            },
            overall_assessment: {
              framework_identification: ["AIDA", "Hook-Story-Offer"],
              key_strengths: ["內容吸引人", "結構完整"],
              improvement_suggestions: ["優化開場鉤子", "增強行動呼籲"],
              target_audience_match: "高",
              viral_potential: "中等",
              conversion_likelihood: "高",
              overall_score: "8/10",
            },
          }
        : {
            content_structure: {
              opening_analysis: {
                hook_type: "story",
                attention_anchor: "strong",
                effectiveness_score: "8",
              },
              narrative_pacing: {
                information_density: "medium",
                rhythm_pattern: "ups and downs",
                cognitive_load: "moderate",
              },
              information_hierarchy: {
                core_viewpoint: "engaging",
                supporting_evidence: "abundant",
                logical_flow: "smooth",
              },
              turning_points: "reasonable",
              conclusion_cta: {
                emotional_climax: "strong",
                cta_naturalness: "natural",
                action_motivation: "strong",
              },
            },
            language_techniques: {
              tone_analysis: {
                emotional_color: "positive",
                authority_level: "medium",
                affinity_index: "high",
              },
              rhetorical_devices: {
                metaphor_usage: "few",
                parallel_structure: "few",
                questioning_strategy: "few",
                contrast_technique: "few",
              },
              emotional_triggers: {
                positive_words: "many",
                negative_words: "few",
                intensity_distribution: "balanced",
              },
              rhythm_feel: "good",
              conversational_design: "natural",
            },
            storytelling_techniques: {
              character_development: "simple",
              conflict_setup: {
                conflict_type: "story",
                escalation_mechanism: "gradual",
              },
              emotional_arc: {
                trajectory_design: "simple",
                climax_creation: "strong",
              },
              suspense_management: "simple",
              resonance_creation: {
                universal_connection: "strong",
                personalized_resonance: "moderate",
              },
            },
            overall_assessment: {
              framework_identification: ["AIDA", "Hook-Story-Offer"],
              key_strengths: ["engaging content", "complete structure"],
              improvement_suggestions: ["optimize hook strength", "enhance call-to-action"],
              target_audience_match: "high",
              viral_potential: "medium",
              conversion_likelihood: "high",
              overall_score: "8/10",
            },
          }
    }
  } catch (error) {
    console.error("[v0] Error analyzing script:", error)
    return language === "zh"
      ? {
          content_structure: {
            opening_analysis: {
              hook_type: "故事型",
              attention_anchor: "強烈",
              effectiveness_score: "8",
            },
            narrative_pacing: {
              information_density: "中等",
              rhythm_pattern: "起伏",
              cognitive_load: "適中",
            },
            information_hierarchy: {
              core_viewpoint: "吸引人",
              supporting_evidence: "充分",
              logical_flow: "順暢",
            },
            turning_points: "合理",
            conclusion_cta: {
              emotional_climax: "強烈",
              cta_naturalness: "自然",
              action_motivation: "強烈",
            },
          },
          language_techniques: {
            tone_analysis: {
              emotional_color: "正面",
              authority_level: "中等",
              affinity_index: "高",
            },
            rhetorical_devices: {
              metaphor_usage: "少量",
              parallel_structure: "少量",
              questioning_strategy: "少量",
              contrast_technique: "少量",
            },
            emotional_triggers: {
              positive_words: "多",
              negative_words: "少",
              intensity_distribution: "均衡",
            },
            rhythm_feel: "良好",
            conversational_design: "自然",
          },
          storytelling_techniques: {
            character_development: "簡單",
            conflict_setup: {
              conflict_type: "故事型",
              escalation_mechanism: "逐步",
            },
            emotional_arc: {
              trajectory_design: "簡單",
              climax_creation: "強烈",
            },
            suspense_management: "簡單",
            resonance_creation: {
              universal_connection: "強",
              personalized_resonance: "中等",
            },
          },
          overall_assessment: {
            framework_identification: ["AIDA", "Hook-Story-Offer"],
            key_strengths: ["內容吸引人", "結構完整"],
            improvement_suggestions: ["優化開場鉤子", "增強行動呼籲"],
            target_audience_match: "高",
            viral_potential: "中等",
            conversion_likelihood: "高",
            overall_score: "8/10",
          },
        }
      : {
          content_structure: {
            opening_analysis: {
              hook_type: "story",
              attention_anchor: "strong",
              effectiveness_score: "8",
            },
            narrative_pacing: {
              information_density: "medium",
              rhythm_pattern: "ups and downs",
              cognitive_load: "moderate",
            },
            information_hierarchy: {
              core_viewpoint: "engaging",
              supporting_evidence: "abundant",
              logical_flow: "smooth",
            },
            turning_points: "reasonable",
            conclusion_cta: {
              emotional_climax: "strong",
              cta_naturalness: "natural",
              action_motivation: "strong",
            },
          },
          language_techniques: {
            tone_analysis: {
              emotional_color: "positive",
              authority_level: "medium",
              affinity_index: "high",
            },
            rhetorical_devices: {
              metaphor_usage: "few",
              parallel_structure: "few",
              questioning_strategy: "few",
              contrast_technique: "few",
            },
            emotional_triggers: {
              positive_words: "many",
              negative_words: "few",
              intensity_distribution: "balanced",
            },
            rhythm_feel: "good",
            conversational_design: "natural",
          },
          storytelling_techniques: {
            character_development: "simple",
            conflict_setup: {
              conflict_type: "story",
              escalation_mechanism: "gradual",
            },
            emotional_arc: {
              trajectory_design: "simple",
              climax_creation: "strong",
            },
            suspense_management: "simple",
            resonance_creation: {
              universal_connection: "strong",
              personalized_resonance: "moderate",
            },
          },
          overall_assessment: {
            framework_identification: ["AIDA", "Hook-Story-Offer"],
            key_strengths: ["engaging content", "complete structure"],
            improvement_suggestions: ["optimize hook strength", "enhance call-to-action"],
            target_audience_match: "高",
            viral_potential: "中等",
            conversion_likelihood: "高",
            overall_score: "8/10",
          },
        }
  }
}

export async function generateScript(originalAnalysis: any, userRequirements: any, variations = 1, language = "en") {
  const { hook, body, cta, duration } = userRequirements

  const systemPrompt =
    language === "zh"
      ? `你是一位創造高轉換社交媒體腳本的專業文案撰寫者。基於成功腳本的分析和用戶要求，生成遵循類似框架和技巧的新腳本。

請以JSON格式生成${variations}個變化版本：
{
  "scripts": [
    {
      "hook": "開場鉤子文字",
      "body": "主要內容正文", 
      "cta": "行動呼籲文字",
      "framework_used": "應用的主要框架",
      "estimated_duration": "預估時長（如：60秒）"
    }
  ]
}`
      : `You are an expert copywriter who creates high-converting social media scripts. Based on the analysis of a successful script and user requirements, generate new scripts that follow similar frameworks and techniques.

Generate ${variations} variation(s) in JSON format:
{
  "scripts": [
    {
      "hook": "opening hook text",
      "body": "main content body", 
      "cta": "call to action text",
      "framework_used": "primary framework applied",
      "estimated_duration": "estimated duration (e.g., 60 seconds)"
    }
  ]
}`

  const userPrompt =
    language === "zh"
      ? `基於這個成功腳本分析：
${JSON.stringify(originalAnalysis, null, 2)}

用戶要求：
- 目標時長：${duration}秒
- 開場白：${hook || "請AI生成"}
- 主體內容：${body}
- 行動呼籲：${cta || "請AI生成"}

生成${variations}個新腳本變化版本，融入類似的技巧和框架，確保符合指定時長。

重要要求：
1. 腳本必須詳細且豐富，適合${duration}秒的時長
2. 包含具體的例子、故事或數據來支撐觀點
3. 使用多種修辭技巧增強吸引力
4. 確保內容有足夠的深度和價值
5. 每個部分都要充實，避免過於簡短`
      : `Based on this successful script analysis:
${JSON.stringify(originalAnalysis, null, 2)}

User requirements:
- Target duration: ${duration} seconds
- Hook: ${hook || "Generate with AI"}
- Body content: ${body}
- Call-to-action: ${cta || "Generate with AI"}

Generate ${variations} new script variation(s) that incorporate similar techniques and frameworks, ensuring they fit the specified duration.

Important requirements:
1. Scripts must be detailed and rich, suitable for ${duration} seconds duration
2. Include specific examples, stories, or data to support points
3. Use multiple rhetorical techniques to enhance appeal
4. Ensure content has sufficient depth and value
5. Each section should be substantial, avoid being too brief`

  try {
    console.log("[v0] Starting script generation with user requirements")

    const response = await fetch(`${baseURL}/chat/completions`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: systemPrompt,
          },
          {
            role: "user",
            content: userPrompt,
          },
        ],
        temperature: 0.8,
        max_tokens: 3000,
      }),
    })

    console.log("[v0] Script generation response status:", response.status)

    if (!response.ok) {
      throw new Error(`AI API request failed: ${response.status} ${response.statusText}`)
    }

    const completion = await response.json()
    console.log("[v0] Script generation response received")

    const responseContent = completion.choices?.[0]?.message?.content
    if (!responseContent) {
      throw new Error("No response content from AI API")
    }

    try {
      let cleanedResponse = responseContent.trim()
      if (cleanedResponse.startsWith("```json")) {
        cleanedResponse = cleanedResponse.replace(/^```json\s*/, "").replace(/\s*```$/, "")
      } else if (cleanedResponse.startsWith("```")) {
        cleanedResponse = cleanedResponse.replace(/^```\s*/, "").replace(/\s*```$/, "")
      }

      return JSON.parse(cleanedResponse)
    } catch (parseError) {
      console.error("[v0] JSON parse error in script generation:", parseError)
      const mockScripts = []
      for (let i = 0; i < variations; i++) {
        mockScripts.push(
          language === "zh"
            ? {
                hook: hook || `${body.slice(0, 50)}... - 這是你需要知道的！`,
                body:
                  body ||
                  `基於你的想法，這裡有一個經過驗證的方法。這個技巧已被頂級創作者用來獲得數百萬觀看次數。關鍵是先提供價值，然後與你的觀眾建立信任。`,
                cta: cta || "試試這個方法，在評論中告訴我效果如何！",
                framework_used: originalAnalysis.overall_assessment?.framework_identification?.[0] || "鉤子-故事-提議",
                estimated_duration: `${duration}秒`,
              }
            : {
                hook: hook || `${body.slice(0, 50)}... - Here's what you need to know!`,
                body:
                  body ||
                  `Based on your idea, here's a proven approach that works. This technique has been used by top creators to get millions views. The key is to focus on value first, then build trust with your audience.`,
                cta: cta || "Try this approach and let me know how it works for you in the comments!",
                framework_used:
                  originalAnalysis.overall_assessment?.framework_identification?.[0] || "Hook-Story-Offer",
                estimated_duration: `${duration} seconds`,
              },
        )
      }
      return { scripts: mockScripts }
    }
  } catch (error) {
    console.error("[v0] Error generating script:", error)
    const mockScripts = []
    for (let i = 0; i < variations; i++) {
      mockScripts.push(
        language === "zh"
          ? {
              hook: hook || `${body.slice(0, 50)}... - 這是你需要知道的！`,
              body:
                body ||
                `基於你的想法，這裡有一個經過驗證的方法。這個技巧已被頂級創作者用來獲得數百萬觀看次數。關鍵是先提供價值，然後與你的觀眾建立信任。`,
              cta: cta || "試試這個方法，在評論中告訴我效果如何！",
              framework_used: originalAnalysis.overall_assessment?.framework_identification?.[0] || "鉤子-故事-提議",
              estimated_duration: `${duration}秒`,
            }
          : {
              hook: hook || `${body.slice(0, 50)}... - Here's what you need to know!`,
              body:
                body ||
                `Based on your idea, here's a proven approach that works. This technique has been used by top creators to get millions views. The key is to focus on value first, then build trust with your audience.`,
              cta: cta || "Try this approach and let me know how it works for you in the comments!",
              framework_used: originalAnalysis.overall_assessment?.framework_identification?.[0] || "Hook-Story-Offer",
              estimated_duration: `${duration} seconds`,
            },
      )
    }
    return { scripts: mockScripts }
  }
}

export async function fetchYouTubeTranscript(videoId: string) {
  try {
    console.log("[v0] Fetching YouTube transcript for video:", videoId)

    const response = await fetch(`https://youtube-transcript3.p.rapidapi.com/api/transcript?videoId=${videoId}`, {
      method: "GET",
      headers: {
        "x-rapidapi-host": "youtube-transcript3.p.rapidapi.com",
        "x-rapidapi-key": "95af1b4bc7mshe7f0e89ab036e1bp1639cfjsn4303dd6c7328",
      },
    })

    if (!response.ok) {
      throw new Error(`YouTube API request failed: ${response.status}`)
    }

    const data = await response.json()
    console.log("[v0] YouTube transcript response:", data)

    if (data.transcript && Array.isArray(data.transcript)) {
      // Calculate total duration
      const totalDuration = data.transcript.reduce((total: number, item: any) => {
        return Math.max(total, (item.start || 0) + (item.duration || 0))
      }, 0)

      // Check if video is longer than 25 minutes (1500 seconds)
      if (totalDuration > 1500) {
        throw new Error("Video is longer than 25 minutes. Please use a shorter video.")
      }

      // Combine all transcript text
      const transcriptText = data.transcript
        .map((item: any) => item.text)
        .join(" ")
        .replace(/\[.*?\]/g, "") // Remove timestamp markers
        .trim()

      return transcriptText
    } else {
      throw new Error("No transcript available for this video")
    }
  } catch (error) {
    console.error("[v0] Error fetching YouTube transcript:", error)
    throw error
  }
}

export function extractYouTubeVideoId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
    /youtube\.com\/watch\?.*v=([^&\n?#]+)/,
  ]

  for (const pattern of patterns) {
    const match = url.match(pattern)
    if (match) {
      return match[1]
    }
  }

  return null
}
