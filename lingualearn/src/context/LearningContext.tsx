import { createContext, useContext, useState, useEffect, useCallback } from "react";
import type { ReactNode } from "react";

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt: string | null;
}

export interface LearningProgress {
  completedLessons: string[];
  vocabularyMastered: string[];
  grammarScore: number;
  listeningScore: number;
  speakingScore: number;
  dailyGoal: number;
  dailyProgress: number;
  streak: number;
  xp: number;
  achievements: Achievement[];
  lastStudyDate: string | null;
}

interface LearningContextType {
  progress: LearningProgress;
  updateProgress: (updates: Partial<LearningProgress>) => void;
  addXp: (amount: number) => void;
  completeLesson: (lessonId: string, xpReward?: number) => void;
  masterVocabulary: (wordId: string) => void;
  resetProgress: () => void;
}

const LEARNING_STORAGE_KEY = "lingualearn_progress";

const defaultAchievements: Achievement[] = [
  { id: "ach_001", title: "初出茅庐", description: "完成第一节课", icon: "🎯", unlockedAt: null },
  { id: "ach_002", title: "词汇新手", description: "掌握10个单词", icon: "📖", unlockedAt: null },
  { id: "ach_003", title: "词汇达人", description: "掌握50个单词", icon: "📚", unlockedAt: null },
  { id: "ach_004", title: "连续学习", description: "连续学习3天", icon: "🔥", unlockedAt: null },
  { id: "ach_005", title: "坚持不懈", description: "连续学习7天", icon: "💪", unlockedAt: null },
  { id: "ach_006", title: "学习狂人", description: "连续学习30天", icon: "🏆", unlockedAt: null },
  { id: "ach_007", title: "百分达人", description: "累计获得100经验值", icon: "⭐", unlockedAt: null },
  { id: "ach_008", title: "千分大师", description: "累计获得1000经验值", icon: "🌟", unlockedAt: null },
  { id: "ach_009", title: "语法新星", description: "语法得分达到80分", icon: "✨", unlockedAt: null },
  { id: "ach_010", title: "全能学者", description: "所有技能得分超过70分", icon: "🎓", unlockedAt: null },
];

const defaultProgress: LearningProgress = {
  completedLessons: [],
  vocabularyMastered: [],
  grammarScore: 0,
  listeningScore: 0,
  speakingScore: 0,
  dailyGoal: 30,
  dailyProgress: 0,
  streak: 0,
  xp: 0,
  achievements: defaultAchievements,
  lastStudyDate: null,
};

const LearningContext = createContext<LearningContextType>({
  progress: defaultProgress,
  updateProgress: () => {},
  addXp: () => {},
  completeLesson: () => {},
  masterVocabulary: () => {},
  resetProgress: () => {},
});

function checkAchievements(progress: LearningProgress): LearningProgress {
  const updatedAchievements = progress.achievements.map((ach) => {
    if (ach.unlockedAt) return ach;

    const today = new Date().toISOString().split("T")[0];

    switch (ach.id) {
      case "ach_001":
        if (progress.completedLessons.length >= 1) return { ...ach, unlockedAt: today };
        break;
      case "ach_002":
        if (progress.vocabularyMastered.length >= 10) return { ...ach, unlockedAt: today };
        break;
      case "ach_003":
        if (progress.vocabularyMastered.length >= 50) return { ...ach, unlockedAt: today };
        break;
      case "ach_004":
        if (progress.streak >= 3) return { ...ach, unlockedAt: today };
        break;
      case "ach_005":
        if (progress.streak >= 7) return { ...ach, unlockedAt: today };
        break;
      case "ach_006":
        if (progress.streak >= 30) return { ...ach, unlockedAt: today };
        break;
      case "ach_007":
        if (progress.xp >= 100) return { ...ach, unlockedAt: today };
        break;
      case "ach_008":
        if (progress.xp >= 1000) return { ...ach, unlockedAt: today };
        break;
      case "ach_009":
        if (progress.grammarScore >= 80) return { ...ach, unlockedAt: today };
        break;
      case "ach_010":
        if (
          progress.grammarScore >= 70 &&
          progress.listeningScore >= 70 &&
          progress.speakingScore >= 70
        )
          return { ...ach, unlockedAt: today };
        break;
    }

    return ach;
  });

  return { ...progress, achievements: updatedAchievements };
}

function updateStreak(progress: LearningProgress): LearningProgress {
  const today = new Date().toISOString().split("T")[0];

  if (progress.lastStudyDate === today) {
    return progress;
  }

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().split("T")[0];

  const newStreak = progress.lastStudyDate === yesterdayStr ? progress.streak + 1 : 1;

  return {
    ...progress,
    streak: newStreak,
    lastStudyDate: today,
    dailyProgress: 0,
  };
}

export function LearningProvider({ children }: { children: ReactNode }) {
  const [progress, setProgress] = useState<LearningProgress>(defaultProgress);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(LEARNING_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as LearningProgress;
        const merged: LearningProgress = {
          ...defaultProgress,
          ...parsed,
          achievements: defaultAchievements.map((defaultAch) => {
            const storedAch = parsed.achievements?.find((a) => a.id === defaultAch.id);
            return storedAch ? { ...defaultAch, ...storedAch } : defaultAch;
          }),
        };
        setProgress(merged);
      }
    } catch {}
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(LEARNING_STORAGE_KEY, JSON.stringify(progress));
    } catch {}
  }, [progress]);

  const updateProgress = useCallback((updates: Partial<LearningProgress>) => {
    setProgress((prev) => {
      const updated = { ...prev, ...updates };
      return checkAchievements(updated);
    });
  }, []);

  const addXp = useCallback((amount: number) => {
    setProgress((prev) => {
      const updated = {
        ...prev,
        xp: prev.xp + amount,
        dailyProgress: prev.dailyProgress + amount,
      };
      return checkAchievements(updated);
    });
  }, []);

  const completeLesson = useCallback((lessonId: string, xpReward: number = 25) => {
    setProgress((prev) => {
      if (prev.completedLessons.includes(lessonId)) return prev;

      const withStreak = updateStreak(prev);
      const updated = {
        ...withStreak,
        completedLessons: [...withStreak.completedLessons, lessonId],
        xp: withStreak.xp + xpReward,
        dailyProgress: withStreak.dailyProgress + xpReward,
      };
      return checkAchievements(updated);
    });
  }, []);

  const masterVocabulary = useCallback((wordId: string) => {
    setProgress((prev) => {
      if (prev.vocabularyMastered.includes(wordId)) return prev;

      const updated = {
        ...prev,
        vocabularyMastered: [...prev.vocabularyMastered, wordId],
        xp: prev.xp + 10,
        dailyProgress: prev.dailyProgress + 10,
      };
      return checkAchievements(updated);
    });
  }, []);

  const resetProgress = useCallback(() => {
    setProgress(defaultProgress);
    localStorage.removeItem(LEARNING_STORAGE_KEY);
  }, []);

  return (
    <LearningContext.Provider
      value={{ progress, updateProgress, addXp, completeLesson, masterVocabulary, resetProgress }}
    >
      {children}
    </LearningContext.Provider>
  );
}

export function useLearning() {
  const context = useContext(LearningContext);
  if (!context) {
    throw new Error("useLearning必须在LearningProvider内部使用");
  }
  return context;
}

export default LearningContext;
