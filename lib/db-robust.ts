import { neon } from "@neondatabase/serverless"

// Verificar se a DATABASE_URL está configurada
if (!process.env.DATABASE_URL) {
  console.error("❌ DATABASE_URL não configurada!")
  throw new Error("DATABASE_URL environment variable is required")
}

console.log("✅ DATABASE_URL configurada")

const sql = neon(process.env.DATABASE_URL)

export type RankingEntry = {
  id?: number
  nickname: string
  score: number
  created_at?: string
}

// Função para testar a conexão
export async function testConnection(): Promise<{ success: boolean; message: string }> {
  try {
    console.log("🔍 Testando conexão com Neon...")

    const result = await sql`SELECT 'Conexão OK!' as status, NOW() as timestamp`

    console.log("✅ Conexão com Neon estabelecida:", result[0])
    return { success: true, message: "Conexão estabelecida com sucesso!" }
  } catch (error) {
    console.error("❌ Erro de conexão:", error)
    return {
      success: false,
      message: `Erro de conexão: ${error instanceof Error ? error.message : "Erro desconhecido"}`,
    }
  }
}

// Função para verificar se a tabela existe
export async function checkTable(): Promise<{ exists: boolean; message: string }> {
  try {
    console.log("🔍 Verificando se tabela 'rankings' existe...")

    const result = await sql`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'rankings'
      );
    `

    const exists = result[0]?.exists || false
    console.log(`📊 Tabela rankings existe: ${exists}`)

    return {
      exists,
      message: exists ? "Tabela encontrada!" : "Tabela não encontrada - execute o script SQL",
    }
  } catch (error) {
    console.error("❌ Erro ao verificar tabela:", error)
    return { exists: false, message: "Erro ao verificar tabela" }
  }
}

// Função para criar a tabela se não existir
export async function createTableIfNotExists(): Promise<boolean> {
  try {
    console.log("🔧 Criando tabela se não existir...")

    await sql`
      CREATE TABLE IF NOT EXISTS rankings (
        id SERIAL PRIMARY KEY,
        nickname VARCHAR(50) NOT NULL,
        score INTEGER NOT NULL DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `

    await sql`
      CREATE INDEX IF NOT EXISTS idx_rankings_score ON rankings(score DESC)
    `

    console.log("✅ Tabela criada/verificada com sucesso")
    return true
  } catch (error) {
    console.error("❌ Erro ao criar tabela:", error)
    return false
  }
}

// Função para salvar pontuação
export async function saveScore(nickname: string, score: number): Promise<{ success: boolean; message: string }> {
  try {
    console.log(`💾 Salvando: ${nickname} - ${score} pontos`)

    // Verificar conexão primeiro
    const connectionTest = await testConnection()
    if (!connectionTest.success) {
      return { success: false, message: "Erro de conexão com banco" }
    }

    // Verificar/criar tabela
    await createTableIfNotExists()

    // Verificar se jogador já existe
    const existing = await sql`
      SELECT * FROM rankings 
      WHERE nickname = ${nickname} 
      ORDER BY score DESC 
      LIMIT 1
    `

    if (existing.length > 0) {
      // Atualizar se pontuação for maior
      if (score > existing[0].score) {
        await sql`
          UPDATE rankings 
          SET score = ${score}, created_at = CURRENT_TIMESTAMP 
          WHERE nickname = ${nickname}
        `
        console.log(`🔄 Pontuação atualizada: ${nickname} - ${score}`)
        return { success: true, message: "Pontuação atualizada!" }
      } else {
        console.log(`📊 Pontuação não é maior que a existente: ${existing[0].score}`)
        return { success: true, message: "Pontuação registrada (não é recorde)" }
      }
    } else {
      // Inserir novo jogador
      await sql`
        INSERT INTO rankings (nickname, score) 
        VALUES (${nickname}, ${score})
      `
      console.log(`➕ Novo jogador adicionado: ${nickname} - ${score}`)
      return { success: true, message: "Novo jogador adicionado!" }
    }
  } catch (error) {
    console.error("❌ Erro ao salvar:", error)
    return {
      success: false,
      message: `Erro ao salvar: ${error instanceof Error ? error.message : "Erro desconhecido"}`,
    }
  }
}

// Função para obter ranking
export async function getRanking(): Promise<{ success: boolean; data: RankingEntry[]; message: string }> {
  try {
    console.log("📊 Buscando ranking...")

    // Verificar conexão
    const connectionTest = await testConnection()
    if (!connectionTest.success) {
      return { success: false, data: [], message: "Erro de conexão" }
    }

    // Verificar tabela
    const tableCheck = await checkTable()
    if (!tableCheck.exists) {
      await createTableIfNotExists()
    }

    // Buscar rankings
    const rankings = await sql<RankingEntry[]>`
      SELECT id, nickname, score, created_at
      FROM rankings 
      ORDER BY score DESC, created_at ASC
      LIMIT 100
    `

    console.log(`📈 Rankings encontrados: ${rankings.length}`)
    return { success: true, data: rankings, message: "Rankings carregados!" }
  } catch (error) {
    console.error("❌ Erro ao buscar ranking:", error)
    return {
      success: false,
      data: [],
      message: `Erro: ${error instanceof Error ? error.message : "Erro desconhecido"}`,
    }
  }
}
