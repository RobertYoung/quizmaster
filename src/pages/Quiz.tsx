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
  const { state: scoreState, awardPoints } = useScore()
  const [showScoreboard, setShowScoreboard] = useState(false)
  const [scoringTeamId, setScoringTeamId] = useState<string | null>(null)

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

  const handleAwardPoints = (teamId: string) => {
    if (currentCategory && currentQuestion) {
      awardPoints(teamId, currentCategory.id, currentQuestion.points)
      setScoringTeamId(null)
    }
  }

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
        </div>
      </main>

      {/* Host Controls */}
      <HostControls
        onReveal={() => dispatch({ type: 'REVEAL_ANSWER' })}
        onHide={() => dispatch({ type: 'HIDE_ANSWER' })}
        onNext={() => dispatch({ type: 'NEXT_QUESTION' })}
        onPrevious={() => dispatch({ type: 'PREVIOUS_QUESTION' })}
        onAwardPoints={() => setScoringTeamId('selecting')}
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

      {/* Award Points Modal */}
      <AnimatePresence>
        {scoringTeamId === 'selecting' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
            onClick={() => setScoringTeamId(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-slate-800 rounded-xl p-6 max-w-md w-full mx-4"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-xl font-bold text-white mb-4">
                Award {currentQuestion.points} points to:
              </h3>
              <div className="space-y-2">
                {scoreState.teams.map((team) => (
                  <button
                    key={team.id}
                    onClick={() => handleAwardPoints(team.id)}
                    className="w-full flex items-center gap-3 p-4 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors"
                  >
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: team.color }}
                    />
                    <span className="text-white font-medium">{team.name}</span>
                  </button>
                ))}
              </div>
              <button
                onClick={() => setScoringTeamId(null)}
                className="w-full mt-4 p-3 text-slate-400 hover:text-white transition-colors"
              >
                Cancel
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
