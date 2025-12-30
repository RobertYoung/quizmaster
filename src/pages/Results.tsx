import { useEffect } from 'react'
import { motion } from 'framer-motion'
import confetti from 'canvas-confetti'
import { useScore } from '../context/ScoreContext'
import { useQuiz } from '../context/QuizContext'

interface ResultsProps {
  onRestart: () => void
}

export default function Results({ onRestart }: ResultsProps) {
  const { getLeaderboard } = useScore()
  const { dispatch } = useQuiz()
  const leaderboard = getLeaderboard()

  useEffect(() => {
    // Fire confetti from both sides
    const duration = 3000
    const end = Date.now() + duration

    const frame = () => {
      // Left side
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.6 },
        colors: ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6'],
      })
      // Right side
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.6 },
        colors: ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6'],
      })

      if (Date.now() < end) {
        requestAnimationFrame(frame)
      }
    }

    frame()
  }, [])

  const handleRestart = () => {
    dispatch({ type: 'RESET_QUIZ' })
    onRestart()
  }

  const winner = leaderboard[0]

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-2xl text-center"
      >
        <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
          Quiz Complete!
        </h1>

        {winner && (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mb-12"
          >
            <p className="text-2xl text-slate-400 mb-4">Winner</p>
            <div
              className="inline-block px-8 py-4 rounded-xl text-4xl font-bold text-white"
              style={{ backgroundColor: winner.team.color }}
            >
              {winner.team.name}
            </div>
            <p className="text-3xl text-white mt-4">{winner.score} points</p>
          </motion.div>
        )}

        <div className="bg-slate-800 rounded-xl p-6 mb-8">
          <h2 className="text-2xl font-bold text-white mb-6">Final Standings</h2>
          <div className="space-y-4">
            {leaderboard.map((entry, index) => (
              <motion.div
                key={entry.team.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * index }}
                className="flex items-center justify-between bg-slate-700 rounded-lg p-4"
              >
                <div className="flex items-center gap-4">
                  <span className="text-2xl font-bold text-slate-400 w-8">
                    {index + 1}
                  </span>
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: entry.team.color }}
                  />
                  <span className="text-xl text-white">{entry.team.name}</span>
                </div>
                <span className="text-xl font-bold text-emerald-400">
                  {entry.score} pts
                </span>
              </motion.div>
            ))}
          </div>
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleRestart}
          className="bg-emerald-500 hover:bg-emerald-600 text-white text-xl font-bold py-4 px-12 rounded-xl shadow-lg transition-colors"
        >
          Play Again
        </motion.button>
      </motion.div>
    </div>
  )
}
