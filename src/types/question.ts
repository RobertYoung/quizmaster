export interface BaseQuestion {
  id: string
  categoryId: string
  questionNumber: number
  questionText: string
  answer: string
  points: number
  hint?: string
  funFact?: string
}

export interface TextQuestion extends BaseQuestion {
  type: 'text'
  acceptableAnswers?: string[]
}

export interface MultipleChoiceQuestion extends BaseQuestion {
  type: 'multiple-choice'
  options: string[]
  correctOptionIndex: number
}

export interface PictureQuestion extends BaseQuestion {
  type: 'picture'
  imageUrl: string
  imageAlt?: string
}

export type Question = TextQuestion | MultipleChoiceQuestion | PictureQuestion
