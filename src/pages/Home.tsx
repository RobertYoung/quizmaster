import { motion } from 'framer-motion'

interface HomeProps {
  onStart: () => void
}

export default function Home({ onStart }: HomeProps) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center"
      >
        <h1 className="text-6xl md:text-8xl font-bold text-white mb-12">
          Quizmaster
        </h1>
        <p className="text-xl md:text-2xl text-slate-300 mb-12 max-w-2xl">
          Host your quiz night with style. Test your knowledge across sports, music, movies, and more!
        </p>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onStart}
          className="bg-emerald-500 hover:bg-emerald-600 text-white text-2xl font-bold py-4 px-12 rounded-xl shadow-lg transition-colors"
        >
          Start Quiz
        </motion.button>
      </motion.div>
    </div>
  )
}
