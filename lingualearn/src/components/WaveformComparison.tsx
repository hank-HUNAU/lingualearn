import { useMemo } from 'react'
import type { WordDetail } from '../utils/scoringEngine'

interface WaveformComparisonProps {
  targetText: string
  recognizedText: string
  wordDetails: WordDetail[]
  targetDurationMs?: number
  actualDurationMs?: number
}

const STATUS_COLORS: Record<WordDetail['status'], string> = {
  correct: '#10b981',
  incorrect: '#ef4444',
  missed: '#94a3b8',
  extra: '#f59e0b',
  prosody_mismatch: '#eab308',
}

function generateAmplitudes(text: string, sampleCount: number): number[] {
  const amplitudes: number[] = []
  for (let i = 0; i < sampleCount; i++) {
    const charIndex = Math.floor((i / sampleCount) * text.length)
    const charCode = text.charCodeAt(Math.min(charIndex, text.length - 1))
    const nextCharCode = text.charCodeAt(Math.min(charIndex + 1, text.length - 1))
    const base = Math.sin(charCode * 0.3) * 0.5 + Math.cos(charCode * 0.7) * 0.3 + 0.5
    const detail = Math.sin(i * 0.15 + charCode * 0.1) * 0.2
    const variation = Math.cos(nextCharCode * 0.5 + i * 0.08) * 0.1
    amplitudes.push(Math.max(0.05, Math.min(1, base + detail + variation)))
  }
  return amplitudes
}

function buildWaveformPath(amplitudes: number[], width: number, height: number, centerY: number): string {
  if (amplitudes.length === 0) return ''

  const points: { x: number; y: number }[] = []
  const step = width / (amplitudes.length - 1)

  for (let i = 0; i < amplitudes.length; i++) {
    const x = i * step
    const y = centerY - amplitudes[i] * (height / 2)
    points.push({ x, y })
  }

  if (points.length < 2) return `M ${points[0].x} ${points[0].y}`

  let d = `M ${points[0].x} ${points[0].y}`

  for (let i = 1; i < points.length; i++) {
    const prev = points[i - 1]
    const curr = points[i]
    const cpx1 = prev.x + (curr.x - prev.x) * 0.4
    const cpx2 = prev.x + (curr.x - prev.x) * 0.6
    d += ` C ${cpx1} ${prev.y} ${cpx2} ${curr.y} ${curr.x} ${curr.y}`
  }

  for (let i = points.length - 2; i >= 0; i--) {
    const curr = points[i]
    const next = points[i + 1]
    const mirrorY = centerY + (centerY - curr.y)
    const mirrorNextY = centerY + (centerY - next.y)
    const cpx1 = next.x - (next.x - curr.x) * 0.4
    const cpx2 = next.x - (next.x - curr.x) * 0.6
    d += ` C ${cpx1} ${mirrorNextY} ${cpx2} ${mirrorY} ${curr.x} ${mirrorY}`
  }

  d += ' Z'
  return d
}

function buildSegmentPaths(
  amplitudes: number[],
  width: number,
  height: number,
  centerY: number,
  wordDetails: WordDetail[],
  text: string
): { path: string; color: string; status: WordDetail['status'] }[] {
  const words = text.split(/\s+/).filter(w => w.length > 0)
  const totalChars = text.replace(/\s+/g, '').length || 1
  const segments: { path: string; color: string; status: WordDetail['status'] }[] = []

  let charOffset = 0
  for (let w = 0; w < words.length; w++) {
    const word = words[w]
    const wordCharCount = word.length
    const startRatio = charOffset / totalChars
    const endRatio = (charOffset + wordCharCount) / totalChars
    const startSample = Math.floor(startRatio * amplitudes.length)
    const endSample = Math.floor(endRatio * amplitudes.length)

    const segmentAmplitudes = amplitudes.slice(startSample, endSample + 1)
    if (segmentAmplitudes.length < 2) {
      charOffset += wordCharCount + 1
      continue
    }

    const detail = wordDetails[w] || wordDetails[wordDetails.length - 1]
    const status = detail ? detail.status : 'correct'
    const color = STATUS_COLORS[status]

    const segWidth = (endRatio - startRatio) * width
    const path = buildWaveformPath(segmentAmplitudes, segWidth, height, centerY)

    segments.push({ path, color, status })
    charOffset += wordCharCount + 1
  }

  return segments
}

export default function WaveformComparison({
  targetText,
  recognizedText,
  wordDetails,
  targetDurationMs,
  actualDurationMs,
}: WaveformComparisonProps) {
  const SAMPLE_COUNT = 200
  const WAVEFORM_HEIGHT = 80

  const targetAmplitudes = useMemo(
    () => generateAmplitudes(targetText, SAMPLE_COUNT),
    [targetText]
  )

  const recognizedAmplitudes = useMemo(
    () => generateAmplitudes(recognizedText || targetText, SAMPLE_COUNT),
    [recognizedText, targetText]
  )

  const durationScale = useMemo(() => {
    if (targetDurationMs && actualDurationMs && targetDurationMs > 0) {
      return Math.min(2, Math.max(0.3, actualDurationMs / targetDurationMs))
    }
    return 1
  }, [targetDurationMs, actualDurationMs])

  const targetPath = useMemo(
    () => buildWaveformPath(targetAmplitudes, 100, WAVEFORM_HEIGHT, WAVEFORM_HEIGHT / 2),
    [targetAmplitudes]
  )

  const userSegments = useMemo(
    () => buildSegmentPaths(
      recognizedAmplitudes,
      100,
      WAVEFORM_HEIGHT,
      WAVEFORM_HEIGHT / 2,
      wordDetails,
      recognizedText || targetText
    ),
    [recognizedAmplitudes, wordDetails, recognizedText, targetText]
  )

  const targetWords = useMemo(() => targetText.split(/\s+/).filter(w => w.length > 0), [targetText])

  const legendItems: { status: WordDetail['status']; label: string; color: string }[] = [
    { status: 'correct', label: '正确', color: STATUS_COLORS.correct },
    { status: 'incorrect', label: '错误', color: STATUS_COLORS.incorrect },
    { status: 'missed', label: '遗漏', color: STATUS_COLORS.missed },
    { status: 'extra', label: '多余', color: STATUS_COLORS.extra },
    { status: 'prosody_mismatch', label: '语调不匹配', color: STATUS_COLORS.prosody_mismatch },
  ]

  const presentStatuses = new Set(wordDetails.map(wd => wd.status))
  const filteredLegend = legendItems.filter(item => presentStatuses.has(item.status))

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
      <div className="mb-4 flex items-center gap-2">
        <svg className="h-5 w-5 text-indigo-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M2 12h2l3-9 4 18 4-18 3 9h2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <h3 className="text-base font-bold text-slate-700">波形对比</h3>
      </div>

      <div className="space-y-4">
        <div className="flex items-stretch gap-3">
          <div className="flex w-16 shrink-0 items-center justify-center sm:w-20">
            <span className="text-xs font-semibold text-indigo-600 sm:text-sm">原声</span>
          </div>
          <div className="relative flex-1 overflow-hidden rounded-xl bg-gradient-to-b from-indigo-50/80 to-white">
            <svg
              viewBox="0 0 100 80"
              preserveAspectRatio="none"
              className="h-20 w-full sm:h-24"
              style={{ transform: `scaleX(${1 / durationScale > 1 ? 1 : 1})` }}
            >
              <defs>
                <linearGradient id="targetGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#6366f1" stopOpacity="0.7" />
                  <stop offset="100%" stopColor="#6366f1" stopOpacity="0.2" />
                </linearGradient>
              </defs>
              <path d={targetPath} fill="url(#targetGrad)" stroke="#6366f1" strokeWidth="0.3" />
            </svg>
          </div>
        </div>

        <div className="flex items-stretch gap-3">
          <div className="flex w-16 shrink-0 items-center justify-center sm:w-20">
            <span className="text-xs font-semibold text-slate-600 sm:text-sm">你的录音</span>
          </div>
          <div className="relative flex-1 overflow-hidden rounded-xl bg-gradient-to-b from-slate-50/80 to-white">
            <svg
              viewBox="0 0 100 80"
              preserveAspectRatio="none"
              className="h-20 w-full sm:h-24"
            >
              <defs>
                {userSegments.map((seg, i) => (
                  <linearGradient key={i} id={`userGrad-${i}`} x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor={seg.color} stopOpacity="0.7" />
                    <stop offset="100%" stopColor={seg.color} stopOpacity="0.15" />
                  </linearGradient>
                ))}
              </defs>
              {userSegments.map((seg, i) => {
                const words = (recognizedText || targetText).split(/\s+/).filter(w => w.length > 0)
                const totalChars = (recognizedText || targetText).replace(/\s+/g, '').length || 1
                let charOffset = 0
                let xOffset = 0
                for (let w = 0; w < i && w < words.length; w++) {
                  charOffset += words[w].length + 1
                }
                xOffset = (charOffset / totalChars) * 100

                return (
                  <g key={i} transform={`translate(${xOffset}, 0)`}>
                    <path
                      d={seg.path}
                      fill={`url(#userGrad-${i})`}
                      stroke={seg.color}
                      strokeWidth="0.3"
                    />
                  </g>
                )
              })}
            </svg>
          </div>
        </div>
      </div>

      <div className="mt-5 space-y-3">
        <div className="rounded-xl bg-indigo-50/60 px-4 py-3">
          <p className="mb-1 text-xs font-medium text-indigo-400">原声文本</p>
          <p className="text-sm leading-relaxed text-slate-700">
            {targetWords.map((word, i) => (
              <span key={i} className="mr-1.5 inline-block">{word}</span>
            ))}
          </p>
        </div>

        <div className="rounded-xl bg-slate-50 px-4 py-3">
          <p className="mb-1 text-xs font-medium text-slate-400">你的朗读</p>
          <p className="text-sm leading-relaxed">
            {wordDetails.map((wd, i) => (
              <span
                key={i}
                className="mr-1.5 inline-block font-medium"
                style={{ color: STATUS_COLORS[wd.status] }}
              >
                {wd.word}
              </span>
            ))}
          </p>
        </div>
      </div>

      {filteredLegend.length > 0 && (
        <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-slate-100 pt-3">
          <span className="text-xs font-medium text-slate-400">图例：</span>
          {filteredLegend.map(item => (
            <span key={item.status} className="flex items-center gap-1.5 text-xs text-slate-500">
              <span
                className="inline-block h-2.5 w-2.5 rounded-sm"
                style={{ backgroundColor: item.color }}
              />
              {item.label}
            </span>
          ))}
        </div>
      )}

      {targetDurationMs && actualDurationMs && (
        <div className="mt-3 flex items-center gap-4 text-xs text-slate-400">
          <span>原声时长：{(targetDurationMs / 1000).toFixed(1)}s</span>
          <span>录音时长：{(actualDurationMs / 1000).toFixed(1)}s</span>
          {durationScale !== 1 && (
            <span>
              语速比：{durationScale > 1 ? '偏慢' : '偏快'}（{(durationScale * 100).toFixed(0)}%）
            </span>
          )}
        </div>
      )}
    </div>
  )
}
