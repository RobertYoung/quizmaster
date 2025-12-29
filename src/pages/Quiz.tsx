import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useQuiz } from '../context/QuizContext'
import { useScore } from '../context/ScoreContext'
import QuestionCard from '../components/quiz/QuestionCard'
import HostControls from '../components/navigation/HostControls'
import Scoreboard from '../components/scoring/Scoreboard'

interface QuizProps {
  onFinish: () => void
}

export default function Quiz({ onFinish }: QuizProps) {
  const { state, dispatch, currentCategory, currentQuestion, totalQuestions, currentQuestionNumber } = useQuiz()
  const { state: scoreState, toggleQuestionAward, getQuestionAwards } = useScore()
  const [showScoreboard, setShowScoreboard] = useState(false)

  useEffect(() => {
    if (state.status === 'setup') {
      dispatch({ type: 'START_QUIZ' })
    }
  }, [state.status, dispatch])

  useEffect(() => {
    if (state.status === 'finished') {
      onFinish()
    }
  }, [state.status, onFinish])

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement) return

      switch (e.key) {
        case ' ':
          e.preventDefault()
          if (state.isAnswerRevealed) {
            dispatch({ type: 'HIDE_ANSWER' })
          } else {
            dispatch({ type: 'REVEAL_ANSWER' })
          }
          break
        case 'ArrowRight':
          dispatch({ type: 'NEXT_QUESTION' })
          break
        case 'ArrowLeft':
          dispatch({ type: 'PREVIOUS_QUESTION' })
          break
        case 's':
          setShowScoreboard((prev) => !prev)
          break
        case 'f':
          if (document.fullscreenElement) {
            document.exitFullscreen()
          } else {
            document.documentElement.requestFullscreen()
          }
          break
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [state.isAnswerRevealed, dispatch])

  const handleTogglePoints = (teamId: string) => {
    if (currentCategory && currentQuestion) {
      toggleQuestionAward(teamId, currentQuestion.id, currentCategory.id, currentQuestion.points)
    }
  }

  const questionAwards = currentQuestion ? getQuestionAwards(currentQuestion.id) : []
  const awardedTeamIds = new Set(questionAwards.map((a) => a.teamId))

  if (!currentCategory || !currentQuestion) {
    return null
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-slate-800/50 backdrop-blur-sm border-b border-slate-700 p-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="text-3xl">{currentCategory.icon}</span>
            <div>
              <h2 className="text-xl font-bold text-white">{currentCategory.name}</h2>
              <p className="text-sm text-slate-400">
                Question {currentQuestionNumber} of {totalQuestions}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowScoreboard((prev) => !prev)}
              className="bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Scoreboard (S)
            </button>
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: currentCategory.color }}
            />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-5xl">
          <AnimatePresence mode="wait">
            <QuestionCard
              key={currentQuestion.id}
              question={currentQuestion}
              isAnswerRevealed={state.isAnswerRevealed}
              categoryColor={currentCategory.color}
            />
          </AnimatePresence>

          {/* Inline Team Scoring */}
          {state.isAnswerRevealed && scoreState.teams.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 flex flex-wrap justify-center gap-3"
            >
              <span className="w-full text-center text-slate-400 text-sm mb-2">
                Award {currentQuestion.points} points:
              </span>
              {scoreState.teams.map((team) => {
                const isAwarded = awardedTeamIds.has(team.id)
                return (
                  <button
                    key={team.id}
                    onClick={() => handleTogglePoints(team.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                      isAwarded
                        ? 'bg-green-600 hover:bg-green-700 ring-2 ring-green-400'
                        : 'bg-slate-700 hover:bg-slate-600'
                    }`}
                  >
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: team.color }}
                    />
                    <span className="text-white font-medium">{team.name}</span>
                    {isAwarded && (
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </button>
                )
              })}
            </motion.div>
          )}
        </div>
      </main>

      {/* Host Controls */}
      <HostControls
        onReveal={() => dispatch({ type: 'REVEAL_ANSWER' })}
        onHide={() => dispatch({ type: 'HIDE_ANSWER' })}
        onNext={() => dispatch({ type: 'NEXT_QUESTION' })}
        onPrevious={() => dispatch({ type: 'PREVIOUS_QUESTION' })}
        isAnswerRevealed={state.isAnswerRevealed}
        canGoPrevious={currentQuestionNumber > 1}
        canGoNext={true}
      />

      {/* Scoreboard Overlay */}
      <AnimatePresence>
        {showScoreboard && (
          <Scoreboard onClose={() => setShowScoreboard(false)} />
        )}
      </AnimatePresence>
    </div>
  )
}
