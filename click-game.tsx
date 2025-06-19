"use client"

import type React from "react"

import { useState, useEffect, useCallback, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import Image from "next/image"
import {
  Loader2,
  Twitch,
  User,
  ExternalLink,
  Clock,
  Mail,
  Globe,
  Twitter,
  Instagram,
  Youtube,
  Music,
} from "lucide-react"
import type { RankingEntry } from "@/lib/db"

const funnyMessages = [
  "🎉 ACERTOU! Que mira!",
  "💥 BOOM! Pegou o SANKT!",
  "⚡ RÁPIDO COMO UM RAIO!",
  "🔥 ESTÁ PEGANDO FOGO!",
  "🎯 CERTEIRO EM CHEIO!",
  "💪 FORÇA TOTAL!",
  "🚀 VOANDO ALTO!",
  "⭐ ESTRELA DO STREAM!",
  "🎪 SHOW DE BOLA!",
  "🏆 CAMPEÃO DO CHAT!",
  "📻 NO AR COM SANKT!",
  "⚔️ GUERREIRO DO ALBION!",
]

const chatMessages = [
  { user: "viewer1", message: "POGGERS SANKT!", color: "text-purple-300" },
  { user: "albion_fan", message: "GG WARRIOR!", color: "text-yellow-300" },
  { user: "music_lover", message: "BANGER RADIO!", color: "text-pink-300" },
  { user: "gamer123", message: "SPEED RUN!", color: "text-green-300" },
  { user: "radio_listener", message: "MELHOR DJ!", color: "text-orange-300" },
]

const streamingElements = [
  { emoji: "💜", x: 10, y: 20, delay: 0 },
  { emoji: "📻", x: 80, y: 15, delay: 1 },
  { emoji: "🎮", x: 15, y: 70, delay: 2 },
  { emoji: "⚔️", x: 85, y: 60, delay: 0.5 },
  { emoji: "🎧", x: 70, y: 25, delay: 1.5 },
  { emoji: "💬", x: 25, y: 80, delay: 2.5 },
  { emoji: "🔴", x: 90, y: 80, delay: 1.8 },
  { emoji: "🎵", x: 5, y: 50, delay: 0.8 },
]

export default function Component() {
  const [score, setScore] = useState(0)
  const [position, setPosition] = useState({ x: 50, y: 50 })
  const [gameStarted, setGameStarted] = useState(false)
  const [timeLeft, setTimeLeft] = useState(30)
  const [gameOver, setGameOver] = useState(false)
  const [showMessage, setShowMessage] = useState("")
  const [clickEffect, setClickEffect] = useState<{ x: number; y: number } | null>(null)
  const [chatMessage, setChatMessage] = useState("")
  const [nickname, setNickname] = useState("")
  const [showRanking, setShowRanking] = useState(false)
  const [showAbout, setShowAbout] = useState(false)
  const [rankings, setRankings] = useState<RankingEntry[]>([])
  const [nicknameError, setNicknameError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [connectionError, setConnectionError] = useState("")

  // Usar useRef para manter referências estáveis
  const gameStartedRef = useRef(false)
  const gameOverRef = useRef(false)
  const scoreRef = useRef(0)
  const nicknameRef = useRef("")

  // Atualizar refs quando os estados mudarem
  useEffect(() => {
    gameStartedRef.current = gameStarted
  }, [gameStarted])

  useEffect(() => {
    gameOverRef.current = gameOver
  }, [gameOver])

  useEffect(() => {
    scoreRef.current = score
  }, [score])

  useEffect(() => {
    nicknameRef.current = nickname
  }, [nickname])

  // Carregar rankings ao iniciar
  useEffect(() => {
    fetchRankings()
  }, [])

  const fetchRankings = async () => {
    try {
      setIsLoading(true)
      setConnectionError("")

      console.log("Carregando rankings...")
      const response = await fetch("/api/rankings")

      if (!response.ok) {
        throw new Error(`Erro HTTP: ${response.status}`)
      }

      const result = await response.json()
      console.log("Resposta da API:", result)

      if (result.success) {
        setRankings(result.data || [])
      } else {
        setConnectionError(result.message || "Erro ao carregar rankings")
      }
    } catch (error) {
      console.error("Erro ao carregar ranking:", error)
      setConnectionError("Erro ao conectar com o banco de dados. Tente novamente.")
    } finally {
      setIsLoading(false)
    }
  }

  const generateRandomPosition = useCallback(() => {
    const maxX = 85
    const maxY = 75
    const minX = 5
    const minY = 15

    return {
      x: Math.random() * (maxX - minX) + minX,
      y: Math.random() * (maxY - minY) + minY,
    }
  }, [])

  const updateChat = useCallback(() => {
    const randomMessage = chatMessages[Math.floor(Math.random() * chatMessages.length)]
    setChatMessage(`${randomMessage.user}: ${randomMessage.message}`)
    setTimeout(() => setChatMessage(""), 3000)
  }, [])

  const handleImageClick = (event: React.MouseEvent) => {
    if (!gameStarted || gameOver) return

    // Efeito de clique na posição do mouse
    const rect = (event.currentTarget as HTMLElement).getBoundingClientRect()
    setClickEffect({
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    })

    setScore((prev) => prev + 1)
    setPosition(generateRandomPosition())

    // Mensagem aleatória
    const randomMessage = funnyMessages[Math.floor(Math.random() * funnyMessages.length)]
    setShowMessage(randomMessage)

    // Atualizar chat
    updateChat()

    // Remove a mensagem após 1 segundo
    setTimeout(() => setShowMessage(""), 1000)

    // Remove o efeito de clique após animação
    setTimeout(() => setClickEffect(null), 600)
  }

  const startGame = () => {
    if (!nickname.trim()) {
      setNicknameError("Digite seu nick para jogar!")
      return
    }

    setNicknameError("")
    setScore(0)
    setTimeLeft(30)
    setGameStarted(true)
    setGameOver(false)
    setPosition(generateRandomPosition())
    setShowMessage("")
    setChatMessage("")
    setShowRanking(false)
    setShowAbout(false)
  }

  const resetGame = () => {
    setScore(0)
    setTimeLeft(30)
    setGameStarted(false)
    setGameOver(false)
    setPosition({ x: 50, y: 50 })
    setShowMessage("")
    setChatMessage("")
    setShowRanking(false)
    setShowAbout(false)
  }

  const saveScoreToServer = async () => {
    const currentNickname = nicknameRef.current
    const currentScore = scoreRef.current

    if (!currentNickname || currentScore <= 0) return

    try {
      setIsSaving(true)
      console.log(`Salvando pontuação: ${currentNickname} - ${currentScore}`)

      const response = await fetch("/api/rankings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ nickname: currentNickname, score: currentScore }),
      })

      const result = await response.json()
      console.log("Resposta do servidor:", result)

      if (result.success) {
        console.log("✅ Pontuação salva:", result.message)
        // Atualizar o ranking após salvar
        await fetchRankings()
      } else {
        console.error("❌ Erro ao salvar:", result.message)
        setConnectionError(result.message)
      }
    } catch (error) {
      console.error("Erro ao salvar pontuação:", error)
      setConnectionError("Erro ao salvar pontuação. Tente novamente.")
    } finally {
      setIsSaving(false)
    }
  }

  const getScoreComment = () => {
    if (score >= 50) return "🏆 LENDA DO STREAM! SANKT ficaria orgulhoso!"
    if (score >= 40) return "🔥 MONSTRO ÉPICO! Você é amigo do streamer!"
    if (score >= 30) return "⚡ SPEEDRUN MASTER! Reflexos de streamer!"
    if (score >= 20) return "🎯 SNIPER DO CHAT! Mira perfeita!"
    if (score >= 15) return "💪 GUERREIRO ÉPICO! Mandou bem!"
    if (score >= 10) return "👍 SEGUIDOR FIEL! Está pegando o jeito!"
    if (score >= 5) return "😊 NOVATO NO STREAM! Continue assim!"
    return "😅 LURKER DETECTED! Todo mundo começa assim!"
  }

  const openTwitchChannel = () => {
    window.open("https://www.twitch.tv/sankt", "_blank")
  }

  const openLink = (url: string) => {
    window.open(url, "_blank")
  }

  // Timer independente - SEM DEPENDÊNCIAS PROBLEMÁTICAS
  useEffect(() => {
    let timer: NodeJS.Timeout

    if (gameStarted && timeLeft > 0 && !gameOver) {
      timer = setTimeout(() => {
        setTimeLeft((prev) => {
          const newTime = prev - 1

          // Verificar se o tempo acabou
          if (newTime === 0) {
            // Usar setTimeout para evitar conflitos de estado
            setTimeout(() => {
              setGameOver(true)
              setGameStarted(false)
              saveScoreToServer()
            }, 0)
          }

          return newTime
        })
      }, 1000)
    }

    return () => {
      if (timer) {
        clearTimeout(timer)
      }
    }
  }, [gameStarted, timeLeft, gameOver]) // Apenas dependências essenciais

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-700 to-indigo-900 relative overflow-hidden">
      {/* Cenário de streaming/gaming */}
      <div className="absolute inset-0">
        {/* Elementos flutuantes do streaming */}
        <div className="absolute top-10 left-5">
          <div className="animate-bounce text-4xl opacity-40" style={{ animationDelay: "0s", animationDuration: "3s" }}>
            🔴 LIVE
          </div>
        </div>
        <div className="absolute top-20 right-10">
          <div className="animate-pulse text-3xl opacity-50" style={{ animationDelay: "1s", animationDuration: "2s" }}>
            📻 RÁDIO SANKT
          </div>
        </div>

        {/* Elementos decorativos do gaming */}
        {streamingElements.map((element, index) => (
          <div
            key={index}
            className="absolute text-3xl opacity-30 animate-pulse"
            style={{
              left: `${element.x}%`,
              top: `${element.y}%`,
              animationDelay: `${element.delay}s`,
              animationDuration: "2s",
            }}
          >
            {element.emoji}
          </div>
        ))}

        {/* Chat do Twitch simulado - mais dinâmico */}
        <div className="absolute top-1/4 right-2 bg-gray-900/90 text-purple-300 p-3 rounded text-xs opacity-80 w-48">
          <div className="text-purple-400 font-bold mb-2">💬 CHAT AO VIVO</div>
          <div className="space-y-1">
            <div>💜 viewer1: POGGERS</div>
            <div>⚔️ albion_fan: GG SANKT</div>
            <div>🎵 music_lover: BANGER</div>
            {chatMessage && <div className="text-yellow-300 animate-pulse font-bold">🔥 {chatMessage}</div>}
          </div>
        </div>

        {/* Setup de streaming no fundo */}
        <div className="absolute bottom-0 left-0 w-full h-40 bg-gradient-to-t from-gray-800/50 to-transparent"></div>
        <div className="absolute bottom-5 left-10 text-6xl opacity-20">🖥️</div>
        <div className="absolute bottom-8 right-20 text-4xl opacity-25">🎧</div>
        <div className="absolute bottom-12 left-1/3 text-3xl opacity-20">⌨️</div>

        {/* Logo Albion Online estilizado */}
        <div className="absolute top-1/3 left-5 text-2xl opacity-30 bg-yellow-600/20 p-2 rounded">⚔️ ALBION</div>
      </div>

      {/* Header com pontuação e tempo */}
      <div className="absolute top-4 left-4 right-4 z-10">
        <div className="flex justify-between items-center">
          <Card className="px-4 py-2 bg-purple-900/95 backdrop-blur-sm border-2 border-purple-400 shadow-lg text-white">
            <div className="text-lg font-bold">
              🎯 Cliques: <span className="text-purple-300 text-xl">{score}</span>
            </div>
          </Card>

          {gameStarted && (
            <Card className="px-4 py-2 bg-red-900/95 backdrop-blur-sm border-2 border-red-400 shadow-lg text-white">
              <div className="text-lg font-bold">
                ⏰ Stream: <span className="text-red-300 text-xl">{timeLeft}s</span>
              </div>
            </Card>
          )}
        </div>
      </div>

      {/* Mensagem engraçada flutuante */}
      {showMessage && (
        <div className="absolute top-1/3 left-1/2 transform -translate-x-1/2 z-30">
          <div className="bg-purple-600 text-white px-6 py-3 rounded-full text-xl font-bold shadow-lg animate-bounce border-4 border-purple-400">
            {showMessage}
          </div>
        </div>
      )}

      {/* Efeito de clique */}
      {clickEffect && (
        <div className="absolute z-20 pointer-events-none" style={{ left: clickEffect.x, top: clickEffect.y }}>
          <div className="text-4xl animate-ping">💥</div>
        </div>
      )}

      {/* Tela inicial com entrada de nickname */}
      {!gameStarted && !gameOver && !showRanking && !showAbout && (
        <div className="absolute inset-0 flex items-center justify-center z-20">
          <Card className="p-8 bg-gray-900/95 backdrop-blur-sm text-center max-w-md mx-4 border-4 border-purple-500 shadow-2xl text-white">
            <div className="flex justify-between items-center mb-4">
              <div className="text-6xl animate-bounce">📻</div>
              <button
                onClick={openTwitchChannel}
                className="bg-[#9146FF] hover:bg-[#7a2df0] text-white p-2 rounded-lg flex items-center gap-2 transition-all"
                aria-label="Abrir canal da Twitch"
              >
                <Twitch size={24} />
                <span className="font-bold">SANKT</span>
              </button>
            </div>

            <h1 className="text-3xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              🎮 CAÇA AO SANKT! 📻
            </h1>
            <p className="text-gray-300 mb-6 text-lg">
              Bem-vindo ao stream mais ÉPICO! 🔴<br />O SANKT está transmitindo a rádio enquanto joga Albion Online!
              <br />
              <span className="text-purple-400 font-bold">30 segundos de pura adrenalina!</span>
            </p>

            <div className="mb-6">
              <label htmlFor="nickname" className="block text-left text-sm font-medium text-gray-300 mb-1">
                Seu Nick:
              </label>
              <Input
                id="nickname"
                type="text"
                placeholder="Digite seu nick para jogar"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                className="bg-gray-800 border-purple-500 text-white"
                maxLength={15}
              />
              {nicknameError && <p className="text-red-400 text-sm mt-1 text-left">{nicknameError}</p>}
            </div>

            <div className="space-y-3">
              <Button
                onClick={startGame}
                size="lg"
                className="w-full text-xl py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 animate-pulse"
              >
                🚀 ENTRAR NO STREAM! 🚀
              </Button>

              <div className="grid grid-cols-2 gap-3">
                <Button
                  onClick={() => setShowRanking(true)}
                  variant="outline"
                  size="lg"
                  className="text-sm py-3 border-2 border-purple-400 text-white hover:bg-purple-800"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <span className="flex items-center gap-1">
                      <Loader2 className="animate-spin" size={16} />
                    </span>
                  ) : (
                    <span className="flex items-center gap-1">
                      🏆 <span className="hidden sm:inline">RANKING</span>
                    </span>
                  )}
                </Button>

                <Button
                  onClick={() => setShowAbout(true)}
                  variant="outline"
                  size="lg"
                  className="text-sm py-3 border-2 border-yellow-400 text-white hover:bg-yellow-800"
                >
                  <span className="flex items-center gap-1">
                    <User size={16} />
                    <span className="hidden sm:inline">QUEM É SANKT?</span>
                    <span className="sm:hidden">SANKT?</span>
                  </span>
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Tela "Quem é o Sankt?" */}
      {showAbout && !gameStarted && !gameOver && (
        <div className="absolute inset-0 flex items-center justify-center z-20 p-4">
          <Card className="p-6 bg-gray-900/95 backdrop-blur-sm text-center max-w-2xl mx-4 border-4 border-yellow-500 shadow-2xl text-white max-h-[90vh] overflow-y-auto">
            <div className="text-4xl mb-4">👨‍💻</div>
            <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
              QUEM É O SANKT? 📻
            </h2>

            <div className="text-left space-y-4 text-gray-300">
              <p className="text-lg">
                Olá! 👋 Meu nome é <span className="text-yellow-400 font-bold">Marcos</span>, tenho{" "}
                <span className="text-purple-400 font-bold">37 anos</span> e sou do{" "}
                <span className="text-green-400 font-bold">Rio de Janeiro</span>, mas atualmente moro em{" "}
                <span className="text-blue-400 font-bold">Lisboa (Portugal)</span> 🇵🇹 com minha esposa e minha filha.
              </p>

              <p>
                Sou formado em <span className="text-purple-400 font-bold">Comunicação Social</span> e atuei como{" "}
                <span className="text-yellow-400 font-bold">jornalista</span> em veículos como Lance, Band, InterTV e
                Globo. 📺 Antes de me dedicar às lives, fui coordenador da CBF TV, na Confederação Brasileira de
                Futebol. ⚽
              </p>

              <p>
                No Albion Online, meu nick é <span className="text-red-400 font-bold">Sankt</span>. ⚔️ Além de jogar,
                crio conteúdos para o canal <span className="text-purple-400 font-bold">Albion em 1 Minuto</span> no
                YouTube e faço lives de segunda a sexta aqui na Twitch. 🎮
              </p>

              {/* Horários de transmissão */}
              <div className="bg-purple-900/50 p-4 rounded-lg border-2 border-purple-400">
                <h3 className="text-xl font-bold mb-3 text-yellow-300 flex items-center gap-2">
                  <Clock size={20} />
                  Horário das Lives (Segunda a Sexta):
                </h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-lg">
                    <span className="text-2xl">🇧🇷</span>
                    <span className="font-bold text-green-400">7h da manhã</span>
                    <span>- Brasília</span>
                  </div>
                  <div className="flex items-center gap-2 text-lg">
                    <span className="text-2xl">🇵🇹</span>
                    <span className="font-bold text-blue-400">10h da manhã</span>
                    <span>- Lisboa</span>
                  </div>
                </div>
              </div>

              {/* Contato */}
              <div className="bg-gray-800/50 p-4 rounded-lg border-2 border-gray-600">
                <h3 className="text-xl font-bold mb-3 text-yellow-300 flex items-center gap-2">
                  <Mail size={20} />
                  Contato:
                </h3>
                <p className="text-purple-300">contato.sankt@gmail.com</p>
              </div>

              {/* Redes sociais */}
              <div className="bg-blue-900/50 p-4 rounded-lg border-2 border-blue-400">
                <h3 className="text-xl font-bold mb-3 text-yellow-300">🌐 Redes Sociais:</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                  <button
                    onClick={() => openLink("https://www.sankt.live/")}
                    className="flex items-center gap-2 p-2 bg-gray-700 hover:bg-gray-600 rounded transition-colors"
                  >
                    <Globe size={16} />
                    <span>Site Oficial</span>
                    <ExternalLink size={12} />
                  </button>

                  <button
                    onClick={() => openLink("https://www.twitch.tv/sankt")}
                    className="flex items-center gap-2 p-2 bg-purple-700 hover:bg-purple-600 rounded transition-colors"
                  >
                    <Twitch size={16} />
                    <span>Twitch</span>
                    <ExternalLink size={12} />
                  </button>

                  <button
                    onClick={() => openLink("https://www.youtube.com/@SanktLive")}
                    className="flex items-center gap-2 p-2 bg-red-700 hover:bg-red-600 rounded transition-colors"
                  >
                    <Youtube size={16} />
                    <span>YouTube Sankt</span>
                    <ExternalLink size={12} />
                  </button>

                  <button
                    onClick={() => openLink("https://www.youtube.com/@AlbionEm1Minuto")}
                    className="flex items-center gap-2 p-2 bg-red-700 hover:bg-red-600 rounded transition-colors"
                  >
                    <Music size={16} />
                    <span>Albion em 1 Min</span>
                    <ExternalLink size={12} />
                  </button>

                  <button
                    onClick={() => openLink("https://twitter.com/SanktLive")}
                    className="flex items-center gap-2 p-2 bg-blue-700 hover:bg-blue-600 rounded transition-colors"
                  >
                    <Twitter size={16} />
                    <span>Twitter</span>
                    <ExternalLink size={12} />
                  </button>

                  <button
                    onClick={() => openLink("https://www.instagram.com/sanktlive")}
                    className="flex items-center gap-2 p-2 bg-pink-700 hover:bg-pink-600 rounded transition-colors"
                  >
                    <Instagram size={16} />
                    <span>Instagram</span>
                    <ExternalLink size={12} />
                  </button>

                  <button
                    onClick={() => openLink("https://www.tiktok.com/@sanktlive")}
                    className="flex items-center gap-2 p-2 bg-gray-700 hover:bg-gray-600 rounded transition-colors col-span-1 sm:col-span-2"
                  >
                    <Music size={16} />
                    <span>TikTok</span>
                    <ExternalLink size={12} />
                  </button>
                </div>
              </div>
            </div>

            <div className="space-y-3 mt-6">
              <Button
                onClick={startGame}
                size="lg"
                className="w-full text-xl py-4 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
              >
                🎮 JOGAR AGORA!
              </Button>
              <Button
                onClick={() => setShowAbout(false)}
                variant="outline"
                size="lg"
                className="w-full text-lg py-3 border-2 border-yellow-400 text-white hover:bg-yellow-800"
              >
                🏠 VOLTAR AO MENU
              </Button>
            </div>
          </Card>
        </div>
      )}

      {/* Tela de ranking */}
      {showRanking && !gameStarted && !gameOver && (
        <div className="absolute inset-0 flex items-center justify-center z-20">
          <Card className="p-8 bg-gray-900/95 backdrop-blur-sm text-center max-w-md mx-4 border-4 border-purple-500 shadow-2xl text-white">
            <div className="text-4xl mb-4">🏆</div>
            <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
              RANKING GLOBAL DOS GUERREIROS
            </h2>

            <div className="mb-6 max-h-64 overflow-y-auto">
              {connectionError && (
                <div className="mb-4 p-3 bg-red-900/50 border border-red-500 rounded text-red-300 text-sm">
                  ⚠️ {connectionError}
                </div>
              )}
              {isLoading ? (
                <div className="flex justify-center items-center py-8">
                  <Loader2 className="animate-spin text-purple-400" size={40} />
                </div>
              ) : rankings.length > 0 ? (
                <table className="w-full text-left">
                  <thead className="border-b border-purple-500">
                    <tr>
                      <th className="py-2">#</th>
                      <th className="py-2">Nick</th>
                      <th className="py-2 text-right">Pontos</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rankings.map((entry, index) => (
                      <tr
                        key={index}
                        className={`${index < 3 ? "text-yellow-300 font-bold" : "text-gray-300"} ${entry.nickname === nickname ? "bg-purple-800/50" : ""}`}
                      >
                        <td className="py-2">{index + 1}</td>
                        <td className="py-2">{entry.nickname}</td>
                        <td className="py-2 text-right">{entry.score}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p className="text-gray-400">Nenhuma pontuação registrada ainda!</p>
              )}
            </div>

            <div className="space-y-3">
              <Button
                onClick={startGame}
                size="lg"
                className="w-full text-xl py-4 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
              >
                🎮 JOGAR AGORA!
              </Button>
              <Button
                onClick={() => setShowRanking(false)}
                variant="outline"
                size="lg"
                className="w-full text-lg py-3 border-2 border-purple-400 text-white hover:bg-purple-800"
              >
                🏠 VOLTAR AO MENU
              </Button>
            </div>
          </Card>
        </div>
      )}

      {/* Tela de game over com ranking */}
      {gameOver && (
        <div className="absolute inset-0 flex items-center justify-center z-20">
          <Card className="p-8 bg-gray-900/95 backdrop-blur-sm text-center max-w-md mx-4 border-4 border-purple-500 shadow-2xl text-white">
            <div className="text-6xl mb-4 animate-spin">🎊</div>
            <h2 className="text-3xl font-bold mb-4">🎉 STREAM FINALIZADA! 🎉</h2>
            <p className="text-xl text-gray-300 mb-2">Sua pontuação ÉPICA:</p>
            <p className="text-5xl font-bold text-purple-400 mb-4 animate-pulse">{score}</p>
            <p className="text-lg text-purple-300 font-bold mb-6 bg-purple-900/50 p-3 rounded-lg border-2 border-purple-400">
              {getScoreComment()}
            </p>

            {/* Mini ranking */}
            <div className="mb-6 bg-gray-800/70 p-3 rounded-lg">
              <h3 className="text-xl font-bold mb-2 text-yellow-300">🏆 TOP 3 JOGADORES</h3>
              {isSaving ? (
                <div className="flex justify-center items-center py-4">
                  <Loader2 className="animate-spin text-purple-400" size={24} />
                  <span className="ml-2">Salvando pontuação...</span>
                </div>
              ) : (
                <div className="space-y-1">
                  {rankings.slice(0, 3).map((entry, index) => (
                    <div
                      key={index}
                      className={`flex justify-between items-center ${entry.nickname === nickname ? "bg-purple-800/50 p-1 rounded" : ""}`}
                    >
                      <span className="font-bold">
                        {index === 0 ? "🥇" : index === 1 ? "🥈" : "🥉"} {entry.nickname}
                      </span>
                      <span className="text-yellow-300">{entry.score}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-3">
              <Button
                onClick={startGame}
                size="lg"
                className="w-full text-xl py-4 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
              >
                🔄 NOVA STREAM!
              </Button>
              <Button
                onClick={() => setShowRanking(true)}
                variant="outline"
                size="lg"
                className="w-full text-lg py-3 border-2 border-yellow-400 text-white hover:bg-yellow-800"
              >
                🏆 VER RANKING COMPLETO
              </Button>
              <Button
                onClick={resetGame}
                variant="outline"
                size="lg"
                className="w-full text-lg py-3 border-2 border-purple-400 text-white hover:bg-purple-800"
              >
                🏠 VOLTAR AO MENU
              </Button>
            </div>
          </Card>
        </div>
      )}

      {/* Imagem clicável do SANKT */}
      {gameStarted && !gameOver && (
        <div
          className="absolute transition-all duration-200 ease-out cursor-pointer hover:scale-125 active:scale-90 z-10"
          style={{
            left: `${position.x}%`,
            top: `${position.y}%`,
            transform: "translate(-50%, -50%)",
          }}
          onClick={handleImageClick}
        >
          <div className="relative">
            <div className="absolute -inset-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full animate-ping opacity-40"></div>
            <Image
              src="/target-image.png"
              alt="SANKT!"
              width={100}
              height={100}
              className="rounded-full border-4 border-purple-400 shadow-2xl animate-bounce relative z-10"
              style={{ animationDuration: "0.8s" }}
            />
            <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-purple-600 text-white px-3 py-2 rounded-full text-sm font-bold whitespace-nowrap animate-pulse border-2 border-white shadow-lg">
              📻 ME PEGA! ⚔️
            </div>
            {/* Elementos do Albion ao redor */}
            <div className="absolute -top-2 -left-2 text-yellow-400 animate-spin text-xl">⚔️</div>
            <div
              className="absolute -top-2 -right-2 text-purple-400 animate-spin text-xl"
              style={{ animationDelay: "0.5s" }}
            >
              🎧
            </div>
            <div
              className="absolute -bottom-2 -left-2 text-pink-400 animate-spin text-xl"
              style={{ animationDelay: "1s" }}
            >
              📻
            </div>
            <div
              className="absolute -bottom-2 -right-2 text-blue-400 animate-spin text-xl"
              style={{ animationDelay: "1.5s" }}
            >
              💜
            </div>
          </div>
        </div>
      )}

      {/* Instruções durante o jogo */}
      {gameStarted && !gameOver && (
        <div className="absolute bottom-4 left-4 right-4 z-10">
          <Card className="p-4 bg-gradient-to-r from-purple-800/90 to-pink-800/90 backdrop-blur-sm text-center border-4 border-purple-400 shadow-lg text-white">
            <p className="text-lg font-bold">📻 SANKT ESTÁ NO AR! PEGUE ELE ANTES QUE VIRE BOSS! ⚔️</p>
            <p className="text-sm mt-1 text-purple-200">Clique rápido no streamer mais épico do Albion! 🎮✨</p>
          </Card>
        </div>
      )}

      {/* Emotes do chat caindo */}
      {score > 0 && gameStarted && (
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/4 text-2xl animate-bounce opacity-60" style={{ animationDelay: "0s" }}>
            💜
          </div>
          <div
            className="absolute top-0 left-3/4 text-2xl animate-bounce opacity-60"
            style={{ animationDelay: "0.5s" }}
          >
            POGGERS
          </div>
          <div className="absolute top-0 left-1/2 text-2xl animate-bounce opacity-60" style={{ animationDelay: "1s" }}>
            ⚔️
          </div>
        </div>
      )}

      {/* Indicador de "LIVE" */}
      <div className="absolute top-20 left-4 bg-red-600 text-white px-3 py-1 rounded-full text-sm font-bold animate-pulse border-2 border-white">
        🔴 AO VIVO
      </div>
    </div>
  )
}
