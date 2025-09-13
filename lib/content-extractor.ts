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
      // For Threads, we'll extract the text content from the post
      // Since Threads doesn't have a public API, we'll use a web scraping approach
      try {
        console.log("[v0] Extracting Threads content from URL:", url)
        
        // Use a web scraping service or direct fetch to get the page content
        const response = await fetch(url, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
          }
        })
        
        if (response.ok) {
          const html = await response.text()
          
          // Extract text content from the Threads post
          // This is a simplified approach - in production you might want to use a more robust parser
          const textMatch = html.match(/"text":"([^"]+)"/g)
          if (textMatch && textMatch.length > 0) {
            // Get the first text match (usually the main post content)
            const textContent = textMatch[0].replace(/"text":"([^"]+)"/, '$1')
            // Decode any escaped characters
            const decodedContent = textContent
              .replace(/\\n/g, '\n')
              .replace(/\\"/g, '"')
              .replace(/\\'/g, "'")
              .replace(/\\\\/g, '\\')
            
            if (decodedContent.trim()) {
              return {
                content: decodedContent.trim(),
                platform: "Threads",
                transcript: decodedContent.trim(),
              }
            }
          }
          
          // Fallback: try to extract from meta tags
          const metaMatch = html.match(/<meta[^>]*property="og:description"[^>]*content="([^"]+)"/i)
          if (metaMatch) {
            const metaContent = metaMatch[1]
              .replace(/&amp;/g, '&')
              .replace(/&lt;/g, '<')
              .replace(/&gt;/g, '>')
              .replace(/&quot;/g, '"')
              .replace(/&#39;/g, "'")
            
            if (metaContent.trim()) {
              return {
                content: metaContent.trim(),
                platform: "Threads",
                transcript: metaContent.trim(),
              }
            }
          }
        } else {
          console.log("[v0] Threads content extraction failed:", response.status, response.statusText)
        }
      } catch (error) {
        console.log("[v0] Threads content extraction error:", error)
      }
    }
  } catch (error) {
    console.log("[v0] Content extraction error:", error)
  }

  // If we reach here, content extraction failed
  throw new Error(
    language === "zh" 
      ? "抱歉，此連結類型暫不支援。目前僅支援 YouTube、Instagram 和 Threads 的內容提取。"
      : "Sorry, this link type is not supported. Currently only YouTube, Instagram, and Threads content extraction is supported."
  )
}

function detectPlatform(url: string): string {
  if (url.includes("youtube.com") || url.includes("youtu.be")) return "youtube"
  if (url.includes("tiktok.com")) return "tiktok"
  if (url.includes("instagram.com")) return "instagram"
  if (url.includes("threads.net") || url.includes("threads.com")) return "threads"
  return "unknown"
}
