// Content extraction utilities for different social media platforms
export async function extractContentFromUrl(
  url: string,
  language = "en",
): Promise<{ content: string; platform: string; transcript: string }> {
  const platform = detectPlatform(url)
  let transcript = ""

  try {
    if (platform === "instagram") {
      // Use RapidAPI Instagram Transcripts API
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
    } else if (platform === "threads") {
      // Extract username from Threads URL
      try {
        console.log("[v0] Extracting Threads content from URL:", url)
        
        // Extract username from URL like https://www.threads.com/@username/post/...
        const usernameMatch = url.match(/@([^/]+)/)
        if (!usernameMatch) {
          throw new Error("Could not extract username from Threads URL")
        }
        
        const username = usernameMatch[1]
        console.log("[v0] Extracted username:", username)
        
        // Use RapidAPI Threads API
        const response = await fetch(
          `https://threads-api4.p.rapidapi.com/api/user/info?username=${username}`,
          {
            method: 'GET',
            headers: {
              'x-rapidapi-host': 'threads-api4.p.rapidapi.com',
              'x-rapidapi-key': '95af1b4bc7mshe7f0e89ab036e1bp1639cfjsn4303dd6c7328',
            },
          }
        )
        
        if (response.ok) {
          const data = await response.json()
          console.log("[v0] Threads API response:", data)
          
          // Extract bio or latest post content
          let content = ""
          if (data.bio) {
            content = data.bio
          } else if (data.latest_posts && data.latest_posts.length > 0) {
            content = data.latest_posts[0].text || ""
          }
          
          if (content.trim()) {
            return {
              content: content.trim(),
              platform: "Threads",
              transcript: content.trim(),
            }
          }
        } else {
          console.log("[v0] Threads API failed:", response.status, response.statusText)
        }
      } catch (error) {
        console.log("[v0] Threads content extraction error:", error)
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
          if (data.transcript) {
            content = data.transcript
          } else if (data.text) {
            content = data.text
          } else if (typeof data === "string") {
            content = data
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

  // If we reach here, content extraction failed
  throw new Error(
    language === "zh" 
      ? "抱歉，無法分析此連結。請確認連結格式正確，目前支援 YouTube、TikTok、Instagram 和 Threads 的內容提取。"
      : "Sorry, unable to analyze this link. Please check the link format is correct. Currently supporting YouTube, TikTok, Instagram, and Threads content extraction."
  )
}

function detectPlatform(url: string): string {
  if (url.includes("youtube.com") || url.includes("youtu.be")) return "youtube"
  if (url.includes("tiktok.com")) return "tiktok"
  if (url.includes("instagram.com")) return "instagram"
  if (url.includes("threads.net") || url.includes("threads.com")) return "threads"
  return "unknown"
}
