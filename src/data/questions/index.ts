// Re-export everything from registry
export { questionSets, getQuestionSetById, getDefaultQuestionSet } from './registry'

// Backward compatibility: export categories from default question set
import { getDefaultQuestionSet } from './registry'
export const categories = getDefaultQuestionSet().categories
