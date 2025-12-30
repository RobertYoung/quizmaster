import { motion } from 'framer-motion'
import { CategoryWithQuestions } from '../../types'

interface SectionIntroProps {
  category: CategoryWithQuestions
  onStart: () => void
  onShowScoreboard: () => void
  onPrevious?: () => void
  canGoPrevious?: boolean
}

export default function SectionIntro({ category, onStart, onShowScoreboard, onPrevious, canGoPrevious = false }: SectionIntroProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="flex flex-col items-center justify-center text-center px-8"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, type: 'spring', stiffness: 200, damping: 15 }}
        className="text-8xl md:text-9xl mb-8"
      >
        {category.icon}
      </motion.div>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="text-slate-400 text-lg uppercase tracking-widest mb-4"
      >
        Coming Up
      </motion.p>

      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="text-4xl md:text-6xl font-bold text-white mb-4"
      >
        {category.name}
      </motion.h1>

      {category.description && (
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-slate-300 text-xl md:text-2xl max-w-2xl mb-6"
        >
          {category.description}
        </motion.p>
      )}

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="text-slate-400 text-lg mb-8"
      >
        {category.questionCount} questions
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="flex gap-4"
      >
        {canGoPrevious && onPrevious && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onPrevious}
            className="px-8 py-4 text-xl font-semibold text-white rounded-xl bg-slate-700 hover:bg-slate-600 transition-colors"
          >
            ← Previous
          </motion.button>
        )}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onShowScoreboard}
          className="px-8 py-4 text-xl font-semibold text-white rounded-xl bg-slate-700 hover:bg-slate-600 transition-colors"
        >
          Leaderboard (S)
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onStart}
          className="px-8 py-4 text-xl font-semibold text-white rounded-xl transition-colors"
          style={{ backgroundColor: category.color }}
        >
          Start Section
        </motion.button>
      </motion.div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="text-slate-500 text-sm mt-6"
      >
        Press Space or Enter to continue{canGoPrevious ? ' • ← to go back' : ''}
      </motion.p>
    </motion.div>
  )
}
