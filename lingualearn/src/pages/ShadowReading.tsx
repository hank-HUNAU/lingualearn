import { useState, useRef, useCallback, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import {
  Zap, List, Play, Pause, Square, Mic, MicOff,
  ChevronLeft, ChevronRight, RotateCcw, Volume2,
  Search, Award, ArrowRight, CheckCircle
} from 'lucide-react'
import {
  shadowingMaterials, categoryMeta,
  type ShadowingMaterial, type MaterialCategory, type DifficultyLevel, type Accent
} from '../data/shadowingMaterials'
import {
  calculateSixDimensionScore,
  type SixDimensionScore, type WordDetail, type ScoringResult
} from '../utils/scoringEngine'
import { useLearning } from '../context/LearningContext'

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

type PracticeMode = 'realtime' | 'sentence'
type PagePhase = 'select' | 'practice' | 'result'

const levels: DifficultyLevel[] = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2']
const accents: { value: Accent; label: string }[] = [
  { value: 'us', label: '美式' },
  { value: 'uk', label: '英式' },
]

const speedOptions = [
  { label: '0.5x', value: 0.5 },
  { label: '0.75x', value: 0.75 },
  { label: '1x', value: 1 },
  { label: '1.25x', value: 1.25 },
  { label: '1.5x', value: 1.5 },
]

const dimensionConfig = [
  { key: 'accuracy' as const, label: '准确度', color: 'bg-blue-500', track: 'bg-blue-100', text: 'text-blue-600' },
  { key: 'fluency' as const, label: '流利度', color: 'bg-emerald-500', track: 'bg-emerald-100', text: 'text-emerald-600' },
  { key: 'completeness' as const, label: '完整度', color: 'bg-purple-500', track: 'bg-purple-100', text: 'text-purple-600' },
  { key: 'prosody' as const, label: '语调匹配度', color: 'bg-rose-500', track: 'bg-rose-100', text: 'text-rose-600' },
  { key: 'tempo' as const, label: '语速匹配度', color: 'bg-amber-500', track: 'bg-amber-100', text: 'text-amber-600' },
  { key: 'rhythm' as const, label: '停顿节奏', color: 'bg-cyan-500', track: 'bg-cyan-100', text: 'text-cyan-600' },
]

function getSpeechRecognition(): SpeechRecognitionInstance | null {
  const SR = (window as unknown as Record<string, unknown>).SpeechRecognition ||
    (window as unknown as Record<string, unknown>).webkitSpeechRecognition
  if (!SR) return null
  return new (SR as new () => SpeechRecognitionInstance)()
}

function getWordColor(status: WordDetail['status']): string {
  switch (status) {
    case 'correct': return 'text-emerald-600 font-semibold'
    case 'incorrect': return 'text-rose-500 font-semibold underline decoration-rose-300'
    case 'prosody_mismatch': return 'text-yellow-500 font-semibold'
    case 'missed': return 'text-slate-400 line-through decoration-slate-300'
    case 'extra': return 'text-amber-500 italic'
    default: return 'text-slate-600'
  }
}

export default function ShadowReading() {
  const { id } = useParams<{ id?: string }>()
  const { progress, updateProgress, addXp, completeLesson } = useLearning()

  const [mode, setMode] = useState<PracticeMode>('realtime')
  const [phase, setPhase] = useState<PagePhase>('select')
  const [selectedMaterial, setSelectedMaterial] = useState<ShadowingMaterial | null>(null)
  const [categoryFilter, setCategoryFilter] = useState<MaterialCategory | 'all'>('all')
  const [levelFilter, setLevelFilter] = useState<DifficultyLevel | 'all'>('all')
  const [accentFilter, setAccentFilter] = useState<Accent | 'all'>('all')
  const [searchQuery, setSearchQuery] = useState('')

  const [currentSentenceIndex, setCurrentSentenceIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const [playbackSpeed, setPlaybackSpeed] = useState(1)
  const [recognizedText, setRecognizedText] = useState('')
  const [interimText, setInterimText] = useState('')
  const [speechSupported, setSpeechSupported] = useState(true)

  const [realtimeCurrentSentence, setRealtimeCurrentSentence] = useState(0)

  const [sentenceScores, setSentenceScores] = useState<ScoringResult[]>([])
  const [currentSentenceScore, setCurrentSentenceScore] = useState<ScoringResult | null>(null)
  const [overallScore, setOverallScore] = useState<SixDimensionScore | null>(null)
  const [overallWordDetails, setOverallWordDetails] = useState<WordDetail[]>([])
  const [earnedXp, setEarnedXp] = useState(0)

  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null)
  const synthRef = useRef<SpeechSynthesis | null>(null)
  const playbackStartTimeRef = useRef<number>(0)
  const playbackEndTimeRef = useRef<number>(0)
  const sentenceQueueRef = useRef<number>(0)
  const isStoppingRef = useRef<boolean>(false)

  useEffect(() => {
    const recognition = getSpeechRecognition()
    setSpeechSupported(!!recognition)
    synthRef.current = window.speechSynthesis
  }, [])

  useEffect(() => {
    if (id) {
      const material = shadowingMaterials.find(m => m.id === id)
      if (material) {
        setSelectedMaterial(material)
        setPhase('select')
      }
    }
  }, [id])

  useEffect(() => {
    return () => {
      window.speechSynthesis?.cancel()
      if (recognitionRef.current) {
        try { recognitionRef.current.abort() } catch {}
      }
    }
  }, [])

  const filteredMaterials = shadowingMaterials.filter(m => {
    if (categoryFilter !== 'all' && m.category !== categoryFilter) return false
    if (levelFilter !== 'all' && m.level !== levelFilter) return false
    if (accentFilter !== 'all' && m.accent !== accentFilter) return false
    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      return m.title.toLowerCase().includes(q) ||
        m.description.toLowerCase().includes(q) ||
        m.tags.some(t => t.toLowerCase().includes(q))
    }
    return true
  })

  const startRecording = useCallback((lang: string = 'en-US') => {
    const recognition = getSpeechRecognition()
    if (!recognition) return

    recognition.continuous = true
    recognition.interimResults = true
    recognition.lang = lang

    let finalTranscript = ''

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let interim = ''
      for (let i = event.resultIndex; i < event.results.length; i++) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript + ' '
        } else {
          interim += event.results[i][0].transcript
        }
      }
      setRecognizedText(finalTranscript.trim())
      setInterimText(interim)
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
    setRecognizedText('')
    setInterimText('')
  }, [])

  const stopRecording = useCallback(() => {
    if (recognitionRef.current) {
      try { recognitionRef.current.stop() } catch {}
    }
    setIsRecording(false)
  }, [])

  const playSentenceSequential = useCallback((material: ShadowingMaterial, startIndex: number, speed: number) => {
    window.speechSynthesis.cancel()
    isStoppingRef.current = false
    sentenceQueueRef.current = startIndex
    setRealtimeCurrentSentence(startIndex)
    setIsPlaying(true)
    setIsPaused(false)
    playbackStartTimeRef.current = Date.now()

    const lang = material.accent === 'uk' ? 'en-GB' : 'en-US'

    function playNext(index: number) {
      if (isStoppingRef.current || index >= material.sentences.length) {
        setIsPlaying(false)
        playbackEndTimeRef.current = Date.now()
        if (recognitionRef.current) {
          try { recognitionRef.current.stop() } catch {}
        }
        setIsRecording(false)
        return
      }

      setRealtimeCurrentSentence(index)

      const utterance = new SpeechSynthesisUtterance(material.sentences[index].text)
      utterance.lang = lang
      utterance.rate = speed
      utterance.onend = () => {
        sentenceQueueRef.current = index + 1
        playNext(index + 1)
      }
      utterance.onerror = () => {
        sentenceQueueRef.current = index + 1
        playNext(index + 1)
      }
      window.speechSynthesis.speak(utterance)
    }

    playNext(startIndex)
  }, [])

  const handleRealtimeStart = useCallback(() => {
    if (!selectedMaterial) return
    setPhase('practice')
    setCurrentSentenceIndex(0)
    setRecognizedText('')
    setInterimText('')
    setSentenceScores([])
    setCurrentSentenceScore(null)
    setOverallScore(null)
    setOverallWordDetails([])

    const lang = selectedMaterial.accent === 'uk' ? 'en-GB' : 'en-US'
    startRecording(lang)
    playSentenceSequential(selectedMaterial, 0, playbackSpeed)
  }, [selectedMaterial, playbackSpeed, startRecording, playSentenceSequential])

  const handleRealtimeStop = useCallback(() => {
    isStoppingRef.current = true
    window.speechSynthesis.cancel()
    stopRecording()
    setIsPlaying(false)
    setIsPaused(false)

    if (!selectedMaterial) return

    const fullTarget = selectedMaterial.sentences.map(s => s.text).join(' ')
    const targetDuration = playbackEndTimeRef.current - playbackStartTimeRef.current
    const actualDuration = Date.now() - playbackStartTimeRef.current

    const result = calculateSixDimensionScore(
      fullTarget,
      recognizedText || ' ',
      targetDuration > 0 ? targetDuration : 5000,
      actualDuration > 0 ? actualDuration : 5000
    )

    setOverallScore(result.scores)
    setOverallWordDetails(result.wordDetails)

    const xpEarned = Math.max(5, Math.round(result.scores.overall / 4))
    setEarnedXp(xpEarned)
    addXp(xpEarned)
    const newSpeakingScore = Math.round((progress.speakingScore + result.scores.overall) / 2)
    updateProgress({ speakingScore: newSpeakingScore })
    completeLesson(selectedMaterial.id, xpEarned)

    setPhase('result')
  }, [selectedMaterial, recognizedText, addXp, updateProgress, completeLesson, stopRecording, progress.speakingScore])

  const handleRealtimePause = useCallback(() => {
    if (isPaused) {
      window.speechSynthesis.resume()
      setIsPaused(false)
    } else {
      window.speechSynthesis.pause()
      setIsPaused(true)
    }
  }, [isPaused])

  const handleSentenceModeStart = useCallback(() => {
    if (!selectedMaterial) return
    setPhase('practice')
    setCurrentSentenceIndex(0)
    setRecognizedText('')
    setInterimText('')
    setSentenceScores([])
    setCurrentSentenceScore(null)
    setOverallScore(null)
    setOverallWordDetails([])
  }, [selectedMaterial])

  const playCurrentSentence = useCallback(() => {
    if (!selectedMaterial) return
    const sentence = selectedMaterial.sentences[currentSentenceIndex]
    if (!sentence) return

    window.speechSynthesis.cancel()
    const utterance = new SpeechSynthesisUtterance(sentence.text)
    utterance.lang = selectedMaterial.accent === 'uk' ? 'en-GB' : 'en-US'
    utterance.rate = playbackSpeed
    utterance.onstart = () => setIsPlaying(true)
    utterance.onend = () => setIsPlaying(false)
    window.speechSynthesis.speak(utterance)
  }, [selectedMaterial, currentSentenceIndex, playbackSpeed])

  const handleSentenceRecord = useCallback(() => {
    if (!selectedMaterial) return
    const lang = selectedMaterial.accent === 'uk' ? 'en-GB' : 'en-US'
    setRecognizedText('')
    setInterimText('')
    setCurrentSentenceScore(null)
    startRecording(lang)
  }, [selectedMaterial, startRecording])

  const handleSentenceSubmit = useCallback(() => {
    if (!selectedMaterial || !recognizedText.trim()) return

    stopRecording()

    const sentence = selectedMaterial.sentences[currentSentenceIndex]
    const result = calculateSixDimensionScore(
      sentence.text,
      recognizedText,
      sentence.text.split(/\s+/).length * 400,
      recognizedText.split(/\s+/).length * 400
    )

    setCurrentSentenceScore(result)
    setSentenceScores(prev => [...prev, result])
  }, [selectedMaterial, currentSentenceIndex, recognizedText, stopRecording])

  const handleSentenceNext = useCallback(() => {
    if (!selectedMaterial) return
    if (currentSentenceIndex < selectedMaterial.sentences.length - 1) {
      setCurrentSentenceIndex(prev => prev + 1)
      setRecognizedText('')
      setInterimText('')
      setCurrentSentenceScore(null)
    }
  }, [selectedMaterial, currentSentenceIndex])

  const handleSentencePrev = useCallback(() => {
    if (currentSentenceIndex > 0) {
      setCurrentSentenceIndex(prev => prev - 1)
      setRecognizedText('')
      setInterimText('')
      setCurrentSentenceScore(null)
    }
  }, [currentSentenceIndex])

  const handleSentenceFinish = useCallback(() => {
    if (!selectedMaterial || sentenceScores.length === 0) return

    const avgScores: SixDimensionScore = {
      accuracy: sentenceScores.reduce((s, r) => s + r.scores.accuracy, 0) / sentenceScores.length,
      fluency: sentenceScores.reduce((s, r) => s + r.scores.fluency, 0) / sentenceScores.length,
      completeness: sentenceScores.reduce((s, r) => s + r.scores.completeness, 0) / sentenceScores.length,
      prosody: sentenceScores.reduce((s, r) => s + r.scores.prosody, 0) / sentenceScores.length,
      tempo: sentenceScores.reduce((s, r) => s + r.scores.tempo, 0) / sentenceScores.length,
      rhythm: sentenceScores.reduce((s, r) => s + r.scores.rhythm, 0) / sentenceScores.length,
      overall: sentenceScores.reduce((s, r) => s + r.scores.overall, 0) / sentenceScores.length,
    }

    setOverallScore(avgScores)

    const allWordDetails = sentenceScores.flatMap(r => r.wordDetails)
    setOverallWordDetails(allWordDetails)

    const xpEarned = Math.max(5, Math.round(avgScores.overall / 4))
    setEarnedXp(xpEarned)
    addXp(xpEarned)
    const newSpeakingScore = Math.round((progress.speakingScore + avgScores.overall) / 2)
    updateProgress({ speakingScore: newSpeakingScore })
    completeLesson(selectedMaterial.id, xpEarned)

    setPhase('result')
  }, [selectedMaterial, sentenceScores, addXp, updateProgress, completeLesson, progress.speakingScore])

  const handleRetry = useCallback(() => {
    setPhase('select')
    setCurrentSentenceIndex(0)
    setRecognizedText('')
    setInterimText('')
    setSentenceScores([])
    setCurrentSentenceScore(null)
    setOverallScore(null)
    setOverallWordDetails([])
    setIsPlaying(false)
    setIsRecording(false)
    setIsPaused(false)
  }, [])

  const handleChangeMaterial = useCallback(() => {
    setSelectedMaterial(null)
    setPhase('select')
    setCurrentSentenceIndex(0)
    setRecognizedText('')
    setInterimText('')
    setSentenceScores([])
    setCurrentSentenceScore(null)
    setOverallScore(null)
    setOverallWordDetails([])
    setIsPlaying(false)
    setIsRecording(false)
    setIsPaused(false)
  }, [])

  useEffect(() => {
    if (mode === 'realtime' && phase === 'practice' && !isPlaying && !isPaused && recognizedText) {
      playbackEndTimeRef.current = Date.now()
    }
  }, [isPlaying, isPaused, mode, phase, recognizedText])

  if (!speechSupported && phase !== 'select') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-primary-50 via-white to-accent-50 px-4">
        <div className="rounded-2xl bg-white p-8 text-center shadow-xl max-w-md">
          <div className="mb-4 text-5xl">🎤</div>
          <h2 className="mb-2 text-xl font-bold text-slate-800">浏览器不支持语音识别</h2>
          <p className="mb-4 text-sm text-slate-500">请使用 Chrome 或 Edge 浏览器以获得完整体验。</p>
          <button
            onClick={handleChangeMaterial}
            className="rounded-full bg-primary-500 px-6 py-2 text-sm font-medium text-white transition-all hover:bg-primary-600"
          >
            返回选择
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-accent-50 px-4 py-8">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8 text-center">
          <h1 className="mb-2 text-4xl font-extrabold bg-gradient-to-r from-primary-600 via-accent-500 to-primary-600 bg-clip-text text-transparent">
            影子跟读
          </h1>
          <p className="text-slate-500">Shadow Reading - 听音跟读，练就地道口语</p>
        </div>

        <div className="mb-8 flex justify-center gap-4">
          <button
            onClick={() => { setMode('realtime'); handleRetry() }}
            className={`flex items-center gap-3 rounded-2xl px-8 py-4 text-base font-semibold transition-all ${
              mode === 'realtime'
                ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-lg shadow-primary-200 scale-105'
                : 'bg-white text-slate-600 hover:bg-primary-50 hover:text-primary-600 shadow-sm'
            }`}
          >
            <Zap className="h-5 w-5" />
            实时跟读
          </button>
          <button
            onClick={() => { setMode('sentence'); handleRetry() }}
            className={`flex items-center gap-3 rounded-2xl px-8 py-4 text-base font-semibold transition-all ${
              mode === 'sentence'
                ? 'bg-gradient-to-r from-accent-500 to-accent-600 text-white shadow-lg shadow-accent-200 scale-105'
                : 'bg-white text-slate-600 hover:bg-accent-50 hover:text-accent-600 shadow-sm'
            }`}
          >
            <List className="h-5 w-5" />
            逐句跟读
          </button>
        </div>

        {phase === 'select' && (
          <>
            {!selectedMaterial ? (
              <div className="space-y-6">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    placeholder="搜索素材..."
                    className="w-full rounded-2xl border-2 border-slate-200 bg-white py-3 pl-12 pr-4 text-slate-700 transition-all focus:border-primary-400 focus:outline-none"
                  />
                </div>

                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setCategoryFilter('all')}
                    className={`rounded-full px-4 py-2 text-sm font-medium transition-all ${
                      categoryFilter === 'all'
                        ? 'bg-primary-500 text-white shadow-md'
                        : 'bg-white text-slate-600 hover:bg-primary-50'
                    }`}
                  >
                    全部
                  </button>
                  {(Object.keys(categoryMeta) as MaterialCategory[]).map(cat => (
                    <button
                      key={cat}
                      onClick={() => setCategoryFilter(cat)}
                      className={`rounded-full px-4 py-2 text-sm font-medium transition-all ${
                        categoryFilter === cat
                          ? 'bg-primary-500 text-white shadow-md'
                          : 'bg-white text-slate-600 hover:bg-primary-50'
                      }`}
                    >
                      {categoryMeta[cat].emoji} {categoryMeta[cat].label}
                    </button>
                  ))}
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <span className="text-sm font-medium text-slate-500">级别：</span>
                  {levels.map(level => (
                    <button
                      key={level}
                      onClick={() => setLevelFilter(levelFilter === level ? 'all' : level)}
                      className={`rounded-full px-4 py-1.5 text-xs font-medium transition-all ${
                        levelFilter === level
                          ? 'bg-accent-500 text-white shadow-md'
                          : 'bg-white text-slate-500 hover:bg-accent-50'
                      }`}
                    >
                      {level}
                    </button>
                  ))}
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <span className="text-sm font-medium text-slate-500">口音：</span>
                  {accents.map(a => (
                    <button
                      key={a.value}
                      onClick={() => setAccentFilter(accentFilter === a.value ? 'all' : a.value)}
                      className={`rounded-full px-4 py-1.5 text-xs font-medium transition-all ${
                        accentFilter === a.value
                          ? 'bg-primary-500 text-white shadow-md'
                          : 'bg-white text-slate-500 hover:bg-primary-50'
                      }`}
                    >
                      {a.label}
                    </button>
                  ))}
                </div>

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {filteredMaterials.map(material => (
                    <div
                      key={material.id}
                      className="group rounded-2xl bg-white p-5 shadow-sm transition-all hover:shadow-lg hover:-translate-y-1 border border-slate-100"
                    >
                      <div className="mb-3 flex items-center gap-2">
                        <span className={`rounded-full bg-gradient-to-r ${categoryMeta[material.category].color} px-3 py-1 text-xs font-medium text-white`}>
                          {categoryMeta[material.category].emoji} {categoryMeta[material.category].label}
                        </span>
                        <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-500">
                          {material.level}
                        </span>
                        <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${material.accent === 'us' ? 'bg-blue-50 text-blue-600' : 'bg-rose-50 text-rose-600'}`}>
                          {material.accent === 'us' ? '美式' : '英式'}
                        </span>
                      </div>

                      <h3 className="mb-1 text-base font-bold text-slate-800 group-hover:text-primary-600 transition-colors">
                        {material.title}
                      </h3>
                      <p className="mb-3 text-sm text-slate-500 line-clamp-2">{material.description}</p>

                      <div className="mb-4 flex items-center gap-4 text-xs text-slate-400">
                        <span>{material.sentences.length} 句</span>
                        <span>{material.wordCount} 词</span>
                        <span>{material.totalDuration}</span>
                      </div>

                      <button
                        onClick={() => setSelectedMaterial(material)}
                        className="w-full rounded-xl bg-gradient-to-r from-primary-500 to-primary-600 py-2.5 text-sm font-semibold text-white shadow-md shadow-primary-200 transition-all hover:shadow-lg hover:from-primary-600 hover:to-primary-700"
                      >
                        开始练习
                      </button>
                    </div>
                  ))}
                </div>

                {filteredMaterials.length === 0 && (
                  <div className="py-16 text-center">
                    <div className="mb-3 text-5xl">🔍</div>
                    <p className="text-slate-500">没有找到匹配的素材</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="rounded-2xl bg-white p-8 shadow-lg border border-slate-100">
                <div className="mb-6 flex items-start justify-between">
                  <div>
                    <div className="mb-2 flex items-center gap-2">
                      <span className={`rounded-full bg-gradient-to-r ${categoryMeta[selectedMaterial.category].color} px-3 py-1 text-xs font-medium text-white`}>
                        {categoryMeta[selectedMaterial.category].emoji} {categoryMeta[selectedMaterial.category].label}
                      </span>
                      <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-500">
                        {selectedMaterial.level}
                      </span>
                      <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${selectedMaterial.accent === 'us' ? 'bg-blue-50 text-blue-600' : 'bg-rose-50 text-rose-600'}`}>
                        {selectedMaterial.accent === 'us' ? '美式' : '英式'}
                      </span>
                    </div>
                    <h2 className="text-2xl font-bold text-slate-800">{selectedMaterial.title}</h2>
                    <p className="mt-1 text-sm text-slate-500">{selectedMaterial.description}</p>
                  </div>
                  <button
                    onClick={() => setSelectedMaterial(null)}
                    className="rounded-full bg-slate-100 px-4 py-2 text-sm font-medium text-slate-500 transition-all hover:bg-slate-200"
                  >
                    换一个
                  </button>
                </div>

                <div className="mb-6 flex items-center gap-6 text-sm text-slate-500">
                  <span>📝 {selectedMaterial.sentences.length} 句</span>
                  <span>📖 {selectedMaterial.wordCount} 词</span>
                  <span>⏱ {selectedMaterial.totalDuration}</span>
                </div>

                <div className="mb-6 rounded-xl bg-slate-50 p-4 max-h-48 overflow-y-auto">
                  {selectedMaterial.sentences.map((s, i) => (
                    <div key={s.id} className="mb-2 last:mb-0">
                      <span className="mr-2 text-xs text-slate-400">{i + 1}.</span>
                      <span className="text-sm text-slate-700">{s.text}</span>
                    </div>
                  ))}
                </div>

                <div className="mb-4 flex items-center gap-3">
                  <span className="text-sm font-medium text-slate-500">语速：</span>
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

                <button
                  onClick={mode === 'realtime' ? handleRealtimeStart : handleSentenceModeStart}
                  className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-primary-500 to-accent-500 py-4 text-lg font-bold text-white shadow-lg shadow-primary-200 transition-all hover:shadow-xl hover:from-primary-600 hover:to-accent-600"
                >
                  {mode === 'realtime' ? <Zap className="h-6 w-6" /> : <List className="h-6 w-6" />}
                  开始跟读
                </button>
              </div>
            )}
          </>
        )}

        {phase === 'practice' && selectedMaterial && mode === 'realtime' && (
          <div className="space-y-4">
            <div className="rounded-2xl bg-white p-4 shadow-sm border border-slate-100">
              <div className="mb-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className={`rounded-full bg-gradient-to-r ${categoryMeta[selectedMaterial.category].color} px-3 py-1 text-xs font-medium text-white`}>
                    {selectedMaterial.title}
                  </span>
                  {isRecording && (
                    <div className="flex items-center gap-2 animate-pulse">
                      <span className="inline-block h-3 w-3 rounded-full bg-rose-500" />
                      <span className="text-sm font-semibold text-rose-500">录音中</span>
                    </div>
                  )}
                </div>
                <span className="text-sm font-medium text-slate-500">
                  {realtimeCurrentSentence + 1} / {selectedMaterial.sentences.length}
                </span>
              </div>
              <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                <div
                  className="h-2 rounded-full bg-gradient-to-r from-primary-400 to-accent-400 transition-all duration-500"
                  style={{ width: `${((realtimeCurrentSentence + 1) / selectedMaterial.sentences.length) * 100}%` }}
                />
              </div>
            </div>

            <div className="rounded-2xl bg-white p-6 shadow-sm border border-slate-100 max-h-[50vh] overflow-y-auto">
              {selectedMaterial.sentences.map((sentence, index) => {
                const isCurrent = index === realtimeCurrentSentence
                const isPast = index < realtimeCurrentSentence
                return (
                  <div
                    key={sentence.id}
                    className={`mb-3 rounded-xl border-l-4 p-4 transition-all duration-500 ${
                      isCurrent
                        ? 'border-l-primary-500 bg-primary-50 scale-105 shadow-md'
                        : isPast
                          ? 'border-l-slate-300 bg-slate-50 opacity-60'
                          : 'border-l-slate-200 bg-slate-50/50 opacity-40'
                    }`}
                  >
                    <div className="flex items-start gap-2">
                      <span className={`text-xs font-bold mt-0.5 ${
                        isCurrent ? 'text-primary-500' : 'text-slate-400'
                      }`}>
                        {index + 1}
                      </span>
                      <div>
                        <p className={`leading-relaxed ${
                          isCurrent ? 'text-lg font-semibold text-slate-800' : 'text-sm text-slate-600'
                        }`}>
                          {sentence.text}
                        </p>
                        {(isCurrent || isPast) && (
                          <p className="mt-1 text-xs text-slate-400">{sentence.translation}</p>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            {(recognizedText || interimText) && (
              <div className="rounded-2xl bg-slate-50 p-4 border border-slate-100">
                <p className="mb-1 text-xs font-medium text-slate-400">实时识别</p>
                <p className="text-sm text-slate-700">
                  {recognizedText}
                  {interimText && <span className="text-slate-400 italic"> {interimText}</span>}
                </p>
              </div>
            )}

            <div className="flex items-center justify-center gap-4">
              <button
                onClick={handleRealtimePause}
                disabled={!isPlaying && !isPaused}
                className="flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-medium text-slate-600 shadow-sm transition-all hover:bg-slate-50 disabled:opacity-40"
              >
                {isPaused ? <Play className="h-5 w-5" /> : <Pause className="h-5 w-5" />}
                {isPaused ? '继续' : '暂停'}
              </button>
              <button
                onClick={handleRealtimeStop}
                className="flex items-center gap-2 rounded-full bg-rose-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-rose-200 transition-all hover:bg-rose-600"
              >
                <Square className="h-5 w-5" />
                结束跟读
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
        )}

        {phase === 'practice' && selectedMaterial && mode === 'sentence' && (
          <div className="space-y-4">
            <div className="rounded-2xl bg-white p-4 shadow-sm border border-slate-100">
              <div className="mb-3 flex items-center justify-between">
                <span className={`rounded-full bg-gradient-to-r ${categoryMeta[selectedMaterial.category].color} px-3 py-1 text-xs font-medium text-white`}>
                  {selectedMaterial.title}
                </span>
                <span className="text-sm font-medium text-slate-500">
                  {currentSentenceIndex + 1} / {selectedMaterial.sentences.length}
                </span>
              </div>
              <div className="flex items-center justify-center gap-1.5">
                {selectedMaterial.sentences.map((_, i) => (
                  <div
                    key={i}
                    className={`h-2 rounded-full transition-all ${
                      i === currentSentenceIndex
                        ? 'w-8 bg-primary-500'
                        : i < currentSentenceIndex
                          ? 'w-2 bg-primary-300'
                          : 'w-2 bg-slate-200'
                    }`}
                  />
                ))}
              </div>
            </div>

            <div className="rounded-2xl bg-white p-8 shadow-sm border border-slate-100 text-center">
              <p className="mb-4 text-2xl font-bold leading-relaxed text-slate-800">
                {selectedMaterial.sentences[currentSentenceIndex].text}
              </p>
              <p className="text-sm text-slate-400">
                {selectedMaterial.sentences[currentSentenceIndex].translation}
              </p>
            </div>

            <div className="flex items-center justify-center gap-4">
              <button
                onClick={playCurrentSentence}
                disabled={isPlaying}
                className="flex h-14 w-14 items-center justify-center rounded-full bg-primary-500 text-white shadow-lg shadow-primary-200 transition-all hover:bg-primary-600 hover:scale-105 disabled:opacity-50"
              >
                <Volume2 className="h-6 w-6" />
              </button>

              {!isRecording ? (
                <button
                  onClick={handleSentenceRecord}
                  disabled={!!currentSentenceScore}
                  className="flex items-center gap-2 rounded-full bg-primary-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-primary-200 transition-all hover:bg-primary-600 disabled:opacity-40"
                >
                  <Mic className="h-5 w-5" />
                  开始录音
                </button>
              ) : (
                <button
                  onClick={stopRecording}
                  className="flex items-center gap-2 rounded-full bg-rose-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-rose-200 transition-all hover:bg-rose-600"
                >
                  <MicOff className="h-5 w-5" />
                  停止录音
                </button>
              )}

              {recognizedText && !currentSentenceScore && !isRecording && (
                <button
                  onClick={handleSentenceSubmit}
                  className="flex items-center gap-2 rounded-full bg-emerald-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-200 transition-all hover:bg-emerald-600"
                >
                  <CheckCircle className="h-5 w-5" />
                  提交
                </button>
              )}
            </div>

            {(recognizedText || interimText) && !currentSentenceScore && (
              <div className="rounded-2xl bg-slate-50 p-4 border border-slate-100">
                <div className="mb-1 flex items-center justify-between">
                  <p className="text-xs font-medium text-slate-400">你的朗读</p>
                  {isRecording && (
                    <div className="flex items-center gap-2 animate-pulse">
                      <span className="inline-block h-2 w-2 rounded-full bg-rose-500" />
                      <span className="text-xs text-rose-500">录音中</span>
                    </div>
                  )}
                </div>
                <p className="text-sm text-slate-700">
                  {recognizedText}
                  {interimText && <span className="text-slate-400 italic"> {interimText}</span>}
                </p>
              </div>
            )}

            {currentSentenceScore && (
              <div className="rounded-2xl bg-white p-6 shadow-sm border border-slate-100 animate-[fadeIn_0.3s_ease-in]">
                <h3 className="mb-4 text-center text-base font-bold text-slate-700">本句评分</h3>
                <div className="mb-4 grid grid-cols-3 gap-3">
                  {dimensionConfig.slice(0, 3).map(dim => (
                    <div key={dim.key} className={`rounded-xl ${dim.track} p-3 text-center`}>
                      <div className={`text-2xl font-bold ${dim.text}`}>
                        {Math.round(currentSentenceScore.scores[dim.key])}
                      </div>
                      <div className="text-xs text-slate-500">{dim.label}</div>
                    </div>
                  ))}
                </div>
                <div className="mb-4 grid grid-cols-3 gap-3">
                  {dimensionConfig.slice(3).map(dim => (
                    <div key={dim.key} className={`rounded-xl ${dim.track} p-3 text-center`}>
                      <div className={`text-2xl font-bold ${dim.text}`}>
                        {Math.round(currentSentenceScore.scores[dim.key])}
                      </div>
                      <div className="text-xs text-slate-500">{dim.label}</div>
                    </div>
                  ))}
                </div>

                <div className="rounded-xl bg-slate-50 p-4">
                  <p className="text-sm leading-relaxed">
                    {currentSentenceScore.wordDetails.map((wd, idx) => (
                      <span key={idx} className={`inline-block mr-1 ${getWordColor(wd.status)}`}>
                        {wd.word}
                      </span>
                    ))}
                  </p>
                </div>
              </div>
            )}

            <div className="flex items-center justify-between">
              <button
                onClick={handleSentencePrev}
                disabled={currentSentenceIndex === 0}
                className="flex items-center gap-1 rounded-full bg-white px-4 py-2 text-sm font-medium text-slate-600 shadow-sm transition-all hover:bg-slate-50 disabled:opacity-40"
              >
                <ChevronLeft className="h-4 w-4" />
                上一句
              </button>

              <div className="flex items-center gap-3">
                <button
                  onClick={handleRetry}
                  className="flex items-center gap-1 rounded-full bg-slate-100 px-4 py-2 text-sm font-medium text-slate-500 transition-all hover:bg-slate-200"
                >
                  <RotateCcw className="h-4 w-4" />
                  重新开始
                </button>

                {currentSentenceIndex === selectedMaterial.sentences.length - 1 && currentSentenceScore ? (
                  <button
                    onClick={handleSentenceFinish}
                    className="flex items-center gap-2 rounded-full bg-gradient-to-r from-primary-500 to-accent-500 px-6 py-2.5 text-sm font-semibold text-white shadow-lg transition-all hover:shadow-xl"
                  >
                    <Award className="h-4 w-4" />
                    查看总评
                  </button>
                ) : currentSentenceScore ? (
                  <button
                    onClick={handleSentenceNext}
                    className="flex items-center gap-1 rounded-full bg-primary-500 px-5 py-2 text-sm font-medium text-white shadow-sm transition-all hover:bg-primary-600"
                  >
                    下一句
                    <ChevronRight className="h-4 w-4" />
                  </button>
                ) : null}
              </div>
            </div>
          </div>
        )}

        {phase === 'result' && overallScore && (
          <div className="space-y-6">
            <div className="rounded-2xl bg-white p-8 shadow-lg border border-slate-100 text-center">
              <h2 className="mb-6 text-xl font-bold text-slate-800">练习结果</h2>

              <div className="mb-8 inline-flex items-center justify-center">
                <div className="relative h-40 w-40">
                  <svg className="h-40 w-40 -rotate-90" viewBox="0 0 120 120">
                    <circle cx="60" cy="60" r="52" fill="none" stroke="#f1f5f9" strokeWidth="10" />
                    <circle
                      cx="60" cy="60" r="52" fill="none"
                      stroke="url(#scoreGradient)" strokeWidth="10"
                      strokeLinecap="round"
                      strokeDasharray={`${(overallScore.overall / 100) * 326.73} 326.73`}
                    />
                    <defs>
                      <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#6366f1" />
                        <stop offset="100%" stopColor="#f59e0b" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-4xl font-extrabold bg-gradient-to-r from-primary-600 to-accent-500 bg-clip-text text-transparent">
                      {Math.round(overallScore.overall)}
                    </span>
                    <span className="text-xs text-slate-400">综合评分</span>
                  </div>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                {dimensionConfig.map(dim => (
                  <div key={dim.key} className="flex items-center gap-3 rounded-xl bg-slate-50 p-3">
                    <div className={`h-8 w-1.5 rounded-full ${dim.color}`} />
                    <div className="flex-1">
                      <div className="mb-1 flex items-center justify-between">
                        <span className="text-sm font-medium text-slate-600">{dim.label}</span>
                        <span className={`text-sm font-bold ${dim.text}`}>
                          {Math.round(overallScore[dim.key])}%
                        </span>
                      </div>
                      <div className={`h-2 w-full rounded-full ${dim.track}`}>
                        <div
                          className={`h-2 rounded-full ${dim.color} transition-all duration-700`}
                          style={{ width: `${Math.round(overallScore[dim.key])}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {overallWordDetails.length > 0 && (
              <div className="rounded-2xl bg-white p-6 shadow-sm border border-slate-100">
                <h3 className="mb-3 text-base font-bold text-slate-700">逐词反馈</h3>
                <div className="rounded-xl bg-slate-50 p-4">
                  <p className="text-sm leading-loose">
                    {overallWordDetails.map((wd, idx) => (
                      <span key={idx} className={`inline-block mr-1.5 ${getWordColor(wd.status)}`}>
                        {wd.word}
                      </span>
                    ))}
                  </p>
                </div>
                <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-slate-500">
                  <span className="flex items-center gap-1">
                    <span className="inline-block h-2.5 w-2.5 rounded bg-emerald-500" /> 正确
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="inline-block h-2.5 w-2.5 rounded bg-rose-500" /> 错误
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="inline-block h-2.5 w-2.5 rounded bg-yellow-500" /> 语调不匹配
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="inline-block h-2.5 w-2.5 rounded bg-slate-400" /> 遗漏
                  </span>
                </div>
              </div>
            )}

            <div className="rounded-2xl bg-gradient-to-r from-primary-500 to-accent-500 p-6 text-center shadow-lg">
              <div className="mb-2 flex items-center justify-center gap-2">
                <Award className="h-6 w-6 text-white" />
                <span className="text-lg font-bold text-white">获得经验值</span>
              </div>
              <span className="text-4xl font-extrabold text-white">+{earnedXp} XP</span>
            </div>

            <div className="flex items-center justify-center gap-4">
              <button
                onClick={handleRetry}
                className="flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-slate-600 shadow-sm transition-all hover:bg-slate-50"
              >
                <RotateCcw className="h-4 w-4" />
                再练一次
              </button>
              <button
                onClick={handleChangeMaterial}
                className="flex items-center gap-2 rounded-full bg-gradient-to-r from-primary-500 to-accent-500 px-6 py-3 text-sm font-semibold text-white shadow-lg transition-all hover:shadow-xl"
              >
                <ArrowRight className="h-4 w-4" />
                换一个素材
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
