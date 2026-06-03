export interface SixDimensionScore {
  accuracy: number
  fluency: number
  completeness: number
  prosody: number
  tempo: number
  rhythm: number
  overall: number
}

export interface WordDetail {
  word: string
  status: 'correct' | 'incorrect' | 'missed' | 'extra' | 'prosody_mismatch'
  confidence: number
}

export interface ScoringResult {
  scores: SixDimensionScore
  wordDetails: WordDetail[]
  recognizedText: string
  targetText: string
}

export function normalizeWord(word: string): string {
  return word.toLowerCase().replace(/[^\w]/g, '').trim()
}

export function generateWordDetails(
  targetWords: string[],
  recognizedWords: string[]
): WordDetail[] {
  const details: WordDetail[] = []
  const normalizedTarget = targetWords.map(normalizeWord)
  const normalizedRecognized = recognizedWords.map(normalizeWord)
  const matchedRecognized = new Set<number>()

  const targetMatchIndices: (number | null)[] = new Array(normalizedTarget.length).fill(null)

  for (let i = 0; i < normalizedTarget.length; i++) {
    for (let j = 0; j < normalizedRecognized.length; j++) {
      if (!matchedRecognized.has(j) && normalizedTarget[i] === normalizedRecognized[j]) {
        targetMatchIndices[i] = j
        matchedRecognized.add(j)
        break
      }
    }
  }

  for (let i = 0; i < normalizedTarget.length; i++) {
    if (targetMatchIndices[i] !== null) {
      details.push({
        word: targetWords[i],
        status: 'correct',
        confidence: 0.9
      })
    } else {
      let foundSimilar = false
      for (let j = 0; j < normalizedRecognized.length; j++) {
        if (!matchedRecognized.has(j)) {
          const t = normalizedTarget[i]
          const r = normalizedRecognized[j]
          if (t.length > 0 && r.length > 0) {
            const commonLen = [...t].filter(c => r.includes(c)).length
            const similarity = commonLen / Math.max(t.length, r.length)
            if (similarity >= 0.6) {
              foundSimilar = true
              matchedRecognized.add(j)
              details.push({
                word: targetWords[i],
                status: 'incorrect',
                confidence: 0.6
              })
              break
            }
          }
        }
      }
      if (!foundSimilar) {
        details.push({
          word: targetWords[i],
          status: 'missed',
          confidence: 0.3
        })
      }
    }
  }

  for (let j = 0; j < normalizedRecognized.length; j++) {
    if (!matchedRecognized.has(j)) {
      details.push({
        word: recognizedWords[j],
        status: 'extra',
        confidence: 0.5
      })
    }
  }

  return details
}

export function calculateSixDimensionScore(
  targetText: string,
  recognizedText: string,
  targetDurationMs: number,
  actualDurationMs: number,
  targetWordTimings?: number[],
  recognizedWordTimings?: number[]
): ScoringResult {
  const targetWords = targetText.split(/\s+/).filter(w => w.length > 0)
  const recognizedWords = recognizedText.split(/\s+/).filter(w => w.length > 0)

  const normalizedTarget = targetWords.map(normalizeWord)
  const normalizedRecognized = recognizedWords.map(normalizeWord)

  const matchedRecognized = new Set<number>()
  let matchedTargetCount = 0

  for (let i = 0; i < normalizedTarget.length; i++) {
    for (let j = 0; j < normalizedRecognized.length; j++) {
      if (!matchedRecognized.has(j) && normalizedTarget[i] === normalizedRecognized[j]) {
        matchedTargetCount++
        matchedRecognized.add(j)
        break
      }
    }
  }

  const accuracy = normalizedTarget.length > 0
    ? (matchedTargetCount / normalizedTarget.length) * 100
    : 0

  const extraWordCount = normalizedRecognized.length - matchedRecognized.size
  const fluencyBase = Math.max(0, (1 - extraWordCount / Math.max(normalizedRecognized.length, 1)))
  const lengthPenalty = normalizedTarget.length > 0
    ? Math.min(1, normalizedRecognized.length / normalizedTarget.length)
    : 0
  const fluency = Math.max(0, Math.min(100, fluencyBase * lengthPenalty * accuracy))

  const completeness = normalizedTarget.length > 0
    ? (matchedTargetCount / normalizedTarget.length) * 100
    : 0

  let prosody: number
  if (targetWordTimings && recognizedWordTimings &&
      targetWordTimings.length > 1 && recognizedWordTimings.length > 1) {
    const targetDurations: number[] = []
    for (let i = 1; i < targetWordTimings.length; i++) {
      targetDurations.push(targetWordTimings[i] - targetWordTimings[i - 1])
    }
    const recognizedDurations: number[] = []
    for (let i = 1; i < recognizedWordTimings.length; i++) {
      recognizedDurations.push(recognizedWordTimings[i] - recognizedWordTimings[i - 1])
    }

    const avgTargetDur = targetDurations.reduce((a, b) => a + b, 0) / targetDurations.length
    const avgRecDur = recognizedDurations.reduce((a, b) => a + b, 0) / recognizedDurations.length

    const normalizedTargetDurs = targetDurations.map(d => d / avgTargetDur)
    const normalizedRecDurs = recognizedDurations.map(d => d / avgRecDur)

    const minLen = Math.min(normalizedTargetDurs.length, normalizedRecDurs.length)
    let durationDiffSum = 0
    for (let i = 0; i < minLen; i++) {
      durationDiffSum += Math.abs(normalizedTargetDurs[i] - normalizedRecDurs[i])
    }
    const avgDiff = durationDiffSum / minLen
    prosody = Math.max(0, Math.min(100, 100 - avgDiff * 50))
  } else {
    const questionWords = ['what', 'who', 'where', 'when', 'why', 'how']
    const firstWord = normalizedTarget[0] || ''
    const isQuestion = questionWords.includes(firstWord) || targetText.includes('?')
    const isExclamation = targetText.includes('!')
    const isStatement = targetText.includes('.') || !isQuestion

    let prosodyBase = accuracy * 0.9

    if (isQuestion) {
      const lastMatchedIdx = normalizedTarget.length - 1
      if (lastMatchedIdx >= 0 && matchedTargetCount > 0) {
        prosodyBase = accuracy * 0.95
      }
    }

    if (isExclamation) {
      if (actualDurationMs > 0 && targetDurationMs > 0 && actualDurationMs < targetDurationMs * 0.85) {
        prosodyBase = accuracy * 0.85
      } else {
        prosodyBase = accuracy * 1.0
      }
    }

    if (isStatement && !isQuestion && !isExclamation) {
      prosodyBase = accuracy * 0.92
    }

    const lowerBound = accuracy * 0.8
    const upperBound = Math.min(100, accuracy * 1.1)
    prosody = lowerBound + (prosodyBase - accuracy * 0.8) / (accuracy * 0.3 || 1) * (upperBound - lowerBound)
    prosody = Math.max(lowerBound, Math.min(upperBound, prosody))
  }

  let tempo: number
  if (targetDurationMs > 0 && actualDurationMs > 0) {
    tempo = Math.max(0, 100 - Math.abs(targetDurationMs - actualDurationMs) / targetDurationMs * 100 * 2)
    tempo = Math.min(100, tempo)
  } else {
    const targetWordCount = normalizedTarget.length
    const recognizedWordCount = normalizedRecognized.length
    if (targetWordCount > 0) {
      const ratio = recognizedWordCount / targetWordCount
      tempo = Math.max(0, Math.min(100, (1 - Math.abs(1 - ratio)) * 100))
    } else {
      tempo = 0
    }
  }

  let rhythm: number
  if (targetWordTimings && recognizedWordTimings &&
      targetWordTimings.length > 2 && recognizedWordTimings.length > 2) {
    const targetPauses: number[] = []
    for (let i = 1; i < targetWordTimings.length; i++) {
      targetPauses.push(targetWordTimings[i] - targetWordTimings[i - 1])
    }
    const recognizedPauses: number[] = []
    for (let i = 1; i < recognizedWordTimings.length; i++) {
      recognizedPauses.push(recognizedWordTimings[i] - recognizedWordTimings[i - 1])
    }

    const avgTargetPause = targetPauses.reduce((a, b) => a + b, 0) / targetPauses.length
    const avgRecPause = recognizedPauses.reduce((a, b) => a + b, 0) / recognizedPauses.length

    const targetPausePattern = targetPauses.map(p => p > avgTargetPause * 1.5 ? 1 : 0)
    const recognizedPausePattern = recognizedPauses.map(p => p > avgRecPause * 1.5 ? 1 : 0)

    const minPatternLen = Math.min(targetPausePattern.length, recognizedPausePattern.length)
    let matchCount = 0
    for (let i = 0; i < minPatternLen; i++) {
      if (targetPausePattern[i] === recognizedPausePattern[i]) {
        matchCount++
      }
    }
    rhythm = minPatternLen > 0 ? (matchCount / minPatternLen) * 100 : 50
  } else {
    const punctuationPattern = targetText.match(/[,.;:!?]/g)
    const pauseCount = punctuationPattern ? punctuationPattern.length : 0
    const sentenceCount = targetText.split(/[.!?]+/).filter(s => s.trim().length > 0).length

    const expectedPauseGroups = pauseCount + sentenceCount
    const recognizedWordGroups = recognizedText.split(/\s+/).filter(w => w.length > 0).length

    let rhythmBase: number
    if (expectedPauseGroups > 0 && normalizedTarget.length > 0) {
      const wordsPerGroup = normalizedTarget.length / expectedPauseGroups
      const recWordsPerGroup = recognizedWordGroups / Math.max(expectedPauseGroups, 1)
      const groupRatio = wordsPerGroup > 0
        ? 1 - Math.abs(1 - recWordsPerGroup / wordsPerGroup)
        : 0.5
      rhythmBase = completeness * groupRatio
    } else {
      rhythmBase = completeness * 0.9
    }

    const lowerBound = completeness * 0.85
    const upperBound = Math.min(100, completeness * 1.05)
    rhythm = lowerBound + (rhythmBase - completeness * 0.85) / (completeness * 0.2 || 1) * (upperBound - lowerBound)
    rhythm = Math.max(lowerBound, Math.min(upperBound, rhythm))
  }

  const overall = (
    accuracy * 0.20 +
    fluency * 0.15 +
    completeness * 0.15 +
    prosody * 0.20 +
    tempo * 0.15 +
    rhythm * 0.15
  )

  const scores: SixDimensionScore = {
    accuracy: Math.round(accuracy * 100) / 100,
    fluency: Math.round(fluency * 100) / 100,
    completeness: Math.round(completeness * 100) / 100,
    prosody: Math.round(prosody * 100) / 100,
    tempo: Math.round(tempo * 100) / 100,
    rhythm: Math.round(rhythm * 100) / 100,
    overall: Math.round(overall * 100) / 100
  }

  const wordDetails = generateWordDetails(targetWords, recognizedWords)

  return {
    scores,
    wordDetails,
    recognizedText,
    targetText
  }
}
