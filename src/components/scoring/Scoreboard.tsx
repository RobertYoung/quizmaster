import { motion } from 'framer-motion'
import { useScore } from '../../context/ScoreContext'

interface ScoreboardProps {
  onClose: () => void
}

export default function Scoreboard({ onClose }: ScoreboardProps) {
  const { getLeaderboard } = useScore()
  const leaderboard = getLeaderboard()

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-slate-800 rounded-2xl p-8 max-w-lg w-full mx-4 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-bold text-white">Scoreboard</h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white text-2xl transition-colors"
          >
            ✕
          </button>
        </div>

        {leaderboard.length > 0 ? (
          <div className="space-y-3">
            {leaderboard.map((entry, index) => (
              <motion.div
                key={entry.team.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`flex items-center justify-between p-4 rounded-xl ${
                  index === 0 ? 'bg-amber-500/20 ring-2 ring-amber-500' : 'bg-slate-700'
                }`}
              >
                <div className="flex items-center gap-4">
                  <span className={`text-2xl font-bold ${index === 0 ? 'text-amber-400' : 'text-slate-500'}`}>
                    {index + 1}
                  </span>
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: entry.team.color }}
                  />
                  <span className="text-xl text-white font-medium">
                    {entry.team.name}
                  </span>
                </div>
                <span className={`text-2xl font-bold ${index === 0 ? 'text-amber-400' : 'text-emerald-400'}`}>
                  {entry.score}
                </span>
              </motion.div>
            ))}
          </div>
        ) : (
          <p className="text-slate-400 text-center py-8">No scores yet!</p>
        )}

        <p className="text-center text-slate-500 mt-6 text-sm">
          Press S or click outside to close
        </p>
      </motion.div>
    </motion.div>
  )
}
