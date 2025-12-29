import { createContext, useContext, useReducer, useEffect, ReactNode } from 'react'
import { CategoryWithQuestions } from '../types'
import { categories as defaultCategories } from '../data/questions'

const STORAGE_KEY = 'quizmaster-quiz-state'

interface QuizState {
  status: 'setup' | 'playing' | 'finished'
  currentCategoryIndex: number
  currentQuestionIndex: number
  isAnswerRevealed: boolean
  showingSectionIntro: boolean
  categories: CategoryWithQuestions[]
}

type QuizAction =
  | { type: 'START_QUIZ' }
  | { type: 'NEXT_QUESTION' }
  | { type: 'PREVIOUS_QUESTION' }
  | { type: 'REVEAL_ANSWER' }
  | { type: 'HIDE_ANSWER' }
  | { type: 'GO_TO_CATEGORY'; payload: number }
  | { type: 'FINISH_QUIZ' }
  | { type: 'RESET_QUIZ' }
  | { type: 'RESTORE_STATE'; payload: Partial<QuizState> }
  | { type: 'DISMISS_SECTION_INTRO' }

const initialState: QuizState = {
  status: 'setup',
  currentCategoryIndex: 0,
  currentQuestionIndex: 0,
  isAnswerRevealed: false,
  showingSectionIntro: false,
  categories: defaultCategories,
}

function getInitialState(): QuizState {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      const parsed = JSON.parse(saved)
      // Validate indices are within bounds
      const maxCategoryIndex = defaultCategories.length - 1
      const categoryIndex = Math.min(parsed.currentCategoryIndex ?? 0, maxCategoryIndex)
      const maxQuestionIndex = defaultCategories[categoryIndex].questions.length - 1
      const questionIndex = Math.min(parsed.currentQuestionIndex ?? 0, maxQuestionIndex)

      return {
        status: parsed.status ?? 'setup',
        currentCategoryIndex: categoryIndex,
        currentQuestionIndex: questionIndex,
        isAnswerRevealed: parsed.isAnswerRevealed ?? false,
        showingSectionIntro: parsed.showingSectionIntro ?? false,
        categories: defaultCategories,
      }
    }
  } catch {
    localStorage.removeItem(STORAGE_KEY)
  }
  return initialState
}

function quizReducer(state: QuizState, action: QuizAction): QuizState {
  switch (action.type) {
    case 'START_QUIZ':
      return { ...state, status: 'playing', showingSectionIntro: true }

    case 'NEXT_QUESTION': {
      const currentCategory = state.categories[state.currentCategoryIndex]
      const isLastQuestionInCategory = state.currentQuestionIndex >= currentCategory.questions.length - 1
      const isLastCategory = state.currentCategoryIndex >= state.categories.length - 1

      if (isLastQuestionInCategory && isLastCategory) {
        return { ...state, status: 'finished', isAnswerRevealed: false }
      }

      if (isLastQuestionInCategory) {
        return {
          ...state,
          currentCategoryIndex: state.currentCategoryIndex + 1,
          currentQuestionIndex: 0,
          isAnswerRevealed: false,
          showingSectionIntro: true,
        }
      }

      return {
        ...state,
        currentQuestionIndex: state.currentQuestionIndex + 1,
        isAnswerRevealed: false,
      }
    }

    case 'PREVIOUS_QUESTION': {
      if (state.currentQuestionIndex > 0) {
        return {
          ...state,
          currentQuestionIndex: state.currentQuestionIndex - 1,
          isAnswerRevealed: false,
        }
      }

      if (state.currentCategoryIndex > 0) {
        const prevCategory = state.categories[state.currentCategoryIndex - 1]
        return {
          ...state,
          currentCategoryIndex: state.currentCategoryIndex - 1,
          currentQuestionIndex: prevCategory.questions.length - 1,
          isAnswerRevealed: false,
          showingSectionIntro: true,
        }
      }

      return state
    }

    case 'REVEAL_ANSWER':
      return { ...state, isAnswerRevealed: true }

    case 'HIDE_ANSWER':
      return { ...state, isAnswerRevealed: false }

    case 'GO_TO_CATEGORY':
      return {
        ...state,
        currentCategoryIndex: action.payload,
        currentQuestionIndex: 0,
        isAnswerRevealed: false,
        showingSectionIntro: true,
      }

    case 'FINISH_QUIZ':
      return { ...state, status: 'finished' }

    case 'DISMISS_SECTION_INTRO':
      return { ...state, showingSectionIntro: false }

    case 'RESET_QUIZ':
      localStorage.removeItem(STORAGE_KEY)
      return initialState

    case 'RESTORE_STATE':
      return {
        ...state,
        ...action.payload,
        categories: defaultCategories, // Always use current categories
      }

    default:
      return state
  }
}

interface QuizContextValue {
  state: QuizState
  dispatch: React.Dispatch<QuizAction>
  currentCategory: CategoryWithQuestions | null
  currentQuestion: CategoryWithQuestions['questions'][number] | null
  totalQuestions: number
  currentQuestionNumber: number
}

const QuizContext = createContext<QuizContextValue | null>(null)

export function QuizProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(quizReducer, null, getInitialState)

  // Save state to localStorage on changes
  useEffect(() => {
    const toSave = {
      status: state.status,
      currentCategoryIndex: state.currentCategoryIndex,
      currentQuestionIndex: state.currentQuestionIndex,
      isAnswerRevealed: state.isAnswerRevealed,
      showingSectionIntro: state.showingSectionIntro,
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave))
  }, [state.status, state.currentCategoryIndex, state.currentQuestionIndex, state.isAnswerRevealed, state.showingSectionIntro])

  const currentCategory = state.categories[state.currentCategoryIndex] ?? null
  const currentQuestion = currentCategory?.questions[state.currentQuestionIndex] ?? null

  const totalQuestions = state.categories.reduce((sum, cat) => sum + cat.questions.length, 0)

  let currentQuestionNumber = 0
  for (let i = 0; i < state.currentCategoryIndex; i++) {
    currentQuestionNumber += state.categories[i].questions.length
  }
  currentQuestionNumber += state.currentQuestionIndex + 1

  return (
    <QuizContext.Provider
      value={{
        state,
        dispatch,
        currentCategory,
        currentQuestion,
        totalQuestions,
        currentQuestionNumber,
      }}
    >
      {children}
    </QuizContext.Provider>
  )
}

export function useQuiz() {
  const context = useContext(QuizContext)
  if (!context) {
    throw new Error('useQuiz must be used within a QuizProvider')
  }
  return context
}
