import { Question } from './question'

export interface Category {
  id: string
  name: string
  description?: string
  icon: string
  color: string
  questionCount: number
}

export interface CategoryWithQuestions extends Category {
  questions: Question[]
}
