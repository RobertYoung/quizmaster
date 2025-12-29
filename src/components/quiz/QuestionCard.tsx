import { motion } from 'framer-motion'
import { Question } from '../../types'

interface QuestionCardProps {
  question: Question
  isAnswerRevealed: boolean
  categoryColor: string
}

export default function QuestionCard({ question, isAnswerRevealed, categoryColor }: QuestionCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="relative"
    >
      {/* Question */}
      <div
        className="rounded-2xl p-8 md:p-12 shadow-2xl"
        style={{
          background: `linear-gradient(135deg, ${categoryColor}dd, ${categoryColor}99)`,
        }}
      >
        <div className="flex items-center gap-4 mb-6">
          <span className="bg-white/20 text-white px-4 py-2 rounded-full text-sm font-semibold">
            {question.points} points
          </span>
          {question.type === 'multiple-choice' && (
            <span className="bg-white/20 text-white px-4 py-2 rounded-full text-sm font-semibold">
              Multiple Choice
            </span>
          )}
          {question.type === 'picture' && (
            <span className="bg-white/20 text-white px-4 py-2 rounded-full text-sm font-semibold">
              Picture Round
            </span>
          )}
        </div>

        <h2 className="text-question font-bold text-white leading-tight mb-8">
          {question.questionText}
        </h2>

        {/* Picture Question Image */}
        {question.type === 'picture' && (
          <div className="mb-8">
            <img
              src={question.imageUrl}
              alt={question.imageAlt || 'Question image'}
              className="max-h-96 mx-auto rounded-xl shadow-lg"
            />
          </div>
        )}

        {/* Multiple Choice Options */}
        {question.type === 'multiple-choice' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            {question.options.map((option, index) => (
              <div
                key={index}
                className={`p-4 rounded-xl text-option font-medium transition-all ${
                  isAnswerRevealed && index === question.correctOptionIndex
                    ? 'bg-emerald-500 text-white ring-4 ring-emerald-300'
                    : 'bg-white/20 text-white'
                }`}
              >
                <span className="font-bold mr-3">
                  {String.fromCharCode(65 + index)}.
                </span>
                {option}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Answer Reveal */}
      <motion.div
        initial={false}
        animate={{
          opacity: isAnswerRevealed ? 1 : 0,
          y: isAnswerRevealed ? 0 : 20,
          scale: isAnswerRevealed ? 1 : 0.9,
        }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        className="mt-6 bg-emerald-500 rounded-xl p-6 md:p-8 shadow-xl"
        style={{ pointerEvents: isAnswerRevealed ? 'auto' : 'none' }}
      >
        <p className="text-emerald-100 text-lg mb-2">Answer</p>
        <p className="text-answer font-bold text-white">{question.answer}</p>
        {question.funFact && (
          <p className="text-emerald-100 mt-4 text-lg">
            Fun fact: {question.funFact}
          </p>
        )}
        {question.sourceUrl && (
          <a
            href={question.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block mt-4 text-emerald-200 hover:text-white text-sm underline underline-offset-2 transition-colors"
          >
            Source ↗
          </a>
        )}
      </motion.div>
    </motion.div>
  )
}
