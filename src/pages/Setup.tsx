import { useState } from 'react'
import { motion } from 'framer-motion'
import { useScore } from '../context/ScoreContext'

interface SetupProps {
  onStartQuiz: () => void
  onBack: () => void
}

export default function Setup({ onStartQuiz, onBack }: SetupProps) {
  const { state, addTeam, removeTeam } = useScore()
  const [teamName, setTeamName] = useState('')

  const handleAddTeam = () => {
    if (teamName.trim()) {
      addTeam(teamName.trim())
      setTeamName('')
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAddTeam()
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-2xl"
      >
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-2 text-center">
          Team Setup
        </h1>
        <p className="text-slate-400 text-center mb-8">
          Add teams or players to track scores
        </p>

        <div className="bg-slate-800 rounded-xl p-6 mb-6">
          <div className="flex gap-4 mb-6">
            <input
              type="text"
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Enter team name..."
              className="flex-1 bg-slate-700 text-white px-4 py-3 rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            <button
              onClick={handleAddTeam}
              disabled={!teamName.trim()}
              className="bg-emerald-500 hover:bg-emerald-600 disabled:bg-slate-600 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              Add
            </button>
          </div>

          {state.teams.length > 0 ? (
            <div className="space-y-3">
              {state.teams.map((team, index) => (
                <motion.div
                  key={team.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center justify-between bg-slate-700 rounded-lg p-4"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: team.color }}
                    />
                    <span className="text-white text-lg">{team.name}</span>
                  </div>
                  <button
                    onClick={() => removeTeam(team.id)}
                    className="text-slate-400 hover:text-red-400 transition-colors"
                  >
                    Remove
                  </button>
                </motion.div>
              ))}
            </div>
          ) : (
            <p className="text-slate-500 text-center py-8">
              No teams added yet. Add at least one team to begin!
            </p>
          )}
        </div>

        <div className="flex gap-4 justify-center">
          <button
            onClick={onBack}
            className="bg-slate-700 hover:bg-slate-600 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
          >
            Back
          </button>
          <button
            onClick={onStartQuiz}
            disabled={state.teams.length === 0}
            className="bg-emerald-500 hover:bg-emerald-600 disabled:bg-slate-600 disabled:cursor-not-allowed text-white px-8 py-3 rounded-lg font-semibold transition-colors"
          >
            Start Quiz
          </button>
        </div>
      </motion.div>
    </div>
  )
}
