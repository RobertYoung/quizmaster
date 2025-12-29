import { useState } from 'react'
import { QuizProvider } from './context/QuizContext'
import { ScoreProvider } from './context/ScoreContext'
import Home from './pages/Home'
import Setup from './pages/Setup'
import Quiz from './pages/Quiz'
import Results from './pages/Results'

type Page = 'home' | 'setup' | 'quiz' | 'results'

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home')

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
          {renderPage()}
        </div>
      </ScoreProvider>
    </QuizProvider>
  )
}

export default App
