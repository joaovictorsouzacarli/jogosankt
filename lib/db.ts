import { neon } from "@neondatabase/serverless"

// Você vai substituir esta URL pela sua URL do Neon
const DATABASE_URL = "postgresql://neondb_owner:npg_hjY1OTpz9RmD@ep-tight-sea-a83bzzqr-pooler.eastus2.azure.neon.tech/neondb?sslmode=require"

// Cliente SQL
export const sql = neon(DATABASE_URL)

export type RankingEntry = {
  id?: number
  nickname: string
  score: number
  created_at?: string
}

// Função para salvar pontuação
export async function saveScore(nickname: string, score: number): Promise<boolean> {
  try {
    // Primeiro verificamos se o jogador já existe
    const existingPlayer = await sql`
      SELECT * FROM rankings WHERE nickname = ${nickname}
    `

    if (existingPlayer.length > 0) {
      // Se o jogador existe e a nova pontuação é maior, atualizamos
      if (score > existingPlayer[0].score) {
        await sql`
          UPDATE rankings SET score = ${score} WHERE nickname = ${nickname}
        `
      }
    } else {
      // Se o jogador não existe, inserimos
      await sql`
        INSERT INTO rankings (nickname, score) VALUES (${nickname}, ${score})
      `
    }

    return true
  } catch (error) {
    console.error("Erro ao salvar pontuação:", error)
    return false
  }
}

// Função para obter o ranking
export async function getRanking(): Promise<RankingEntry[]> {
  try {
    const rankings = await sql<RankingEntry[]>`
      SELECT * FROM rankings ORDER BY score DESC LIMIT 100
    `

    return rankings || []
  } catch (error) {
    console.error("Erro ao obter ranking:", error)
    return []
  }
}
