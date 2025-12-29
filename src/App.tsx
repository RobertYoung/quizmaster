import { useState, useEffect } from 'react'
import { QuizProvider } from './context/QuizContext'
import { ScoreProvider } from './context/ScoreContext'
import Home from './pages/Home'
import Setup from './pages/Setup'
import Quiz from './pages/Quiz'
import Results from './pages/Results'
import SettingsMenu from './components/settings/SettingsMenu'

type Page = 'home' | 'setup' | 'quiz' | 'results'

const STORAGE_KEY = 'quizmaster-page-state'
const VALID_PAGES: Page[] = ['home', 'setup', 'quiz', 'results']

function getInitialPage(): Page {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved && VALID_PAGES.includes(saved as Page)) {
      return saved as Page
    }
  } catch {
    // localStorage not available
  }
  return 'home'
}

function App() {
  const [currentPage, setCurrentPage] = useState<Page>(getInitialPage)

  // Save page state to localStorage on changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, currentPage)
  }, [currentPage])

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <Home onStart={() => setCurrentPage('setup')} />
      case 'setup':
        return <Setup onStartQuiz={() => setCurrentPage('quiz')} onBack={() => setCurrentPage('home')} />
      case 'quiz':
        return <Quiz onFinish={() => setCurrentPage('results')} />
      case 'results':
        return <Results onRestart={() => setCurrentPage('home')} />
      default:
        return <Home onStart={() => setCurrentPage('setup')} />
    }
  }

  return (
    <QuizProvider>
      <ScoreProvider>
        <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800">
          <SettingsMenu onResetGame={() => setCurrentPage('home')} />
          {renderPage()}
        </div>
      </ScoreProvider>
    </QuizProvider>
  )
}

export default App
