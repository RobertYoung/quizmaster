interface HostControlsProps {
  onReveal: () => void
  onHide: () => void
  onNext: () => void
  onPrevious: () => void
  onAwardPoints: () => void
  isAnswerRevealed: boolean
  canGoPrevious: boolean
  canGoNext: boolean
}

export default function HostControls({
  onReveal,
  onHide,
  onNext,
  onPrevious,
  onAwardPoints,
  isAnswerRevealed,
  canGoPrevious,
}: HostControlsProps) {
  return (
    <footer className="bg-slate-800/80 backdrop-blur-sm border-t border-slate-700 p-4">
      <div className="max-w-4xl mx-auto flex items-center justify-between">
        {/* Previous Button */}
        <button
          onClick={onPrevious}
          disabled={!canGoPrevious}
          className="flex items-center gap-2 bg-slate-700 hover:bg-slate-600 disabled:bg-slate-800 disabled:text-slate-600 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg font-semibold transition-colors"
        >
          <span>←</span>
          <span className="hidden sm:inline">Previous</span>
        </button>

        {/* Center Controls */}
        <div className="flex items-center gap-4">
          <button
            onClick={isAnswerRevealed ? onHide : onReveal}
            className={`px-8 py-3 rounded-lg font-bold text-lg transition-colors ${
              isAnswerRevealed
                ? 'bg-amber-500 hover:bg-amber-600 text-white'
                : 'bg-emerald-500 hover:bg-emerald-600 text-white'
            }`}
          >
            {isAnswerRevealed ? 'Hide Answer' : 'Reveal Answer'}
            <span className="ml-2 text-sm opacity-75">(Space)</span>
          </button>

          {isAnswerRevealed && (
            <button
              onClick={onAwardPoints}
              className="bg-violet-500 hover:bg-violet-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              Award Points
            </button>
          )}
        </div>

        {/* Next Button */}
        <button
          onClick={onNext}
          className="flex items-center gap-2 bg-slate-700 hover:bg-slate-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
        >
          <span className="hidden sm:inline">Next</span>
          <span>→</span>
        </button>
      </div>

      {/* Keyboard Shortcuts Help */}
      <div className="max-w-4xl mx-auto mt-3 flex justify-center gap-6 text-sm text-slate-500">
        <span>Space: Reveal</span>
        <span>← →: Navigate</span>
        <span>S: Scoreboard</span>
        <span>F: Fullscreen</span>
      </div>
    </footer>
  )
}
