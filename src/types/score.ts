export interface Team {
  id: string
  name: string
  color: string
}

export interface TeamScore {
  teamId: string
  categoryScores: Record<string, number>
  totalScore: number
}

export interface QuizScores {
  teams: Team[]
  scores: Record<string, TeamScore>
}
