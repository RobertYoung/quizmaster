import { QuestionSet } from '../../types'
import { christmas2025 } from './sets/christmas-2025'
import { football2025 } from './sets/football-2025'

export const questionSets: QuestionSet[] = [
  christmas2025,
  football2025,
]

export function getQuestionSetById(id: string): QuestionSet | undefined {
  return questionSets.find(set => set.id === id)
}

export function getDefaultQuestionSet(): QuestionSet {
  return questionSets[0]
}
