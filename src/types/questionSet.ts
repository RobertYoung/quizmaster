import { CategoryWithQuestions } from './category'

export interface QuestionSet {
  id: string
  name: string
  description: string
  icon: string
  categories: CategoryWithQuestions[]
}
