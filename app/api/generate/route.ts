import { type NextRequest, NextResponse } from "next/server"
import { generateScript } from "@/lib/ai-client"

export async function POST(request: NextRequest) {
  try {
    const { analysis, userRequirements, variations = 1, language = "en" } = await request.json()

    if (!analysis || !userRequirements?.body) {
      return NextResponse.json({ error: "Analysis and user requirements (body content) are required" }, { status: 400 })
    }

    const result = await generateScript(analysis, userRequirements, Number.parseInt(variations), language)

    return NextResponse.json(result)
  } catch (error) {
    console.error("Generation error:", error)
    return NextResponse.json({ error: "Failed to generate scripts" }, { status: 500 })
  }
}
