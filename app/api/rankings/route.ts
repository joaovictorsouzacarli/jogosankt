import { NextResponse } from "next/server"
import { saveScore, getRanking } from "@/lib/db"

// API para obter o ranking
export async function GET() {
  const rankings = await getRanking()
  return NextResponse.json(rankings)
}

// API para salvar uma pontuação
export async function POST(request: Request) {
  try {
    const { nickname, score } = await request.json()

    if (!nickname || typeof score !== "number") {
      return NextResponse.json({ error: "Nickname e score são obrigatórios" }, { status: 400 })
    }

    const success = await saveScore(nickname, score)

    if (success) {
      return NextResponse.json({ success: true })
    } else {
      return NextResponse.json({ error: "Erro ao salvar pontuação" }, { status: 500 })
    }
  } catch (error) {
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}
