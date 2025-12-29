import { createContext, useContext, useReducer, ReactNode } from 'react'
import { Team, TeamScore } from '../types'

const TEAM_COLORS = [
  '#ef4444', // red
  '#3b82f6', // blue
  '#22c55e', // green
  '#f59e0b', // amber
  '#8b5cf6', // violet
  '#ec4899', // pink
  '#06b6d4', // cyan
  '#f97316', // orange
]

interface ScoreState {
  teams: Team[]
  scores: Record<string, TeamScore>
}

type ScoreAction =
  | { type: 'ADD_TEAM'; payload: { name: string } }
  | { type: 'REMOVE_TEAM'; payload: string }
  | { type: 'UPDATE_SCORE'; payload: { teamId: string; categoryId: string; points: number } }
  | { type: 'RESET_SCORES' }

const initialState: ScoreState = {
  teams: [],
  scores: {},
}

function scoreReducer(state: ScoreState, action: ScoreAction): ScoreState {
  switch (action.type) {
    case 'ADD_TEAM': {
      const id = `team-${Date.now()}`
      const color = TEAM_COLORS[state.teams.length % TEAM_COLORS.length]
      const newTeam: Team = { id, name: action.payload.name, color }
      const newScore: TeamScore = { teamId: id, categoryScores: {}, totalScore: 0 }
      return {
        ...state,
        teams: [...state.teams, newTeam],
        scores: { ...state.scores, [id]: newScore },
      }
    }

    case 'REMOVE_TEAM': {
      const newTeams = state.teams.filter((t) => t.id !== action.payload)
      const { [action.payload]: _, ...newScores } = state.scores
      return { ...state, teams: newTeams, scores: newScores }
    }

    case 'UPDATE_SCORE': {
      const { teamId, categoryId, points } = action.payload
      const currentScore = state.scores[teamId]
      if (!currentScore) return state

      const newCategoryScores = {
        ...currentScore.categoryScores,
        [categoryId]: (currentScore.categoryScores[categoryId] ?? 0) + points,
      }

      const totalScore = Object.values(newCategoryScores).reduce((sum, s) => sum + s, 0)

      return {
        ...state,
        scores: {
          ...state.scores,
          [teamId]: {
            ...currentScore,
            categoryScores: newCategoryScores,
            totalScore,
          },
        },
      }
    }

    case 'RESET_SCORES':
      return initialState

    default:
      return state
  }
}

interface ScoreContextValue {
  state: ScoreState
  dispatch: React.Dispatch<ScoreAction>
  addTeam: (name: string) => void
  removeTeam: (id: string) => void
  awardPoints: (teamId: string, categoryId: string, points: number) => void
  getTeamScore: (teamId: string) => number
  getLeaderboard: () => Array<{ team: Team; score: number }>
}

const ScoreContext = createContext<ScoreContextValue | null>(null)

export function ScoreProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(scoreReducer, initialState)

  const addTeam = (name: string) => dispatch({ type: 'ADD_TEAM', payload: { name } })
  const removeTeam = (id: string) => dispatch({ type: 'REMOVE_TEAM', payload: id })
  const awardPoints = (teamId: string, categoryId: string, points: number) =>
    dispatch({ type: 'UPDATE_SCORE', payload: { teamId, categoryId, points } })

  const getTeamScore = (teamId: string) => state.scores[teamId]?.totalScore ?? 0

  const getLeaderboard = () =>
    state.teams
      .map((team) => ({ team, score: getTeamScore(team.id) }))
      .sort((a, b) => b.score - a.score)

  return (
    <ScoreContext.Provider
      value={{
        state,
        dispatch,
        addTeam,
        removeTeam,
        awardPoints,
        getTeamScore,
        getLeaderboard,
      }}
    >
      {children}
    </ScoreContext.Provider>
  )
}

export function useScore() {
  const context = useContext(ScoreContext)
  if (!context) {
    throw new Error('useScore must be used within a ScoreProvider')
  }
  return context
}
