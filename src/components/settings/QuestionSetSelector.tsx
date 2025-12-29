import { motion, AnimatePresence } from 'framer-motion'
import { QuestionSet } from '../../types'
import { questionSets } from '../../data/questions'

interface QuestionSetSelectorProps {
  isOpen: boolean
  onClose: () => void
  currentSetId: string
  onSelect: (id: string) => void
}

export default function QuestionSetSelector({
  isOpen,
  onClose,
  currentSetId,
  onSelect,
}: QuestionSetSelectorProps) {
  const handleSelect = (set: QuestionSet) => {
    if (set.id !== currentSetId) {
      onSelect(set.id)
    }
    onClose()
  }

  const getTotalQuestions = (set: QuestionSet) => {
    return set.categories.reduce((sum, cat) => sum + cat.questions.length, 0)
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-slate-800 rounded-2xl p-6 max-w-lg w-full shadow-2xl max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-2xl font-bold text-white mb-2">Choose Question Set</h2>
            <p className="text-slate-400 mb-6">Select a question set for your quiz</p>

            <div className="space-y-3">
              {questionSets.map((set) => {
                const isSelected = set.id === currentSetId
                const totalQuestions = getTotalQuestions(set)

                return (
                  <button
                    key={set.id}
                    onClick={() => handleSelect(set)}
                    className={`w-full text-left p-4 rounded-xl transition-all ${
                      isSelected
                        ? 'bg-emerald-600/20 border-2 border-emerald-500'
                        : 'bg-slate-700/50 border-2 border-transparent hover:bg-slate-700 hover:border-slate-600'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <span className="text-3xl">{set.icon}</span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-white truncate">{set.name}</h3>
                          {isSelected && (
                            <span className="text-xs bg-emerald-500 text-white px-2 py-0.5 rounded-full">
                              Selected
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-slate-400 mt-1">{set.description}</p>
                        <div className="flex gap-4 mt-2 text-xs text-slate-500">
                          <span>{set.categories.length} categories</span>
                          <span>{totalQuestions} questions</span>
                        </div>
                      </div>
                    </div>
                  </button>
                )
              })}
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-lg bg-slate-700 text-white hover:bg-slate-600 transition-colors"
              >
                Close
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
