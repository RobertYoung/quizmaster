import { QuestionSet } from '../../types'
import { christmas2025 } from './sets/christmas-2025'
import { endOfYear2025 } from './sets/end-of-year-2025'
import { exampleQuiz } from './sets/example-quiz'
import { football2025 } from './sets/football-2025'

export const questionSets: QuestionSet[] = [
  exampleQuiz,
  endOfYear2025,
  christmas2025,
  football2025,
]

export function getQuestionSetById(id: string): QuestionSet | undefined {
  return questionSets.find(set => set.id === id)
}

export function getDefaultQuestionSet(): QuestionSet {
  return questionSets[0]
}
