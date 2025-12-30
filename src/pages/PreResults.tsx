import { useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { useQuiz } from '../context/QuizContext'
import { useScore } from '../context/ScoreContext'

interface PreResultsProps {
  onRevealResults: () => void
}

export default function PreResults({ onRevealResults }: PreResultsProps) {
  const { state } = useQuiz()
  const { getLeaderboard } = useScore()
  const leaderboard = getLeaderboard()
  const totalQuestions = state.categories.reduce((sum, cat) => sum + cat.questions.length, 0)

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault()
        onRevealResults()
      }
    },
    [onRevealResults]
  )

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="w-full max-w-2xl text-center"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 200, damping: 15 }}
          className="text-8xl md:text-9xl mb-8"
        >
          🎉
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-slate-400 text-lg uppercase tracking-widest mb-4"
        >
          That&apos;s a wrap!
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-4xl md:text-6xl font-bold text-white mb-4"
        >
          Quiz Complete
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-slate-300 text-xl md:text-2xl max-w-2xl mb-8"
        >
          {totalQuestions} questions answered by {leaderboard.length} team
          {leaderboard.length !== 1 ? 's' : ''}
        </motion.p>

        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onRevealResults}
          className="bg-emerald-500 hover:bg-emerald-600 text-white text-xl font-bold py-4 px-12 rounded-xl shadow-lg transition-colors"
        >
          Reveal Scores
        </motion.button>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="text-slate-500 text-sm mt-6"
        >
          Press Space or Enter to reveal scores
        </motion.p>
      </motion.div>
    </div>
  )
}
