import { useState, useCallback } from 'react'
import { Volume2, ChevronRight, ChevronLeft, Eye, EyeOff, Check, X, RotateCcw } from 'lucide-react'
import { useLearning } from '../context/LearningContext'

interface ListeningSentence {
  id: number
  text: string
  level: string
  translation: string
}

const sentences: ListeningSentence[] = [
  { id: 1, text: 'Good morning, nice to meet you.', level: 'A1', translation: '早上好，很高兴见到你。' },
  { id: 2, text: 'Where is the nearest supermarket?', level: 'A1', translation: '最近的超市在哪里？' },
  { id: 3, text: 'I usually go to the gym after work on weekdays.', level: 'A2', translation: '我通常在工作日的下班后去健身房。' },
  { id: 4, text: 'She bought a new dress for the party next Saturday.', level: 'A2', translation: '她为下周六的派对买了一条新裙子。' },
  { id: 5, text: 'The restaurant was so crowded that we had to wait for thirty minutes.', level: 'B1', translation: '餐厅太拥挤了，我们不得不等了三十分钟。' },
  { id: 6, text: 'He decided to quit his job and travel around the world for a year.', level: 'B1', translation: '他决定辞去工作，环游世界一年。' },
  { id: 7, text: 'Despite the economic downturn, the company managed to increase its revenue by fifteen percent.', level: 'B2', translation: '尽管经济低迷，公司的收入仍增长了百分之十五。' },
  { id: 8, text: 'The research indicates that regular exercise can significantly reduce the risk of cardiovascular disease.', level: 'B2', translation: '研究表明，定期锻炼可以显著降低心血管疾病的风险。' },
  { id: 9, text: 'The unprecedented scale of the environmental crisis demands immediate and concerted international action.', level: 'C1', translation: '环境危机空前的规模要求立即采取协调一致的国际行动。' },
  { id: 10, text: 'The dichotomy between economic growth and environmental sustainability remains a contentious issue among policymakers.', level: 'C2', translation: '经济增长与环境可持续性之间的二分法仍然是决策者中争议的问题。' },
]

const levels = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2']

const speedOptions = [
  { label: '0.5x', value: 0.5 },
  { label: '0.75x', value: 0.75 },
  { label: '1x', value: 1 },
  { label: '1.25x', value: 1.25 },
]

type HintType = 'none' | 'firstLetter' | 'wordCount' | 'halfText'

export default function Listening() {
  const { progress, updateProgress, addXp } = useLearning()
  const [selectedLevel, setSelectedLevel] = useState<string>('A1')
  const [currentIndex, setCurrentIndex] = useState(0)
  const [userInput, setUserInput] = useState('')
  const [playbackSpeed, setPlaybackSpeed] = useState(1)
  const [playCount, setPlayCount] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [hasSubmitted, setHasSubmitted] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)
  const [hintType, setHintType] = useState<HintType>('none')
  const [score, setScore] = useState<number | null>(null)

  const filteredSentences = sentences.filter(s => s.level === selectedLevel)
  const currentSentence = filteredSentences[currentIndex] || filteredSentences[0]

  const handleLevelChange = (level: string) => {
    setSelectedLevel(level)
    setCurrentIndex(0)
    setUserInput('')
    setPlayCount(0)
    setHasSubmitted(false)
    setIsCorrect(false)
    setHintType('none')
    setScore(null)
  }

  function resetState() {
    setUserInput('')
    setPlayCount(0)
    setHasSubmitted(false)
    setIsCorrect(false)
    setHintType('none')
    setScore(null)
  }

  const playAudio = useCallback(() => {
    if (!currentSentence) return
    const utterance = new SpeechSynthesisUtterance(currentSentence.text)
    utterance.lang = 'en-US'
    utterance.rate = playbackSpeed
    utterance.onstart = () => setIsPlaying(true)
    utterance.onend = () => setIsPlaying(false)
    window.speechSynthesis.cancel()
    window.speechSynthesis.speak(utterance)
    setPlayCount(prev => prev + 1)
  }, [currentSentence, playbackSpeed])

  const getHintText = useCallback((): string => {
    if (!currentSentence || hintType === 'none') return ''

    switch (hintType) {
      case 'firstLetter':
        return currentSentence.text.split(' ').map(w => w[0] + '_'.repeat(w.length - 1)).join(' ')
      case 'wordCount':
        return `共 ${currentSentence.text.split(' ').length} 个单词`
      case 'halfText': {
        const half = Math.ceil(currentSentence.text.length / 2)
        return currentSentence.text.substring(0, half) + '...'
      }
      default:
        return ''
    }
  }, [currentSentence, hintType])

  const handleSubmit = useCallback(() => {
    if (!currentSentence || !userInput.trim()) return

    const targetNormalized = currentSentence.text.toLowerCase().replace(/[^a-z\s]/g, '').trim()
    const inputNormalized = userInput.toLowerCase().replace(/[^a-z\s]/g, '').trim()

    const targetWords = targetNormalized.split(/\s+/)
    const inputWords = inputNormalized.split(/\s+/)

    let matchCount = 0
    const usedIndices = new Set<number>()

    for (const tWord of targetWords) {
      for (let i = 0; i < inputWords.length; i++) {
        if (usedIndices.has(i)) continue
        if (tWord === inputWords[i]) {
          matchCount++
          usedIndices.add(i)
          break
        }
      }
    }

    const accuracy = targetWords.length > 0 ? Math.round((matchCount / targetWords.length) * 100) : 0
    const correct = accuracy >= 80

    setIsCorrect(correct)
    setScore(accuracy)
    setHasSubmitted(true)

    const newListeningScore = Math.round((progress.listeningScore + accuracy) / 2)
    updateProgress({ listeningScore: newListeningScore })
    addXp(Math.round(accuracy / 5))
  }, [currentSentence, userInput, progress.listeningScore, updateProgress, addXp])

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1)
      resetState()
    }
  }

  const handleNext = () => {
    if (currentIndex < filteredSentences.length - 1) {
      setCurrentIndex(prev => prev + 1)
      resetState()
    }
  }

  const handleReset = () => {
    resetState()
  }

  const cycleHint = () => {
    const hintOrder: HintType[] = ['none', 'firstLetter', 'wordCount', 'halfText']
    const currentIdx = hintOrder.indexOf(hintType)
    setHintType(hintOrder[(currentIdx + 1) % hintOrder.length])
  }

  const hintLabel: Record<HintType, string> = {
    none: '显示提示',
    firstLetter: '首字母',
    wordCount: '单词数',
    halfText: '半文',
  }

  if (!currentSentence) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-lg text-slate-500">该级别暂无练习内容</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-accent-50 via-white to-primary-50 px-4 py-8">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8 text-center">
          <h1 className="mb-2 text-3xl font-bold gradient-text">听力训练</h1>
          <p className="text-slate-500">听音频，写下你听到的内容</p>
        </div>

        <div className="mb-6 flex flex-wrap justify-center gap-2">
          {levels.map(level => (
            <button
              key={level}
              onClick={() => handleLevelChange(level)}
              className={`rounded-full px-5 py-2 text-sm font-medium transition-all ${
                selectedLevel === level
                  ? 'bg-accent-500 text-white shadow-lg shadow-accent-200'
                  : 'bg-white text-slate-600 hover:bg-accent-50 hover:text-accent-600'
              }`}
            >
              {level}
            </button>
          ))}
        </div>

        <div className="mb-6 glass-card rounded-2xl p-8">
          <div className="mb-4 flex items-center justify-between">
            <span className="rounded-full bg-accent-100 px-3 py-1 text-xs font-medium text-accent-600">
              {currentSentence.level}
            </span>
            <span className="text-sm text-slate-400">
              {currentIndex + 1} / {filteredSentences.length}
            </span>
          </div>

          <div className="mb-6 flex flex-col items-center gap-4">
            <button
              onClick={playAudio}
              disabled={isPlaying}
              className="flex h-20 w-20 items-center justify-center rounded-full bg-accent-500 text-white shadow-lg shadow-accent-200 transition-all hover:bg-accent-600 hover:scale-105 disabled:opacity-50"
            >
              <Volume2 className="h-8 w-8" />
            </button>
            <div className="flex items-center gap-3">
              <p className="text-sm text-slate-400">点击播放音频</p>
              {playCount > 0 && (
                <button
                  onClick={playAudio}
                  disabled={isPlaying}
                  className="flex items-center gap-1 rounded-full bg-accent-50 px-3 py-1 text-xs font-medium text-accent-600 transition-all hover:bg-accent-100 disabled:opacity-50"
                >
                  <Volume2 className="h-3 w-3" />
                  重新播放
                </button>
              )}
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <div className="flex items-center gap-1 rounded-full bg-slate-100 px-2 py-1">
              {speedOptions.map(opt => (
                <button
                  key={opt.value}
                  onClick={() => setPlaybackSpeed(opt.value)}
                  className={`rounded-full px-3 py-1 text-xs font-medium transition-all ${
                    playbackSpeed === opt.value
                      ? 'bg-white text-accent-600 shadow-sm'
                      : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>

            <button
              onClick={cycleHint}
              className="flex items-center gap-1 rounded-full bg-amber-50 px-4 py-1.5 text-xs font-medium text-amber-600 transition-all hover:bg-amber-100"
            >
              {hintType === 'none' ? <Eye className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5" />}
              {hintLabel[hintType]}
            </button>

            <span className="rounded-full bg-slate-100 px-3 py-1.5 text-xs text-slate-500">
              已播放 {playCount} 次
            </span>
          </div>

          {hintType !== 'none' && (
            <div className="mt-4 rounded-xl bg-amber-50 p-3 text-center">
              <p className="text-sm text-amber-700">{getHintText()}</p>
            </div>
          )}
        </div>

        <div className="mb-6 glass-card rounded-2xl p-8">
          <h3 className="mb-4 font-semibold text-slate-700">写下你听到的内容</h3>

          <textarea
            value={userInput}
            onChange={e => setUserInput(e.target.value)}
            disabled={hasSubmitted}
            placeholder="在此输入你听到的英文..."
            className="mb-4 w-full resize-none rounded-xl border-2 border-slate-200 bg-white p-4 text-slate-700 transition-all focus:border-accent-400 focus:outline-none disabled:bg-slate-50 disabled:opacity-70"
            rows={3}
          />

          <div className="flex flex-wrap items-center gap-3">
            {!hasSubmitted ? (
              <button
                onClick={handleSubmit}
                disabled={!userInput.trim()}
                className="flex items-center gap-2 rounded-full bg-accent-500 px-6 py-3 text-sm font-medium text-white shadow-lg shadow-accent-200 transition-all hover:bg-accent-600 disabled:opacity-40"
              >
                <Check className="h-4 w-4" />
                提交答案
              </button>
            ) : (
              <div className="flex items-center gap-3">
                <div className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium ${
                  isCorrect ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
                }`}>
                  {isCorrect ? <Check className="h-4 w-4" /> : <X className="h-4 w-4" />}
                  {isCorrect ? '回答正确！' : '还需努力'}
                  {score !== null && ` (${score}%)`}
                </div>
              </div>
            )}

            <button
              onClick={handleReset}
              className="flex items-center gap-2 rounded-full bg-slate-100 px-5 py-3 text-sm font-medium text-slate-600 transition-all hover:bg-slate-200"
            >
              <RotateCcw className="h-4 w-4" />
              重新作答
            </button>
          </div>
        </div>

        {hasSubmitted && (
          <div className="mb-6 animate-slide-up glass-card rounded-2xl p-8">
            <h3 className="mb-3 font-semibold text-slate-700">原文</h3>
            <p className="mb-4 text-lg leading-relaxed text-slate-800">{currentSentence.text}</p>
            <p className="text-sm text-slate-400">{currentSentence.translation}</p>

            {score !== null && (
              <div className="mt-4">
                <div className="mb-2 flex items-center justify-between text-sm">
                  <span className="text-slate-500">准确率</span>
                  <span className={`font-semibold ${score >= 80 ? 'text-emerald-600' : score >= 50 ? 'text-amber-600' : 'text-rose-600'}`}>
                    {score}%
                  </span>
                </div>
                <div className="h-2 w-full rounded-full bg-slate-100">
                  <div
                    className={`h-2 rounded-full transition-all ${
                      score >= 80 ? 'bg-emerald-500' : score >= 50 ? 'bg-amber-500' : 'bg-rose-500'
                    }`}
                    style={{ width: `${score}%` }}
                  />
                </div>
              </div>
            )}
          </div>
        )}

        <div className="flex items-center justify-between">
          <button
            onClick={handlePrev}
            disabled={currentIndex === 0}
            className="flex items-center gap-1 rounded-full bg-white px-4 py-2 text-sm font-medium text-slate-600 shadow-sm transition-all hover:bg-slate-50 disabled:opacity-40"
          >
            <ChevronLeft className="h-4 w-4" />
            上一句
          </button>
          <button
            onClick={handleNext}
            disabled={currentIndex >= filteredSentences.length - 1}
            className="flex items-center gap-1 rounded-full bg-white px-4 py-2 text-sm font-medium text-slate-600 shadow-sm transition-all hover:bg-slate-50 disabled:opacity-40"
          >
            下一句
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
