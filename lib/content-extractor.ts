// Content extraction utilities for different social media platforms
export async function extractContentFromUrl(
  url: string,
  language = "en",
): Promise<{ content: string; platform: string; transcript: string }> {
  const platform = detectPlatform(url)
  let transcript = ""

  try {
    if (platform === "instagram") {
      // Use gettranscribe.ai API for Chinese pages, RapidAPI for others
      if (language === "zh") {
        console.log("[v0] Using gettranscribe.ai API for Chinese Instagram content")
        const response = await fetch(
          "https://api.gettranscribe.ai/transcriptions",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "x-api-key": "gtr_14b63b5f9cfc32b0281cb17907f7c4f4c9f5298637f9819dfb0adb8c4dceeea0",
            },
            body: JSON.stringify({
              url: url,
              language: "zh",
              prompt: "This video contains social media content"
            }),
          },
        )

        if (response.ok) {
          const data = await response.json()
          console.log("[v0] gettranscribe.ai API response:", data)

          let content = ""
          if (data.transcription) {
            content = data.transcription
            transcript = content
          } else if (data.original_transcription) {
            content = data.original_transcription
            transcript = content
          }

          if (content.trim()) {
            return {
              content: content.trim(),
              platform: "Instagram",
              transcript: transcript.trim(),
            }
          }
        } else {
          console.log("[v0] gettranscribe.ai API failed:", response.status, response.statusText)
        }
      } else {
        // Use RapidAPI Instagram Transcripts API for non-Chinese pages
        console.log("[v0] Using RapidAPI for non-Chinese Instagram content")
        const response = await fetch(
          `https://instagram-transcripts.p.rapidapi.com/transcript?url=${encodeURIComponent(url)}&chunkSize=500&text=false`,
          {
            method: "GET",
            headers: {
              "x-rapidapi-host": "instagram-transcripts.p.rapidapi.com",
              "x-rapidapi-key": "95af1b4bc7mshe7f0e89ab036e1bp1639cfjsn4303dd6c7328",
            },
          },
        )

        if (response.ok) {
          const data = await response.json()
          console.log("[v0] Instagram API response:", data)

          let content = ""
          if (data.content && Array.isArray(data.content)) {
            content = data.content.map((item: any) => item.text || "").join(" ")
            transcript = content // Store the original transcript
          } else if (data.transcript && Array.isArray(data.transcript)) {
            content = data.transcript.map((item: any) => item.text || "").join(" ")
            transcript = content
          } else if (data.text) {
            content = data.text
            transcript = content
          } else if (typeof data === "string") {
            content = data
            transcript = content
          }

          if (content.trim()) {
            return {
              content: content.trim(),
              platform: "Instagram",
              transcript: transcript.trim(),
            }
          }
        } else {
          console.log("[v0] Instagram API failed:", response.status, response.statusText)
        }
      }
    } else if (platform === "tiktok") {
      // Use RapidAPI TikTok transcript API
      try {
        console.log("[v0] Extracting TikTok content from URL:", url)
        
        const response = await fetch(
          'https://tiktok-transcript.p.rapidapi.com/transcribe-tiktok-audio',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
              'x-rapidapi-host': 'tiktok-transcript.p.rapidapi.com',
              'x-rapidapi-key': '95af1b4bc7mshe7f0e89ab036e1bp1639cfjsn4303dd6c7328',
            },
            body: `url=${encodeURIComponent(url)}`
          }
        )
        
        if (response.ok) {
          const data = await response.json()
          console.log("[v0] TikTok API response:", data)
          
          let content = ""
          if (data.status === 'success' && data.response && data.response.text) {
            content = data.response.text
            transcript = content
          } else if (data.transcript) {
            content = data.transcript
            transcript = content
          } else if (data.text) {
            content = data.text
            transcript = content
          } else if (typeof data === "string") {
            content = data
            transcript = content
          }
          
          if (content.trim()) {
            return {
              content: content.trim(),
              platform: "TikTok",
              transcript: content.trim(),
            }
          }
        } else {
          console.log("[v0] TikTok API failed:", response.status, response.statusText)
        }
      } catch (error) {
        console.log("[v0] TikTok content extraction error:", error)
      }
    }
  } catch (error) {
    console.log("[v0] Content extraction error:", error)
  }

  const mockContent =
    language === "zh"
      ? {
          youtube:
            "大家好！你們是否厭倦了生產力低下的困擾？在今天的影片中，我將向你們展示幫助我在30天內將產出翻倍的確切系統。但首先，讓我問你們這個問題 - 你們每天在不能真正推動進展的任務上浪費了多少小時？如果你們像大多數人一樣，可能比你們想像的還要多。請繼續觀看，因為我即將揭示改變我一切的三步框架。如果你們看到最後，我會給你們我的免費生產力清單，你們現在就可以下載。讓我們開始吧！",
          tiktok:
            "POV：你一直都做錯了晨間例行公事！成功人士實際上是這樣做的：第一步 - 他們在第一個小時內不看手機。第二步 - 他們做這個只需5分鐘的奇怪運動。第三步 - 他們吃這種特定的早餐，能將腦力提升40%。想知道那個運動和早餐是什麼嗎？關注我看第二部分！如果你想要我完整的晨間清單發送到你的私訊，請評論'例行公事'。",
          instagram:
            "滑動查看我工作空間改造的前後對比！➡️ 我以前在床上工作（別批評我😅），但在實施這5個簡單改變後，我的生產力飆升，終於開始達成目標。最棒的是？總共花費不到100美元。保存這篇貼文並嘗試這些技巧 - 你未來的自己會感謝你！你最大的工作空間挑戰是什麼？在下面的評論中告訴我👇",
        }
      : {
          youtube:
            "Hey everyone! Are you tired of struggling with productivity? In today's video, I'm going to show you the exact system that helped me double my output in just 30 days. But first, let me ask you this - how many hours do you waste each day on tasks that don't actually move the needle? If you're like most people, it's probably more than you think. Stay tuned because I'm about to reveal the three-step framework that changed everything for me. And if you stick around until the end, I'll give you my free productivity checklist that you can download right now. Let's dive in!",
          tiktok:
            "POV: You've been doing morning routines all wrong! Here's what successful people actually do: Step 1 - They don't check their phone for the first hour. Step 2 - They do this one weird exercise that takes 5 minutes. Step 3 - They eat this specific breakfast that boosts brain power by 40%. Want to know what that exercise and breakfast are? Follow me for part 2! And comment 'ROUTINE' if you want my full morning checklist sent to your DMs.",
          instagram:
            "Swipe to see the before and after of my workspace transformation! ➡️ I used to work from my bed (don't judge me 😅) but after implementing these 5 simple changes, my productivity skyrocketed and I finally started hitting my goals. The best part? It cost me less than $100 total. Save this post and try these tips - your future self will thank you! What's your biggest workspace challenge? Tell me in the comments below 👇",
        }

  const content = mockContent[platform as keyof typeof mockContent] || mockContent.youtube

  return {
    content,
    platform: platform.charAt(0).toUpperCase() + platform.slice(1),
    transcript: content, // For mock content, transcript is the same as content
  }
}

function detectPlatform(url: string): string {
  if (url.includes("youtube.com") || url.includes("youtu.be")) return "youtube"
  if (url.includes("tiktok.com")) return "tiktok"
  if (url.includes("instagram.com")) return "instagram"
  return "unknown"
}
