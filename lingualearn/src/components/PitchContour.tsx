import { useMemo } from 'react'

interface PitchContourProps {
  targetText: string
  recognizedText: string
  wordDetails: { word: string; status: string; confidence: number }[]
}

const STATUS_BG_COLORS: Record<string, string> = {
  correct: 'rgba(16,185,129,0.05)',
  incorrect: 'rgba(239,68,68,0.05)',
  missed: 'rgba(148,163,184,0.05)',
  extra: 'rgba(245,158,11,0.05)',
  prosody_mismatch: 'rgba(234,179,8,0.05)',
}

function charCodeSum(word: string): number {
  let sum = 0
  for (let i = 0; i < word.length; i++) {
    sum += word.charCodeAt(i)
  }
  return sum
}

function generateTargetPitchData(words: string[]): number[][] {
  const lastWord = words[words.length - 1] || ''
  const endsWithPeriod = lastWord.endsWith('.')
  const endsWithQuestion = lastWord.endsWith('?')
  const endsWithExclamation = lastWord.endsWith('!')

  return words.map((word, i) => {
    const baseFreq = 150 + (charCodeSum(word) % 50)
    const variation = word.length * 3
    let p0 = baseFreq - variation
    let p1 = baseFreq
    let p2 = baseFreq + variation * 0.5

    const isNearEnd = i >= words.length - 2
    if (isNearEnd && endsWithPeriod) {
      p0 *= 0.85
      p1 *= 0.85
      p2 *= 0.8
    }
    if (isNearEnd && endsWithQuestion) {
      p0 *= 1.1
      p1 *= 1.15
      p2 *= 1.2
    }
    if (isNearEnd && endsWithExclamation) {
      p0 *= 1.1
      p1 *= 1.15
      p2 *= 1.15
    }

    return [p0, p1, p2]
  })
}

function generateRecognizedPitchData(
  words: string[],
  wordDetails: { word: string; status: string; confidence: number }[]
): number[][] {
  const targetData = generateTargetPitchData(words)

  return targetData.map((targetPoints, i) => {
    const detail = wordDetails[i]
    let deviation = 0
    if (detail) {
      if (detail.status === 'incorrect') {
        deviation = 20 + ((i * 7 + 13) % 21)
      } else if (detail.status === 'prosody_mismatch') {
        deviation = 30 + ((i * 11 + 7) % 21)
      } else if (detail.status === 'missed') {
        deviation = 15 + ((i * 5 + 3) % 16)
      } else if (detail.status === 'extra') {
        deviation = 10 + ((i * 3 + 9) % 16)
      }
    }

    const sign = i % 2 === 0 ? 1 : -1
    return targetPoints.map(p => p + deviation * sign)
  })
}

function buildSmoothCurvePath(
  pitchData: number[][],
  wordXPositions: number[],
  plotWidth: number,
  plotTop: number,
  plotHeight: number,
  minFreq: number,
  maxFreq: number
): string {
  if (pitchData.length === 0) return ''

  const freqRange = maxFreq - minFreq || 1

  function freqToY(freq: number): number {
    const ratio = (freq - minFreq) / freqRange
    return plotTop + plotHeight - ratio * plotHeight
  }

  const allPoints: { x: number; y: number }[] = []
  for (let i = 0; i < pitchData.length; i++) {
    const xStart = wordXPositions[i]
    const xEnd = i < wordXPositions.length - 1 ? wordXPositions[i + 1] : plotWidth
    const segWidth = xEnd - xStart
    const [p0, p1, p2] = pitchData[i]

    allPoints.push({ x: xStart + segWidth * 0.15, y: freqToY(p0) })
    allPoints.push({ x: xStart + segWidth * 0.5, y: freqToY(p1) })
    allPoints.push({ x: xStart + segWidth * 0.85, y: freqToY(p2) })
  }

  if (allPoints.length < 2) return ''

  let d = `M ${allPoints[0].x} ${allPoints[0].y}`

  for (let i = 1; i < allPoints.length; i++) {
    const prev = allPoints[i - 1]
    const curr = allPoints[i]
    const cpx1 = prev.x + (curr.x - prev.x) * 0.4
    const cpx2 = prev.x + (curr.x - prev.x) * 0.6
    d += ` C ${cpx1} ${prev.y} ${cpx2} ${curr.y} ${curr.x} ${curr.y}`
  }

  return d
}

export default function PitchContour({ targetText, recognizedText, wordDetails }: PitchContourProps) {
  const VIEWBOX_WIDTH = 800
  const VIEWBOX_HEIGHT = 300
  const PADDING_LEFT = 60
  const PADDING_RIGHT = 20
  const PADDING_TOP = 40
  const PADDING_BOTTOM = 60
  const PLOT_WIDTH = VIEWBOX_WIDTH - PADDING_LEFT - PADDING_RIGHT
  const PLOT_HEIGHT = VIEWBOX_HEIGHT - PADDING_TOP - PADDING_BOTTOM
  const PLOT_TOP = PADDING_TOP

  const targetWords = useMemo(
    () => targetText.split(/\s+/).filter(w => w.length > 0),
    [targetText]
  )
  const recognizedWords = useMemo(
    () => recognizedText.split(/\s+/).filter(w => w.length > 0),
    [recognizedText]
  )

  const displayWords = targetWords.length > 0 ? targetWords : recognizedWords

  const targetPitchData = useMemo(() => generateTargetPitchData(displayWords), [displayWords])
  const recognizedPitchData = useMemo(
    () => generateRecognizedPitchData(displayWords, wordDetails),
    [displayWords, wordDetails]
  )

  const allFreqs = useMemo(() => {
    const freqs: number[] = []
    targetPitchData.forEach(pts => freqs.push(...pts))
    recognizedPitchData.forEach(pts => freqs.push(...pts))
    return freqs
  }, [targetPitchData, recognizedPitchData])

  const minFreq = useMemo(() => Math.min(...allFreqs) - 10, [allFreqs])
  const maxFreq = useMemo(() => Math.max(...allFreqs) + 10, [allFreqs])

  const wordXPositions = useMemo(() => {
    const positions: number[] = []
    const step = PLOT_WIDTH / displayWords.length
    for (let i = 0; i < displayWords.length; i++) {
      positions.push(PADDING_LEFT + step * i)
    }
    return positions
  }, [displayWords])

  const targetPath = useMemo(
    () => buildSmoothCurvePath(targetPitchData, wordXPositions, PADDING_LEFT + PLOT_WIDTH, PLOT_TOP, PLOT_HEIGHT, minFreq, maxFreq),
    [targetPitchData, wordXPositions, minFreq, maxFreq]
  )

  const recognizedPath = useMemo(
    () => buildSmoothCurvePath(recognizedPitchData, wordXPositions, PADDING_LEFT + PLOT_WIDTH, PLOT_TOP, PLOT_HEIGHT, minFreq, maxFreq),
    [recognizedPitchData, wordXPositions, minFreq, maxFreq]
  )

  const yTicks = useMemo(() => {
    const ticks: number[] = []
    const range = maxFreq - minFreq
    const step = Math.ceil(range / 5 / 10) * 10
    const start = Math.ceil(minFreq / step) * step
    for (let v = start; v <= maxFreq; v += step) {
      ticks.push(v)
    }
    return ticks
  }, [minFreq, maxFreq])

  function freqToY(freq: number): number {
    const freqRange = maxFreq - minFreq || 1
    const ratio = (freq - minFreq) / freqRange
    return PLOT_TOP + PLOT_HEIGHT - ratio * PLOT_HEIGHT
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
      <div className="mb-4 flex items-center gap-2">
        <svg className="h-5 w-5 text-indigo-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M2 20h2l3-12 4 8 4-16 3 12h2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <h3 className="text-base font-bold text-slate-700">语调曲线</h3>
      </div>

      <svg
        viewBox={`0 0 ${VIEWBOX_WIDTH} ${VIEWBOX_HEIGHT}`}
        className="w-full"
        preserveAspectRatio="xMidYMid meet"
      >
        <text
          x={15}
          y={PLOT_TOP + PLOT_HEIGHT / 2}
          textAnchor="middle"
          dominantBaseline="middle"
          className="fill-slate-500"
          fontSize="11"
          transform={`rotate(-90, 15, ${PLOT_TOP + PLOT_HEIGHT / 2})`}
        >
          音高 (Hz)
        </text>

        {yTicks.map(freq => (
          <g key={freq}>
            <line
              x1={PADDING_LEFT}
              y1={freqToY(freq)}
              x2={PADDING_LEFT + PLOT_WIDTH}
              y2={freqToY(freq)}
              stroke="#e2e8f0"
              strokeWidth="0.5"
              strokeDasharray="4 4"
            />
            <text
              x={PADDING_LEFT - 8}
              y={freqToY(freq)}
              textAnchor="end"
              dominantBaseline="middle"
              className="fill-slate-400"
              fontSize="10"
            >
              {Math.round(freq)}
            </text>
          </g>
        ))}

        {displayWords.map((word, i) => {
          const xStart = wordXPositions[i]
          const xEnd = i < displayWords.length - 1 ? wordXPositions[i + 1] : PADDING_LEFT + PLOT_WIDTH
          const detail = wordDetails[i]
          const bgColor = detail ? STATUS_BG_COLORS[detail.status] || 'transparent' : 'transparent'

          return (
            <g key={i}>
              <rect
                x={xStart}
                y={PLOT_TOP}
                width={xEnd - xStart}
                height={PLOT_HEIGHT}
                fill={bgColor}
              />
              <line
                x1={xStart}
                y1={PLOT_TOP}
                x2={xStart}
                y2={PLOT_TOP + PLOT_HEIGHT}
                stroke="#e2e8f0"
                strokeWidth="0.5"
              />
              <text
                x={xStart + (xEnd - xStart) / 2}
                y={VIEWBOX_HEIGHT - PADDING_BOTTOM + 20}
                textAnchor="middle"
                dominantBaseline="middle"
                className="fill-slate-500"
                fontSize="11"
              >
                {word}
              </text>
            </g>
          )
        })}

        <line
          x1={PADDING_LEFT}
          y1={PLOT_TOP + PLOT_HEIGHT}
          x2={PADDING_LEFT + PLOT_WIDTH}
          y2={PLOT_TOP + PLOT_HEIGHT}
          stroke="#cbd5e1"
          strokeWidth="1"
        />
        <line
          x1={PADDING_LEFT}
          y1={PLOT_TOP}
          x2={PADDING_LEFT}
          y2={PLOT_TOP + PLOT_HEIGHT}
          stroke="#cbd5e1"
          strokeWidth="1"
        />

        <path
          d={targetPath}
          fill="none"
          stroke="#6366f1"
          strokeWidth="2.5"
          strokeDasharray="8 4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        <path
          d={recognizedPath}
          fill="none"
          stroke="#f43f5e"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        <g transform={`translate(${PADDING_LEFT + 10}, ${PLOT_TOP - 25})`}>
          <line x1="0" y1="0" x2="24" y2="0" stroke="#6366f1" strokeWidth="2.5" strokeDasharray="8 4" />
          <text x="30" y="0" dominantBaseline="middle" className="fill-indigo-600" fontSize="11">原声语调</text>

          <line x1="110" y1="0" x2="134" y2="0" stroke="#f43f5e" strokeWidth="2.5" />
          <text x="140" y="0" dominantBaseline="middle" className="fill-rose-500" fontSize="11">你的语调</text>
        </g>
      </svg>
    </div>
  )
}
