# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start development server (http://localhost:5173)
npm run build    # TypeScript check + production build
npm run lint     # Run ESLint
npm run preview  # Preview production build
```

## Architecture

Quizmaster is a presentation-style quiz app built with React + TypeScript + Vite. It's designed for a single device displaying questions to a group, with the host controlling navigation.

### Page Flow

`App.tsx` manages page state directly (no router). Flow: Home → Setup → Quiz → Results

### State Management

Two React Context providers wrap the app:

- **QuizContext** (`src/context/QuizContext.tsx`) - Quiz navigation state: current category/question indices, answer reveal state. Uses `useReducer` with actions like `NEXT_QUESTION`, `REVEAL_ANSWER`, `GO_TO_CATEGORY`.

- **ScoreContext** (`src/context/ScoreContext.tsx`) - Team management and scoring. Handles adding teams, awarding points per category, and leaderboard calculation.

### Question Types

Defined in `src/types/question.ts`. Three question types supported:
- `text` - Simple text answer
- `multiple-choice` - Options with correct index highlighted on reveal
- `picture` - Image with text answer

### Question Data

Questions live in `src/data/questions/index.ts` as a `CategoryWithQuestions[]` array. Each category has an id, name, icon, color, and questions array.

### Key Components

- `QuestionCard` - Renders question based on type, handles answer reveal animation
- `HostControls` - Bottom bar with Previous/Reveal/Next buttons and keyboard hint
- `Scoreboard` - Modal overlay showing team rankings
