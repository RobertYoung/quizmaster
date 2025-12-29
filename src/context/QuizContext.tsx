import { createContext, useContext, useReducer, ReactNode } from 'react'
import { CategoryWithQuestions } from '../types'
import { categories as defaultCategories } from '../data/questions'

interface QuizState {
  status: 'setup' | 'playing' | 'finished'
  currentCategoryIndex: number
  currentQuestionIndex: number
  isAnswerRevealed: boolean
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

const initialState: QuizState = {
  status: 'setup',
  currentCategoryIndex: 0,
  currentQuestionIndex: 0,
  isAnswerRevealed: false,
  categories: defaultCategories,
}

function quizReducer(state: QuizState, action: QuizAction): QuizState {
  switch (action.type) {
    case 'START_QUIZ':
      return { ...state, status: 'playing' }

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
      }

    case 'FINISH_QUIZ':
      return { ...state, status: 'finished' }

    case 'RESET_QUIZ':
      return initialState

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
  const [state, dispatch] = useReducer(quizReducer, initialState)

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
