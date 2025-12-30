import { createContext, useContext, useReducer, useEffect, ReactNode } from 'react'
import { CategoryWithQuestions } from '../types'
import { getQuestionSetById, getDefaultQuestionSet } from '../data/questions'

const STORAGE_KEY = 'quizmaster-quiz-state'

interface QuizState {
  status: 'setup' | 'playing' | 'finished'
  currentCategoryIndex: number
  currentQuestionIndex: number
  isAnswerRevealed: boolean
  showingSectionIntro: boolean
  questionSetId: string
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
  | { type: 'SELECT_QUESTION_SET'; payload: string }

const defaultQuestionSet = getDefaultQuestionSet()

const initialState: QuizState = {
  status: 'setup',
  currentCategoryIndex: 0,
  currentQuestionIndex: 0,
  isAnswerRevealed: false,
  showingSectionIntro: false,
  questionSetId: defaultQuestionSet.id,
  categories: defaultQuestionSet.categories,
}

function getInitialState(): QuizState {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      const parsed = JSON.parse(saved)

      // Load question set (fall back to default if not found)
      const questionSetId = parsed.questionSetId ?? defaultQuestionSet.id
      const questionSet = getQuestionSetById(questionSetId) ?? defaultQuestionSet
      const categories = questionSet.categories

      // Validate indices are within bounds
      const maxCategoryIndex = categories.length - 1
      const categoryIndex = Math.min(parsed.currentCategoryIndex ?? 0, maxCategoryIndex)
      const maxQuestionIndex = categories[categoryIndex].questions.length - 1
      const questionIndex = Math.min(parsed.currentQuestionIndex ?? 0, maxQuestionIndex)

      return {
        status: parsed.status ?? 'setup',
        currentCategoryIndex: categoryIndex,
        currentQuestionIndex: questionIndex,
        isAnswerRevealed: parsed.isAnswerRevealed ?? false,
        showingSectionIntro: parsed.showingSectionIntro ?? false,
        questionSetId: questionSet.id,
        categories,
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
      // Handle going back from section intro
      if (state.showingSectionIntro) {
        if (state.currentCategoryIndex > 0) {
          const prevCategory = state.categories[state.currentCategoryIndex - 1]
          return {
            ...state,
            currentCategoryIndex: state.currentCategoryIndex - 1,
            currentQuestionIndex: prevCategory.questions.length - 1,
            isAnswerRevealed: false,
            showingSectionIntro: false,
          }
        }
        // On first category's intro, can't go back further
        return state
      }

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
      return {
        ...initialState,
        questionSetId: state.questionSetId,
        categories: state.categories,
      }

    case 'RESTORE_STATE':
      return {
        ...state,
        ...action.payload,
        categories: state.categories, // Always use current categories
      }

    case 'SELECT_QUESTION_SET': {
      const questionSet = getQuestionSetById(action.payload)
      if (!questionSet) return state

      return {
        ...initialState,
        questionSetId: questionSet.id,
        categories: questionSet.categories,
      }
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
  selectQuestionSet: (id: string) => void
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
      questionSetId: state.questionSetId,
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave))
  }, [state.status, state.currentCategoryIndex, state.currentQuestionIndex, state.isAnswerRevealed, state.showingSectionIntro, state.questionSetId])

  const currentCategory = state.categories[state.currentCategoryIndex] ?? null
  const currentQuestion = currentCategory?.questions[state.currentQuestionIndex] ?? null

  const totalQuestions = state.categories.reduce((sum, cat) => sum + cat.questions.length, 0)

  let currentQuestionNumber = 0
  for (let i = 0; i < state.currentCategoryIndex; i++) {
    currentQuestionNumber += state.categories[i].questions.length
  }
  currentQuestionNumber += state.currentQuestionIndex + 1

  const selectQuestionSet = (id: string) => {
    dispatch({ type: 'SELECT_QUESTION_SET', payload: id })
  }

  return (
    <QuizContext.Provider
      value={{
        state,
        dispatch,
        currentCategory,
        currentQuestion,
        totalQuestions,
        currentQuestionNumber,
        selectQuestionSet,
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
