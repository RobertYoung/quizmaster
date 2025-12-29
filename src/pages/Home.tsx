import { useState } from 'react'
import { motion } from 'framer-motion'
import { useQuiz } from '../context/QuizContext'
import { getQuestionSetById } from '../data/questions'
import QuestionSetSelector from '../components/settings/QuestionSetSelector'

interface HomeProps {
  onStart: () => void
}

export default function Home({ onStart }: HomeProps) {
  const { state, selectQuestionSet } = useQuiz()
  const [showSelector, setShowSelector] = useState(false)

  const currentSet = getQuestionSetById(state.questionSetId)
  const totalQuestions = currentSet?.categories.reduce(
    (sum, cat) => sum + cat.questions.length,
    0
  ) ?? 0

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center"
      >
        <h1 className="text-6xl md:text-8xl font-bold text-white mb-8">
          Quizmaster
        </h1>

        {/* Question Set Card */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setShowSelector(true)}
          className="bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 rounded-xl p-4 mb-8 w-full max-w-md mx-auto text-left transition-colors"
        >
          <div className="flex items-center gap-3">
            <span className="text-4xl">{currentSet?.icon}</span>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-white truncate">{currentSet?.name}</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-slate-400"
                >
                  <path d="m6 9 6 6 6-6" />
                </svg>
              </div>
              <p className="text-sm text-slate-400">
                {currentSet?.categories.length} categories, {totalQuestions} questions
              </p>
            </div>
          </div>
        </motion.button>

        <p className="text-xl md:text-2xl text-slate-300 mb-12 max-w-2xl">
          Host your quiz night with style. Test your knowledge across sports, music, movies, and more!
        </p>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onStart}
          className="bg-emerald-500 hover:bg-emerald-600 text-white text-2xl font-bold py-4 px-12 rounded-xl shadow-lg transition-colors"
        >
          Start Quiz
        </motion.button>
      </motion.div>

      <QuestionSetSelector
        isOpen={showSelector}
        onClose={() => setShowSelector(false)}
        currentSetId={state.questionSetId}
        onSelect={selectQuestionSet}
      />
    </div>
  )
}
