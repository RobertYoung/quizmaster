import { createContext, useContext, useReducer, useEffect, ReactNode } from 'react'
import { Team, TeamScore } from '../types'

const STORAGE_KEY = 'quizmaster-score-state'

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

interface QuestionAward {
  teamId: string
  points: number
}

interface ScoreState {
  teams: Team[]
  scores: Record<string, TeamScore>
  questionAwards: Record<string, QuestionAward[]> // questionId → awards
}

type ScoreAction =
  | { type: 'ADD_TEAM'; payload: { name: string } }
  | { type: 'REMOVE_TEAM'; payload: string }
  | { type: 'UPDATE_SCORE'; payload: { teamId: string; categoryId: string; points: number } }
  | { type: 'TOGGLE_QUESTION_AWARD'; payload: { teamId: string; questionId: string; categoryId: string; points: number } }
  | { type: 'RESET_SCORES' }
  | { type: 'RESTORE_STATE'; payload: ScoreState }

const initialState: ScoreState = {
  teams: [],
  scores: {},
  questionAwards: {},
}

function getInitialState(): ScoreState {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      const parsed = JSON.parse(saved)
      if (Array.isArray(parsed.teams) && typeof parsed.scores === 'object') {
        return {
          teams: parsed.teams,
          scores: parsed.scores,
          questionAwards: parsed.questionAwards ?? {},
        }
      }
    }
  } catch {
    localStorage.removeItem(STORAGE_KEY)
  }
  return initialState
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

    case 'TOGGLE_QUESTION_AWARD': {
      const { teamId, questionId, categoryId, points } = action.payload
      const currentScore = state.scores[teamId]
      if (!currentScore) return state

      const currentAwards = state.questionAwards[questionId] ?? []
      const existingAwardIndex = currentAwards.findIndex((a) => a.teamId === teamId)
      const isRevoking = existingAwardIndex !== -1

      // Update question awards
      const newAwards = isRevoking
        ? currentAwards.filter((a) => a.teamId !== teamId)
        : [...currentAwards, { teamId, points }]

      // Update category score (add or subtract)
      const pointsDelta = isRevoking ? -currentAwards[existingAwardIndex].points : points
      const newCategoryScores = {
        ...currentScore.categoryScores,
        [categoryId]: (currentScore.categoryScores[categoryId] ?? 0) + pointsDelta,
      }
      const totalScore = Object.values(newCategoryScores).reduce((sum, s) => sum + s, 0)

      return {
        ...state,
        questionAwards: {
          ...state.questionAwards,
          [questionId]: newAwards,
        },
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
      localStorage.removeItem(STORAGE_KEY)
      return initialState

    case 'RESTORE_STATE':
      return action.payload

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
  toggleQuestionAward: (teamId: string, questionId: string, categoryId: string, points: number) => void
  getQuestionAwards: (questionId: string) => QuestionAward[]
  getTeamScore: (teamId: string) => number
  getLeaderboard: () => Array<{ team: Team; score: number }>
}

const ScoreContext = createContext<ScoreContextValue | null>(null)

export function ScoreProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(scoreReducer, null, getInitialState)

  // Save state to localStorage on changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  }, [state])

  const addTeam = (name: string) => dispatch({ type: 'ADD_TEAM', payload: { name } })
  const removeTeam = (id: string) => dispatch({ type: 'REMOVE_TEAM', payload: id })
  const awardPoints = (teamId: string, categoryId: string, points: number) =>
    dispatch({ type: 'UPDATE_SCORE', payload: { teamId, categoryId, points } })
  const toggleQuestionAward = (teamId: string, questionId: string, categoryId: string, points: number) =>
    dispatch({ type: 'TOGGLE_QUESTION_AWARD', payload: { teamId, questionId, categoryId, points } })
  const getQuestionAwards = (questionId: string) => state.questionAwards[questionId] ?? []

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
        toggleQuestionAward,
        getQuestionAwards,
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
