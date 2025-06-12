"use client"

import type React from "react"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import Image from "next/image"

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
    setScore(0)
    setTimeLeft(30)
    setGameStarted(true)
    setGameOver(false)
    setPosition(generateRandomPosition())
    setShowMessage("")
    setChatMessage("")
  }

  const resetGame = () => {
    setScore(0)
    setTimeLeft(30)
    setGameStarted(false)
    setGameOver(false)
    setPosition({ x: 50, y: 50 })
    setShowMessage("")
    setChatMessage("")
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

  useEffect(() => {
    let timer: NodeJS.Timeout

    if (gameStarted && timeLeft > 0 && !gameOver) {
      timer = setTimeout(() => {
        setTimeLeft((prev) => prev - 1)
      }, 1000)
    } else if (timeLeft === 0) {
      setGameOver(true)
      setGameStarted(false)
    }

    return () => clearTimeout(timer)
  }, [gameStarted, timeLeft, gameOver])

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

      {/* Tela inicial */}
      {!gameStarted && !gameOver && (
        <div className="absolute inset-0 flex items-center justify-center z-20">
          <Card className="p-8 bg-gray-900/95 backdrop-blur-sm text-center max-w-md mx-4 border-4 border-purple-500 shadow-2xl text-white">
            <div className="text-6xl mb-4 animate-bounce">📻</div>
            <h1 className="text-3xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              🎮 CAÇA AO SANKT! 📻
            </h1>
            <p className="text-gray-300 mb-6 text-lg">
              Bem-vindo ao stream mais ÉPICO! 🔴<br />O SANKT está transmitindo a rádio enquanto joga Albion Online!
              Clique nele antes que ele escape para outra dungeon! ⚔️
              <br />
              <span className="text-purple-400 font-bold">30 segundos de pura adrenalina!</span>
            </p>
            <Button
              onClick={startGame}
              size="lg"
              className="w-full text-xl py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 animate-pulse"
            >
              🚀 ENTRAR NO STREAM! 🚀
            </Button>
          </Card>
        </div>
      )}

      {/* Tela de game over */}
      {gameOver && (
        <div className="absolute inset-0 flex items-center justify-center z-20">
          <Card className="p-8 bg-gray-900/95 backdrop-blur-sm text-center max-w-md mx-4 border-4 border-purple-500 shadow-2xl text-white">
            <div className="text-6xl mb-4 animate-spin">🎊</div>
            <h2 className="text-3xl font-bold mb-4">🎉 STREAM FINALIZADA! 🎉</h2>
            <p className="text-xl text-gray-300 mb-2">Seus cliques ÉPICOS:</p>
            <p className="text-5xl font-bold text-purple-400 mb-4 animate-pulse">{score}</p>
            <p className="text-lg text-purple-300 font-bold mb-6 bg-purple-900/50 p-3 rounded-lg border-2 border-purple-400">
              {getScoreComment()}
            </p>
            <div className="space-y-3">
              <Button
                onClick={startGame}
                size="lg"
                className="w-full text-xl py-4 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
              >
                🔄 NOVA STREAM!
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
