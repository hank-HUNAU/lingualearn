import { useState, useMemo, useCallback } from 'react';
import { ChevronLeft, ChevronRight, RotateCcw, Check, RefreshCw, Volume2 } from 'lucide-react';
import { vocabulary } from '../data/vocabulary';
import { useLearning } from '../context/LearningContext';

const categories = [
  { key: '全部', emoji: '📚' },
  { key: '日常', emoji: '🏠' },
  { key: '旅行', emoji: '✈️' },
  { key: '商务', emoji: '💼' },
  { key: '学术', emoji: '🎓' },
];

const levels = ['全部', 'A1', 'A2', 'B1', 'B2', 'C1', 'C2'];

export default function Vocabulary() {
  const [categoryFilter, setCategoryFilter] = useState('全部');
  const [levelFilter, setLevelFilter] = useState('全部');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const { progress, masterVocabulary, addXp } = useLearning();

  const filteredWords = useMemo(() => {
    return vocabulary.filter((word) => {
      const matchCategory = categoryFilter === '全部' || word.category === categoryFilter;
      const matchLevel = levelFilter === '全部' || word.level === levelFilter;
      return matchCategory && matchLevel;
    });
  }, [categoryFilter, levelFilter]);

  const currentWord = filteredWords[currentIndex];

  const isMastered = (wordId: string) => progress.vocabularyMastered.includes(wordId);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handleNext = () => {
    if (currentIndex < filteredWords.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setIsFlipped(false);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setIsFlipped(false);
    }
  };

  const handleMastered = () => {
    if (currentWord) {
      masterVocabulary(currentWord.id);
      addXp(10);
      handleNext();
    }
  };

  const handleReview = () => {
    if (currentWord) {
      handleNext();
    }
  };

  const handleReset = () => {
    setCurrentIndex(0);
    setIsFlipped(false);
  };

  const handleFilterChange = (type: 'category' | 'level', value: string) => {
    if (type === 'category') {
      setCategoryFilter(value);
    } else {
      setLevelFilter(value);
    }
    setCurrentIndex(0);
    setIsFlipped(false);
  };

  const playWordAudio = useCallback((word: string) => {
    if (!word) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(word);
    utterance.lang = 'en-US';
    utterance.rate = playbackSpeed;
    utterance.onstart = () => setIsPlaying(true);
    utterance.onend = () => setIsPlaying(false);
    utterance.onerror = () => setIsPlaying(false);
    window.speechSynthesis.speak(utterance);
  }, [playbackSpeed]);

  const playExampleAudio = useCallback((example: string) => {
    if (!example) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(example);
    utterance.lang = 'en-US';
    utterance.rate = playbackSpeed;
    utterance.onstart = () => setIsPlaying(true);
    utterance.onend = () => setIsPlaying(false);
    utterance.onerror = () => setIsPlaying(false);
    window.speechSynthesis.speak(utterance);
  }, [playbackSpeed]);

  if (filteredWords.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-purple-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold text-slate-800 mb-2">词汇记忆</h1>
          <p className="text-slate-500 mb-8">听音拼写，高效记忆</p>

          <div className="flex flex-wrap gap-3 mb-4">
            {categories.map((cat) => (
              <button
                key={cat.key}
                onClick={() => handleFilterChange('category', cat.key)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  categoryFilter === cat.key
                    ? 'bg-purple-600 text-white shadow-md'
                    : 'bg-white text-slate-600 border border-slate-200 hover:border-purple-300'
                }`}
              >
                <span>{cat.emoji}</span>
                {cat.key}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap gap-2 mb-8">
            {levels.map((level) => (
              <button
                key={level}
                onClick={() => handleFilterChange('level', level)}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-all ${
                  levelFilter === level
                    ? 'bg-indigo-600 text-white'
                    : 'bg-white text-slate-500 border border-slate-200 hover:border-indigo-300'
                }`}
              >
                {level}
              </button>
            ))}
          </div>

          <div className="text-center py-20">
            <div className="text-6xl mb-4">📭</div>
            <h3 className="text-xl font-semibold text-slate-600 mb-2">暂无匹配的词汇</h3>
            <p className="text-slate-400">试试调整筛选条件</p>
          </div>
        </div>
      </div>
    );
  }

  const masteredCount = progress.vocabularyMastered.filter((id) =>
    filteredWords.some((w) => w.id === id)
  ).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-purple-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-800 mb-2">词汇记忆</h1>
          <p className="text-slate-500">听音拼写，高效记忆</p>
        </div>

        <div className="flex flex-wrap gap-3 mb-4">
          {categories.map((cat) => (
            <button
              key={cat.key}
              onClick={() => handleFilterChange('category', cat.key)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                categoryFilter === cat.key
                  ? 'bg-purple-600 text-white shadow-md shadow-purple-200'
                  : 'bg-white text-slate-600 border border-slate-200 hover:border-purple-300'
              }`}
            >
              <span>{cat.emoji}</span>
              {cat.key}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap gap-2 mb-8">
          {levels.map((level) => (
            <button
              key={level}
              onClick={() => handleFilterChange('level', level)}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-all ${
                levelFilter === level
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200'
                  : 'bg-white text-slate-500 border border-slate-200 hover:border-indigo-300'
              }`}
            >
              {level}
            </button>
          ))}
        </div>

        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <span className="text-sm text-slate-500">
              第 <span className="font-bold text-slate-700">{currentIndex + 1}</span> / {filteredWords.length} 个
            </span>
            <span className="text-sm text-slate-400">|</span>
            <span className="text-sm text-green-600">
              已掌握 {masteredCount}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 rounded-full bg-white border border-slate-200 px-2 py-1">
              {([0.5, 0.75, 1, 1.25] as const).map((speed) => (
                <button
                  key={speed}
                  onClick={() => setPlaybackSpeed(speed)}
                  className={`rounded-full px-2 py-0.5 text-xs font-medium transition-all ${
                    playbackSpeed === speed
                      ? 'bg-purple-100 text-purple-700'
                      : 'text-slate-400 hover:text-slate-600'
                  }`}
                >
                  {speed}x
                </button>
              ))}
            </div>
            <button
              onClick={handleReset}
              className="flex items-center gap-1 text-sm text-slate-400 hover:text-slate-600 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              重置
            </button>
          </div>
        </div>

        <div className="w-full bg-slate-200 rounded-full h-1.5 mb-8">
          <div
            className="bg-purple-500 h-1.5 rounded-full transition-all duration-500"
            style={{ width: `${((currentIndex + 1) / filteredWords.length) * 100}%` }}
          />
        </div>

        <div className="flex items-center justify-center gap-4 mb-8">
          <button
            onClick={handlePrev}
            disabled={currentIndex === 0}
            className="w-12 h-12 flex items-center justify-center rounded-full bg-white border border-slate-200 text-slate-500 hover:text-purple-600 hover:border-purple-300 disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-sm"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <div
            onClick={handleFlip}
            className="w-80 h-96 sm:w-96 sm:h-[28rem] cursor-pointer"
          >
            <div
              className="relative w-full h-full transition-transform duration-500"
              style={{
                transformStyle: 'preserve-3d',
                transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
              }}
            >
              <div
                className="absolute inset-0 bg-white rounded-3xl border border-slate-100 shadow-lg flex flex-col items-center justify-center p-8"
                style={{ backfaceVisibility: 'hidden' }}
              >
                <div className="flex gap-2 mb-6">
                  <span className="bg-purple-100 text-purple-600 text-xs font-medium px-3 py-1 rounded-full">
                    {currentWord?.category}
                  </span>
                  <span className="bg-blue-100 text-blue-600 text-xs font-medium px-3 py-1 rounded-full">
                    {currentWord?.level}
                  </span>
                  {currentWord && isMastered(currentWord.id) && (
                    <span className="bg-green-100 text-green-600 text-xs font-medium px-3 py-1 rounded-full">
                      已掌握
                    </span>
                  )}
                </div>
                <span className="text-5xl font-bold text-slate-800 mb-4">{currentWord?.word}</span>
                <span className="text-xl text-slate-400 mb-6">{currentWord?.phonetic}</span>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (currentWord) playWordAudio(currentWord.word);
                  }}
                  disabled={isPlaying}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-purple-50 text-purple-600 border border-purple-200 hover:bg-purple-100 transition-all mb-4 disabled:opacity-50"
                >
                  <Volume2 className="w-4 h-4" />
                  播放发音
                </button>

                <div className="flex items-center gap-2 text-slate-300">
                  <RefreshCw className="w-4 h-4" />
                  <span className="text-sm">点击翻转查看释义</span>
                </div>
              </div>

              <div
                className="absolute inset-0 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-3xl shadow-lg flex flex-col items-center justify-center p-8"
                style={{
                  backfaceVisibility: 'hidden',
                  transform: 'rotateY(180deg)',
                }}
              >
                <span className="text-3xl font-bold text-white mb-3">{currentWord?.meaning}</span>
                <div className="w-16 h-0.5 bg-white/30 mb-6" />
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-5 max-w-sm mb-4">
                  <p className="text-white/90 text-base mb-2">{currentWord?.example}</p>
                  <p className="text-white/60 text-sm">{currentWord?.exampleTranslation}</p>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (currentWord) playExampleAudio(currentWord.example);
                  }}
                  disabled={isPlaying}
                  className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 text-white/80 hover:bg-white/20 transition-all text-sm disabled:opacity-50"
                >
                  <Volume2 className="w-4 h-4" />
                  播放例句
                </button>
                <div className="flex items-center gap-2 text-white/40 mt-4">
                  <RefreshCw className="w-4 h-4" />
                  <span className="text-sm">点击翻转回正面</span>
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={handleNext}
            disabled={currentIndex === filteredWords.length - 1}
            className="w-12 h-12 flex items-center justify-center rounded-full bg-white border border-slate-200 text-slate-500 hover:text-purple-600 hover:border-purple-300 disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-sm"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>

        <div className="flex justify-center gap-4">
          <button
            onClick={handleReview}
            className="flex items-center gap-2 px-8 py-3 bg-amber-50 text-amber-600 border border-amber-200 rounded-xl font-medium hover:bg-amber-100 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            需复习
          </button>
          <button
            onClick={handleMastered}
            disabled={currentWord ? isMastered(currentWord.id) : false}
            className="flex items-center gap-2 px-8 py-3 bg-green-50 text-green-600 border border-green-200 rounded-xl font-medium hover:bg-green-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Check className="w-4 h-4" />
            {currentWord && isMastered(currentWord.id) ? '已掌握' : '已掌握'}
          </button>
        </div>
      </div>
    </div>
  );
}
