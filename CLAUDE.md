# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
pnpm dev      # Start development server (http://localhost:5173)
pnpm build    # TypeScript check + production build
pnpm lint     # Run ESLint
pnpm preview  # Preview production build
pnpm test     # Run Playwright tests
pnpm test:ui  # Run Playwright tests with interactive UI
```

## Architecture

Quizmaster is a presentation-style quiz app built with React + TypeScript + Vite. It's designed for a single device displaying questions to a group, with the host controlling navigation.

### Page Flow

`App.tsx` manages page state directly (no router). Flow: Home → Setup → Quiz (with section intros between categories) → Results

### State Management

Two React Context providers wrap the app:

- **QuizContext** (`src/context/QuizContext.tsx`) - Quiz navigation state: current category/question indices, answer reveal state, section intro display, and question set selection. Uses `useReducer` with actions like `NEXT_QUESTION`, `REVEAL_ANSWER`, `GO_TO_CATEGORY`, `SELECT_QUESTION_SET`, `DISMISS_SECTION_INTRO`.

- **ScoreContext** (`src/context/ScoreContext.tsx`) - Team management and scoring. Handles adding teams, awarding points per category, and leaderboard calculation.

### Question Types

Defined in `src/types/question.ts`. Three question types supported:
- `text` - Simple text answer
- `multiple-choice` - Options with correct index highlighted on reveal
- `picture` - Image with text answer

### Question Data

Questions are organized into **Question Sets**, each containing categories with questions:

- `src/data/questions/registry.ts` - Central registry of all question sets
- `src/data/questions/sets/` - Individual question set files (e.g., `christmas-2025.ts`, `football-2025.ts`)
- `src/data/questions/index.ts` - Re-exports registry functions and provides backward compatibility

Each `QuestionSet` has: id, name, description, icon, and a `categories` array. Each category has: id, name, description, icon, color, questionCount, and a `questions` array.

### Key Components

- `QuestionCard` - Renders question based on type, handles answer reveal animation
- `HostControls` - Fixed bottom bar with Previous/Reveal/Next buttons and keyboard hint
- `Scoreboard` - Modal overlay showing team rankings
- `SectionIntro` - Category intro page shown before each category's questions
