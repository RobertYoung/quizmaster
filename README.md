# Quizmaster

A presentation-style quiz web application for hosting pub quiz nights and trivia events. Display questions on a shared screen and control the quiz flow with keyboard shortcuts or on-screen controls.

## Features

- **Presentation Mode** - Host controls the quiz, showing questions one at a time
- **Multiple Categories** - Sports, Music, Movies & TV, and more
- **Team Scoring** - Track scores for multiple teams with a live scoreboard
- **Keyboard Shortcuts** - Space (reveal answer), arrows (navigate), S (scoreboard), F (fullscreen)
- **Answer Animations** - Smooth reveal animations for dramatic effect
- **Responsive Design** - Large typography optimized for group viewing

## Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## Usage

1. **Home** - Click "Start Quiz" to begin
2. **Setup** - Add team names (e.g., "Team A", "The Brainiacs")
3. **Quiz** - Use controls to navigate questions and reveal answers
4. **Results** - View final standings when the quiz ends

### Keyboard Shortcuts

| Key | Action |
|-----|--------|
| Space | Reveal/Hide answer |
| → | Next question |
| ← | Previous question |
| S | Toggle scoreboard |
| F | Toggle fullscreen |

## Adding Questions

Edit `src/data/questions/index.ts` to add your own questions. Each category follows this structure:

```typescript
{
  id: 'category-id',
  name: 'Category Name',
  icon: '🎯',
  color: '#22c55e',
  questions: [
    {
      id: 'q1',
      type: 'text',  // or 'multiple-choice' or 'picture'
      questionText: 'Your question here?',
      answer: 'The answer',
      points: 10,
    },
  ],
}
```

## Tech Stack

- React 18 + TypeScript
- Vite
- Tailwind CSS
- Framer Motion
