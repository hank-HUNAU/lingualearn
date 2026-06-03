import { useState, useRef, useCallback, useEffect } from 'react'
import { Mic, MicOff, Volume2, RotateCcw, ChevronRight, ChevronLeft } from 'lucide-react'
import { useLearning } from '../context/LearningContext'

interface SpeakingSentence {
  id: number
  text: string
  level: string
  translation: string
}

const sentences: SpeakingSentence[] = [
  { id: 1, text: 'Hello, how are you today?', level: 'A1', translation: '你好，你今天怎么样？' },
  { id: 2, text: 'I would like a cup of coffee, please.', level: 'A1', translation: '我想要一杯咖啡，谢谢。' },
  { id: 3, text: 'The weather is really nice today, let us go for a walk.', level: 'A2', translation: '今天天气真好，我们去散步吧。' },
  { id: 4, text: 'Could you tell me how to get to the nearest train station?', level: 'A2', translation: '你能告诉我怎么去最近的火车站吗？' },
  { id: 5, text: 'She has been working on this project for over three months.', level: 'B1', translation: '她已经在这个项目上工作了三个多月。' },
  { id: 6, text: 'If I had known about the meeting earlier, I would have prepared better.', level: 'B1', translation: '如果我早点知道会议的事，我会准备得更好。' },
  { id: 7, text: 'The government is considering new policies to address climate change.', level: 'B2', translation: '政府正在考虑新政策来应对气候变化。' },
  { id: 8, text: 'Notwithstanding the challenges, the team managed to deliver the project on time.', level: 'B2', translation: '尽管面临挑战，团队还是按时交付了项目。' },
  { id: 9, text: 'The juxtaposition of traditional architecture and modern technology creates a fascinating urban landscape.', level: 'C1', translation: '传统建筑与现代技术的并置创造了一种迷人的城市景观。' },
  { id: 10, text: 'It is imperative that we scrutinize the underlying assumptions before drawing any conclusions.', level: 'C2', translation: '在得出任何结论之前，我们必须仔细审查潜在的假设。' },
]

const levels = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2']

const speedOptions = [
  { label: '0.5x', value: 0.5 },
  { label: '0.75x', value: 0.75 },
  { label: '1x', value: 1 },
  { label: '1.25x', value: 1.25 },
]

interface SpeechRecognitionEvent {
  results: SpeechRecognitionResultList
  resultIndex: number
}

interface SpeechRecognitionResultList {
  length: number
  item(index: number): SpeechRecognitionResult
  [index: number]: SpeechRecognitionResult
}

interface SpeechRecognitionResult {
  isFinal: boolean
  length: number
  item(index: number): SpeechRecognitionAlternative
  [index: number]: SpeechRecognitionAlternative
}

interface SpeechRecognitionAlternative {
  transcript: string
  confidence: number
}

interface SpeechRecognitionInstance extends EventTarget {
  continuous: boolean
  interimResults: boolean
  lang: string
  start(): void
  stop(): void
  abort(): void
  onresult: ((event: SpeechRecognitionEvent) => void) | null
  onend: (() => void) | null
  onerror: ((event: { error: string }) => void) | null
}

type WordStatus = 'correct' | 'incorrect' | 'missed'

interface WordResult {
  word: string
  status: WordStatus
}

function getSpeechRecognition(): SpeechRecognitionInstance | null {
  const SpeechRecognition = (window as unknown as Record<string, unknown>).SpeechRecognition ||
    (window as unknown as Record<string, unknown>).webkitSpeechRecognition
  if (!SpeechRecognition) return null
  return new (SpeechRecognition as new () => SpeechRecognitionInstance)()
}

function calculateAccuracy(targetWords: string[], recognizedWords: string[]): WordResult[] {
  const results: WordResult[] = []
  const usedIndices = new Set<number>()

  for (const targetWord of targetWords) {
    const normalizedTarget = targetWord.toLowerCase().replace(/[^a-z']/g, '')
    let found = false

    for (let i = 0; i < recognizedWords.length; i++) {
      if (usedIndices.has(i)) continue
      const normalizedRecognized = recognizedWords[i].toLowerCase().replace(/[^a-z']/g, '')
      if (normalizedTarget === normalizedRecognized) {
        usedIndices.add(i)
        found = true
        break
      }
    }

    results.push({
      word: targetWord,
      status: found ? 'correct' : 'missed',
    })
  }

  for (let i = 0; i < recognizedWords.length; i++) {
    if (!usedIndices.has(i)) {
      const insertIndex = Math.min(i, results.length)
      results.splice(insertIndex, 0, {
        word: recognizedWords[i],
        status: 'incorrect',
      })
    }
  }

  return results
}

function calculateScores(targetWords: string[], recognizedWords: string[]) {
  const targetNormalized = targetWords.map(w => w.toLowerCase().replace(/[^a-z']/g, ''))
  const recognizedNormalized = recognizedWords.map(w => w.toLowerCase().replace(/[^a-z']/g, ''))

  let correctCount = 0
  const usedIndices = new Set<number>()

  for (const tWord of targetNormalized) {
    for (let i = 0; i < recognizedNormalized.length; i++) {
      if (usedIndices.has(i)) continue
      if (tWord === recognizedNormalized[i]) {
        correctCount++
        usedIndices.add(i)
        break
      }
    }
  }

  const accuracy = targetNormalized.length > 0 ? Math.round((correctCount / targetNormalized.length) * 100) : 0
  const completeness = targetNormalized.length > 0 ? Math.round((correctCount / targetNormalized.length) * 100) : 0
  const extraWords = recognizedNormalized.length - usedIndices.size
  const fluency = recognizedNormalized.length > 0
    ? Math.round(Math.max(0, (1 - extraWords / Math.max(recognizedNormalized.length, 1))) * accuracy)
    : 0

  return { accuracy, fluency, completeness }
}

export default function Speaking() {
  const { progress, updateProgress, addXp } = useLearning()
  const [selectedLevel, setSelectedLevel] = useState<string>('A1')
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isRecording, setIsRecording] = useState(false)
  const [recognizedText, setRecognizedText] = useState('')
  const [wordResults, setWordResults] = useState<WordResult[]>([])
  const [scores, setScores] = useState<{ accuracy: number; fluency: number; completeness: number } | null>(null)
  const [playbackSpeed, setPlaybackSpeed] = useState(1)
  const [isPlaying, setIsPlaying] = useState(false)
  const [hasResult, setHasResult] = useState(false)
  const [speechSupported, setSpeechSupported] = useState(true)
  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null)

  useEffect(() => {
    const recognition = getSpeechRecognition()
    setSpeechSupported(!!recognition)
  }, [])

  const filteredSentences = sentences.filter(s => s.level === selectedLevel)
  const currentSentence = filteredSentences[currentIndex] || filteredSentences[0]

  const handleLevelChange = (level: string) => {
    setSelectedLevel(level)
    setCurrentIndex(0)
    setRecognizedText('')
    setWordResults([])
    setScores(null)
    setHasResult(false)
  }

  function resetState() {
    setRecognizedText('')
    setWordResults([])
    setScores(null)
    setHasResult(false)
  }

  const startRecording = useCallback(() => {
    const recognition = getSpeechRecognition()
    if (!recognition) {
      alert('您的浏览器不支持语音识别功能，请使用Chrome浏览器。')
      return
    }

    recognition.continuous = true
    recognition.interimResults = true
    recognition.lang = 'en-US'

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let finalTranscript = ''
      for (let i = 0; i < event.results.length; i++) {
        finalTranscript += event.results[i][0].transcript
      }
      setRecognizedText(finalTranscript)
    }

    recognition.onend = () => {
      setIsRecording(false)
    }

    recognition.onerror = () => {
      setIsRecording(false)
    }

    recognitionRef.current = recognition
    recognition.start()
    setIsRecording(true)
    resetState()
  }, [])

  const stopRecording = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop()
    }
    setIsRecording(false)
  }, [])

  const submitRecording = useCallback(() => {
    if (!currentSentence || !recognizedText.trim()) return

    const targetWords = currentSentence.text.split(/\s+/)
    const recognizedWords = recognizedText.trim().split(/\s+/)

    const results = calculateAccuracy(targetWords, recognizedWords)
    const newScores = calculateScores(targetWords, recognizedWords)

    setWordResults(results)
    setScores(newScores)
    setHasResult(true)

    const overallScore = Math.round((newScores.accuracy + newScores.fluency + newScores.completeness) / 3)
    const newSpeakingScore = Math.round((progress.speakingScore + overallScore) / 2)
    updateProgress({ speakingScore: newSpeakingScore })
    addXp(Math.round(overallScore / 5))
  }, [currentSentence, recognizedText, progress.speakingScore, updateProgress, addXp])

  const playTTS = useCallback(() => {
    if (!currentSentence) return
    const utterance = new SpeechSynthesisUtterance(currentSentence.text)
    utterance.lang = 'en-US'
    utterance.rate = playbackSpeed
    utterance.onstart = () => setIsPlaying(true)
    utterance.onend = () => setIsPlaying(false)
    window.speechSynthesis.cancel()
    window.speechSynthesis.speak(utterance)
  }, [currentSentence, playbackSpeed])

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
    if (isRecording) {
      stopRecording()
    }
    resetState()
  }

  if (!currentSentence) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-lg text-slate-500">该级别暂无练习内容</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-accent-50 px-4 py-8">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8 text-center">
          <h1 className="mb-2 text-3xl font-bold gradient-text">口语练习</h1>
          <p className="text-slate-500">朗读句子，练习英语口语表达</p>
        </div>

        <div className="mb-6 flex flex-wrap justify-center gap-2">
          {levels.map(level => (
            <button
              key={level}
              onClick={() => handleLevelChange(level)}
              className={`rounded-full px-5 py-2 text-sm font-medium transition-all ${
                selectedLevel === level
                  ? 'bg-primary-500 text-white shadow-lg shadow-primary-200'
                  : 'bg-white text-slate-600 hover:bg-primary-50 hover:text-primary-600'
              }`}
            >
              {level}
            </button>
          ))}
        </div>

        <div className="mb-6 glass-card rounded-2xl p-8">
          <div className="mb-2 flex items-center justify-between">
            <span className="rounded-full bg-primary-100 px-3 py-1 text-xs font-medium text-primary-600">
              {currentSentence.level}
            </span>
            <span className="text-sm text-slate-400">
              {currentIndex + 1} / {filteredSentences.length}
            </span>
          </div>

          <p className="mb-4 text-2xl font-semibold leading-relaxed text-slate-800">
            {currentSentence.text}
          </p>
          <p className="text-sm text-slate-400">{currentSentence.translation}</p>

          <div className="mt-6 flex items-center gap-3">
            <button
              onClick={playTTS}
              disabled={isPlaying}
              className="flex items-center gap-2 rounded-full bg-primary-50 px-4 py-2 text-sm font-medium text-primary-600 transition-all hover:bg-primary-100 disabled:opacity-50"
            >
              <Volume2 className="h-4 w-4" />
              播放发音
            </button>

            <div className="flex items-center gap-1 rounded-full bg-slate-100 px-2 py-1">
              {speedOptions.map(opt => (
                <button
                  key={opt.value}
                  onClick={() => setPlaybackSpeed(opt.value)}
                  className={`rounded-full px-3 py-1 text-xs font-medium transition-all ${
                    playbackSpeed === opt.value
                      ? 'bg-white text-primary-600 shadow-sm'
                      : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="mb-6 glass-card rounded-2xl p-8">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-semibold text-slate-700">你的朗读</h3>
            {isRecording && (
              <div className="flex items-center gap-2">
                <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-rose-500" />
                <span className="text-sm text-rose-500">录音中...</span>
              </div>
            )}
          </div>

          {recognizedText ? (
            <div className="mb-4 rounded-xl bg-slate-50 p-4">
              {hasResult && wordResults.length > 0 ? (
                <p className="text-lg leading-relaxed">
                  {wordResults.map((result, idx) => (
                    <span
                      key={idx}
                      className={`inline-block mr-1 ${
                        result.status === 'correct'
                          ? 'text-emerald-600 font-semibold'
                          : result.status === 'incorrect'
                            ? 'text-rose-500 font-semibold underline decoration-rose-300'
                            : 'text-amber-500 font-semibold line-through decoration-amber-300'
                      }`}
                    >
                      {result.word}
                    </span>
                  ))}
                </p>
              ) : (
                <p className="text-lg text-slate-600">{recognizedText}</p>
              )}
            </div>
          ) : (
            <div className="mb-4 flex h-24 items-center justify-center rounded-xl border-2 border-dashed border-slate-200">
              <p className="text-sm text-slate-400">点击麦克风按钮开始朗读</p>
            </div>
          )}

          <div className="flex flex-wrap items-center gap-3">
            {!speechSupported ? (
              <div className="w-full rounded-xl bg-amber-50 border border-amber-200 p-4 text-center">
                <p className="text-sm text-amber-700 mb-2">您的浏览器不支持语音识别功能</p>
                <p className="text-xs text-amber-500">请使用 Chrome 或 Edge 浏览器以获得完整体验。您仍可使用播放发音功能进行跟读练习。</p>
              </div>
            ) : (
            <>
            {!isRecording ? (
              <button
                onClick={startRecording}
                className="flex items-center gap-2 rounded-full bg-primary-500 px-6 py-3 text-sm font-medium text-white shadow-lg shadow-primary-200 transition-all hover:bg-primary-600"
              >
                <Mic className="h-5 w-5" />
                开始录音
              </button>
            ) : (
              <button
                onClick={stopRecording}
                className="flex items-center gap-2 rounded-full bg-rose-500 px-6 py-3 text-sm font-medium text-white shadow-lg shadow-rose-200 transition-all hover:bg-rose-600"
              >
                <MicOff className="h-5 w-5" />
                停止录音
              </button>
            )}

            {recognizedText && !hasResult && (
              <button
                onClick={submitRecording}
                className="flex items-center gap-2 rounded-full bg-emerald-500 px-6 py-3 text-sm font-medium text-white shadow-lg shadow-emerald-200 transition-all hover:bg-emerald-600"
              >
                提交评分
              </button>
            )}
            </>
            )}

            <button
              onClick={handleReset}
              className="flex items-center gap-2 rounded-full bg-slate-100 px-5 py-3 text-sm font-medium text-slate-600 transition-all hover:bg-slate-200"
            >
              <RotateCcw className="h-4 w-4" />
              重新录音
            </button>
          </div>
        </div>

        {scores && hasResult && (
          <div className="mb-6 animate-slide-up">
            <div className="glass-card rounded-2xl p-8">
              <h3 className="mb-6 text-center text-lg font-semibold text-slate-700">评分结果</h3>

              <div className="mb-6 grid grid-cols-3 gap-4">
                <div className="rounded-xl bg-primary-50 p-4 text-center">
                  <div className="mb-1 text-3xl font-bold text-primary-600">{scores.accuracy}%</div>
                  <div className="text-sm text-primary-500">准确度</div>
                </div>
                <div className="rounded-xl bg-accent-50 p-4 text-center">
                  <div className="mb-1 text-3xl font-bold text-accent-600">{scores.fluency}%</div>
                  <div className="text-sm text-accent-500">流利度</div>
                </div>
                <div className="rounded-xl bg-emerald-50 p-4 text-center">
                  <div className="mb-1 text-3xl font-bold text-emerald-600">{scores.completeness}%</div>
                  <div className="text-sm text-emerald-500">完整度</div>
                </div>
              </div>

              <div className="flex items-center justify-center gap-4 text-sm">
                <span className="flex items-center gap-1">
                  <span className="inline-block h-3 w-3 rounded bg-emerald-500" />
                  正确
                </span>
                <span className="flex items-center gap-1">
                  <span className="inline-block h-3 w-3 rounded bg-rose-500" />
                  多余
                </span>
                <span className="flex items-center gap-1">
                  <span className="inline-block h-3 w-3 rounded bg-amber-500" />
                  遗漏
                </span>
              </div>
            </div>
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
