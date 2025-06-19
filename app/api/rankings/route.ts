import { NextResponse } from "next/server"
import { saveScore, getRanking } from "@/lib/db-robust"

// API para obter o ranking
export async function GET() {
  try {
    console.log("🚀 GET /api/rankings")

    const result = await getRanking()

    if (result.success) {
      return NextResponse.json({
        success: true,
        data: result.data,
        message: result.message,
        count: result.data.length,
      })
    } else {
      return NextResponse.json(
        {
          success: false,
          data: [],
          message: result.message,
        },
        { status: 500 },
      )
    }
  } catch (error) {
    console.error("❌ Erro na API GET:", error)
    return NextResponse.json(
      {
        success: false,
        data: [],
        message: "Erro interno do servidor",
      },
      { status: 500 },
    )
  }
}

// API para salvar pontuação
export async function POST(request: Request) {
  try {
    console.log("🚀 POST /api/rankings")

    const { nickname, score } = await request.json()

    // Validações
    if (!nickname || typeof nickname !== "string" || nickname.trim().length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Nickname é obrigatório",
        },
        { status: 400 },
      )
    }

    if (typeof score !== "number" || score < 0 || score > 1000) {
      return NextResponse.json(
        {
          success: false,
          message: "Score deve ser um número entre 0 e 1000",
        },
        { status: 400 },
      )
    }

    const result = await saveScore(nickname.trim(), score)

    return NextResponse.json(
      {
        success: result.success,
        message: result.message,
      },
      { status: result.success ? 200 : 500 },
    )
  } catch (error) {
    console.error("❌ Erro na API POST:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Erro interno do servidor",
      },
      { status: 500 },
    )
  }
}
