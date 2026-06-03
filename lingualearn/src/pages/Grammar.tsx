import { useState, useMemo, useEffect } from 'react';
import { CheckCircle, XCircle, ChevronRight, RotateCcw, Trophy } from 'lucide-react';
import { grammarExercises } from '../data/grammar';
import { useLearning } from '../context/LearningContext';

const levels = ['全部', 'A1', 'A2', 'B1', 'B2', 'C1', 'C2'];

export default function Grammar() {
  const [levelFilter, setLevelFilter] = useState('全部');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string>('');
  const [fillBlankAnswer, setFillBlankAnswer] = useState('');
  const [sentenceOrderWords, setSentenceOrderWords] = useState<string[]>([]);
  const [shuffledOptions, setShuffledOptions] = useState<string[]>([]);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [score, setScore] = useState({ correct: 0, total: 0 });
  const { addXp, updateProgress } = useLearning();

  const filteredExercises = useMemo(() => {
    return grammarExercises.filter(
      (ex) => levelFilter === '全部' || ex.level === levelFilter
    );
  }, [levelFilter]);

  const currentExercise = filteredExercises[currentIndex];

  useEffect(() => {
    if (currentExercise?.type === 'sentence-order') {
      const shuffled = [...currentExercise.options].sort(() => Math.random() - 0.5);
      setShuffledOptions(shuffled);
    }
  }, [currentExercise]);

  const resetExercise = () => {
    setSelectedAnswer('');
    setFillBlankAnswer('');
    setSentenceOrderWords([]);
    setIsSubmitted(false);
    setIsCorrect(false);
  };

  const handleLevelChange = (level: string) => {
    setLevelFilter(level);
    setCurrentIndex(0);
    resetExercise();
  };

  const checkAnswer = () => {
    if (!currentExercise) return;

    let correct = false;

    if (currentExercise.type === 'fill-blank') {
      correct = fillBlankAnswer.trim().toLowerCase() === currentExercise.answer.toLowerCase();
    } else if (currentExercise.type === 'choice') {
      correct = selectedAnswer === currentExercise.answer;
    } else if (currentExercise.type === 'sentence-order') {
      const userSentence = sentenceOrderWords.join(' ').replace(/[.,!?;:'"]/g, '').trim();
      const answerSentence = currentExercise.answer.replace(/[.,!?;:'"]/g, '').trim();
      correct = userSentence.toLowerCase() === answerSentence.toLowerCase();
    }

    setIsCorrect(correct);
    setIsSubmitted(true);
    setScore((prev) => ({
      correct: prev.correct + (correct ? 1 : 0),
      total: prev.total + 1,
    }));

    if (correct) {
      addXp(15);
      const newGrammarScore = Math.min(100, Math.round(((score.correct + 1) / (score.total + 1)) * 100));
      updateProgress({ grammarScore: newGrammarScore });
    }
  };

  const handleNext = () => {
    if (currentIndex < filteredExercises.length - 1) {
      setCurrentIndex(currentIndex + 1);
      resetExercise();
    }
  };

  const handleSentenceWordClick = (word: string) => {
    if (isSubmitted) return;
    setSentenceOrderWords((prev) => [...prev, word]);
  };

  const handleRemoveSentenceWord = (index: number) => {
    if (isSubmitted) return;
    setSentenceOrderWords((prev) => prev.filter((_, i) => i !== index));
  };

  const handleResetAll = () => {
    setCurrentIndex(0);
    resetExercise();
    setScore({ correct: 0, total: 0 });
  };

  if (filteredExercises.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-emerald-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold text-slate-800 mb-2">语法练习</h1>
          <p className="text-slate-500 mb-8">通过练习巩固语法知识</p>

          <div className="flex flex-wrap gap-2 mb-8">
            {levels.map((level) => (
              <button
                key={level}
                onClick={() => handleLevelChange(level)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                  levelFilter === level
                    ? 'bg-emerald-600 text-white shadow-md'
                    : 'bg-white text-slate-500 border border-slate-200 hover:border-emerald-300'
                }`}
              >
                {level}
              </button>
            ))}
          </div>

          <div className="text-center py-20">
            <div className="text-6xl mb-4">📭</div>
            <h3 className="text-xl font-semibold text-slate-600 mb-2">暂无匹配的练习</h3>
            <p className="text-slate-400">试试调整等级筛选</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-emerald-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-800 mb-2">语法练习</h1>
            <p className="text-slate-500">通过练习巩固语法知识</p>
          </div>
          <button
            onClick={handleResetAll}
            className="flex items-center gap-1 text-sm text-slate-400 hover:text-slate-600 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            重置
          </button>
        </div>

        <div className="flex flex-wrap gap-2 mb-6">
          {levels.map((level) => (
            <button
              key={level}
              onClick={() => handleLevelChange(level)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                levelFilter === level
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-200'
                  : 'bg-white text-slate-500 border border-slate-200 hover:border-emerald-300'
              }`}
            >
              {level}
            </button>
          ))}
        </div>

        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <span className="text-sm text-slate-500">
              第 <span className="font-bold text-slate-700">{currentIndex + 1}</span> / {filteredExercises.length} 题
            </span>
            <div className="flex items-center gap-1 text-sm">
              <Trophy className="w-4 h-4 text-amber-500" />
              <span className="text-slate-600 font-medium">
                {score.correct} / {score.total}
              </span>
            </div>
          </div>
          {score.total > 0 && (
            <span className="text-sm text-emerald-600 font-medium">
              正确率 {Math.round((score.correct / score.total) * 100)}%
            </span>
          )}
        </div>

        <div className="w-full bg-slate-200 rounded-full h-1.5 mb-8">
          <div
            className="bg-emerald-500 h-1.5 rounded-full transition-all duration-500"
            style={{ width: `${((currentIndex + 1) / filteredExercises.length) * 100}%` }}
          />
        </div>

        {currentExercise && (
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100">
              <div className="flex items-center gap-2 mb-3">
                <span className="bg-emerald-100 text-emerald-600 text-xs font-medium px-3 py-1 rounded-full">
                  {currentExercise.level}
                </span>
                <span className="bg-blue-100 text-blue-600 text-xs font-medium px-3 py-1 rounded-full">
                  {currentExercise.type === 'fill-blank'
                    ? '填空题'
                    : currentExercise.type === 'choice'
                    ? '选择题'
                    : '排序题'}
                </span>
              </div>
              <h2 className="text-xl font-bold text-slate-800 mb-1">{currentExercise.title}</h2>
              <p className="text-sm text-slate-500">{currentExercise.description}</p>
            </div>

            <div className="p-6">
              <div className="bg-slate-50 rounded-xl p-5 mb-6">
                <p className="text-lg text-slate-700 font-medium">{currentExercise.question}</p>
              </div>

              {currentExercise.type === 'fill-blank' && (
                <div className="mb-6">
                  <input
                    type="text"
                    value={fillBlankAnswer}
                    onChange={(e) => setFillBlankAnswer(e.target.value)}
                    disabled={isSubmitted}
                    placeholder="请输入你的答案..."
                    className="w-full px-4 py-3 bg-white rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent text-slate-700 placeholder-slate-400 disabled:bg-slate-50 disabled:text-slate-400"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !isSubmitted && fillBlankAnswer.trim()) {
                        checkAnswer();
                      }
                    }}
                  />
                  <div className="mt-3 flex flex-wrap gap-2">
                    {currentExercise.options.map((opt) => (
                      <button
                        key={opt}
                        onClick={() => {
                          if (!isSubmitted) setFillBlankAnswer(opt);
                        }}
                        disabled={isSubmitted}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                          fillBlankAnswer === opt
                            ? 'bg-emerald-100 text-emerald-700 border border-emerald-300'
                            : 'bg-white text-slate-600 border border-slate-200 hover:border-emerald-300'
                        } disabled:cursor-not-allowed`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {currentExercise.type === 'choice' && (
                <div className="space-y-3 mb-6">
                  {currentExercise.options.map((option) => (
                    <button
                      key={option}
                      onClick={() => {
                        if (!isSubmitted) setSelectedAnswer(option);
                      }}
                      disabled={isSubmitted}
                      className={`w-full text-left px-5 py-3.5 rounded-xl border transition-all ${
                        isSubmitted
                          ? option === currentExercise.answer
                            ? 'bg-green-50 border-green-300 text-green-700'
                            : selectedAnswer === option
                            ? 'bg-red-50 border-red-300 text-red-700'
                            : 'bg-white border-slate-200 text-slate-400'
                          : selectedAnswer === option
                          ? 'bg-emerald-50 border-emerald-300 text-emerald-700'
                          : 'bg-white border-slate-200 text-slate-600 hover:border-emerald-300'
                      } disabled:cursor-not-allowed`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                            isSubmitted
                              ? option === currentExercise.answer
                                ? 'border-green-500 bg-green-500'
                                : selectedAnswer === option
                                ? 'border-red-500 bg-red-500'
                                : 'border-slate-300'
                              : selectedAnswer === option
                              ? 'border-emerald-500 bg-emerald-500'
                              : 'border-slate-300'
                          }`}
                        >
                          {(selectedAnswer === option || (isSubmitted && option === currentExercise.answer)) && (
                            <div className="w-2 h-2 rounded-full bg-white" />
                          )}
                        </div>
                        <span className="text-sm font-medium">{option}</span>
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {currentExercise.type === 'sentence-order' && (
                <div className="mb-6">
                  <div className="min-h-[60px] bg-slate-50 rounded-xl p-4 mb-4 flex flex-wrap gap-2">
                    {sentenceOrderWords.length === 0 ? (
                      <span className="text-slate-400 text-sm">点击下方单词按顺序组成句子...</span>
                    ) : (
                      sentenceOrderWords.map((word, index) => (
                        <button
                          key={`${word}-${index}`}
                          onClick={() => handleRemoveSentenceWord(index)}
                          disabled={isSubmitted}
                          className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                            isSubmitted
                              ? 'bg-emerald-100 text-emerald-700 border border-emerald-300'
                              : 'bg-white text-slate-700 border border-slate-200 hover:border-red-300 hover:text-red-500 shadow-sm'
                          } disabled:cursor-not-allowed`}
                        >
                          {word}
                        </button>
                      ))
                    )}
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {shuffledOptions.map((word, idx) => {
                      const usedCount = sentenceOrderWords.filter((w) => w === word).length;
                      const totalCount = currentExercise.options.filter((o) => o === word).length;
                      const isUsed = usedCount >= totalCount;

                      return (
                        <button
                          key={`${word}-${idx}`}
                          onClick={() => handleSentenceWordClick(word)}
                          disabled={isSubmitted || isUsed}
                          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                            isUsed
                              ? 'bg-slate-100 text-slate-300 border border-slate-100'
                              : 'bg-white text-slate-700 border border-slate-200 hover:border-emerald-300 hover:text-emerald-600 shadow-sm'
                          } disabled:cursor-not-allowed`}
                        >
                          {word}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {isSubmitted && (
                <div
                  className={`rounded-xl p-5 mb-6 ${
                    isCorrect ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    {isCorrect ? (
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-500" />
                    )}
                    <span className={`font-semibold ${isCorrect ? 'text-green-700' : 'text-red-700'}`}>
                      {isCorrect ? '回答正确！' : '回答错误'}
                    </span>
                  </div>
                  {!isCorrect && (
                    <p className="text-sm text-red-600 mb-2">
                      正确答案：<span className="font-medium">{currentExercise.answer}</span>
                    </p>
                  )}
                  <p className="text-sm text-slate-600">{currentExercise.explanation}</p>
                </div>
              )}

              <div className="flex justify-end gap-3">
                {!isSubmitted ? (
                  <button
                    onClick={checkAnswer}
                    disabled={
                      currentExercise.type === 'fill-blank'
                        ? !fillBlankAnswer.trim()
                        : currentExercise.type === 'choice'
                        ? !selectedAnswer
                        : sentenceOrderWords.length === 0
                    }
                    className="flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-xl font-medium hover:bg-emerald-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    提交答案
                  </button>
                ) : (
                  currentIndex < filteredExercises.length - 1 && (
                    <button
                      onClick={handleNext}
                      className="flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-xl font-medium hover:bg-emerald-700 transition-colors"
                    >
                      下一题
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  )
                )}
              </div>
            </div>
          </div>
        )}

        {isSubmitted && currentIndex === filteredExercises.length - 1 && (
          <div className="mt-8 bg-white rounded-2xl border border-slate-100 shadow-sm p-8 text-center">
            <div className="text-5xl mb-4">
              {score.correct / score.total >= 0.8 ? '🎉' : score.correct / score.total >= 0.5 ? '👍' : '💪'}
            </div>
            <h3 className="text-2xl font-bold text-slate-800 mb-2">练习完成！</h3>
            <p className="text-slate-500 mb-4">
              你答对了 {score.correct} / {score.total} 题，正确率 {Math.round((score.correct / score.total) * 100)}%
            </p>
            <button
              onClick={handleResetAll}
              className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-xl font-medium hover:bg-emerald-700 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              再来一次
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
