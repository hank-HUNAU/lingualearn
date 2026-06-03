import { useMemo } from 'react'
import { Clock, BookOpen, PenTool, Headphones, Mic, Flame, Star, TrendingUp, Target, Calendar, Zap, Award } from 'lucide-react'
import { useLearning } from '../context/LearningContext'
import { useAuth } from '../context/AuthContext'
import ProgressRing from '../components/ProgressRing'

const weekDays = ['周一', '周二', '周三', '周四', '周五', '周六', '周日']

const recentActivities = [
  { id: 1, type: '词汇', title: '完成了日常词汇练习', xp: 15, time: '10分钟前' },
  { id: 2, type: '语法', title: '通过了时态测试', xp: 25, time: '1小时前' },
  { id: 3, type: '口语', title: '完成口语朗读练习', xp: 20, time: '2小时前' },
  { id: 4, type: '听力', title: '完成听力理解训练', xp: 18, time: '3小时前' },
  { id: 5, type: '词汇', title: '掌握了10个新单词', xp: 10, time: '昨天' },
]

const activityTypeConfig: Record<string, { icon: typeof BookOpen; color: string; bg: string }> = {
  '词汇': { icon: BookOpen, color: 'text-primary-600', bg: 'bg-primary-50' },
  '语法': { icon: PenTool, color: 'text-accent-600', bg: 'bg-accent-50' },
  '口语': { icon: Mic, color: 'text-emerald-600', bg: 'bg-emerald-50' },
  '听力': { icon: Headphones, color: 'text-amber-600', bg: 'bg-amber-50' },
}

interface LearningRecommendation {
  id: string
  title: string
  description: string
  reason: string
  icon: typeof BookOpen
  color: string
}

function getRecommendations(progress: {
  vocabularyMastered: string[]
  grammarScore: number
  speakingScore: number
  listeningScore: number
}): LearningRecommendation[] {
  const recs: LearningRecommendation[] = []
  const { vocabularyMastered, grammarScore, speakingScore, listeningScore } = progress

  if (grammarScore < 60) {
    recs.push({
      id: 'rec_grammar',
      title: '基础语法强化',
      description: '系统学习英语核心语法规则',
      reason: '语法得分较低，建议加强基础训练',
      icon: PenTool,
      color: 'from-accent-500 to-accent-600',
    })
  }

  if (speakingScore < 60) {
    recs.push({
      id: 'rec_speaking',
      title: '口语发音训练',
      description: '从基础音标到日常对话练习',
      reason: '口语得分较低，建议多进行朗读练习',
      icon: Mic,
      color: 'from-emerald-500 to-emerald-600',
    })
  }

  if (listeningScore < 60) {
    recs.push({
      id: 'rec_listening',
      title: '听力理解提升',
      description: '从慢速到常速的听力训练',
      reason: '听力得分较低，建议增加听力练习',
      icon: Headphones,
      color: 'from-amber-500 to-amber-600',
    })
  }

  if (vocabularyMastered.length < 30) {
    recs.push({
      id: 'rec_vocab',
      title: '核心词汇积累',
      description: '掌握最常用的英语核心词汇',
      reason: '词汇量较少，建议每天学习新单词',
      icon: BookOpen,
      color: 'from-primary-500 to-primary-600',
    })
  }

  if (recs.length === 0) {
    recs.push({
      id: 'rec_advanced',
      title: '高级课程挑战',
      description: '挑战更高难度的综合课程',
      reason: '基础扎实，可以尝试进阶内容',
      icon: TrendingUp,
      color: 'from-primary-500 to-accent-500',
    })
  }

  return recs
}

export default function Progress() {
  const { progress } = useLearning()
  const { user } = useAuth()

  const totalCompletion = useMemo(() => {
    const vocabProgress = Math.min((progress.vocabularyMastered.length / 100) * 100, 100)
    const grammarProgress = progress.grammarScore
    const listeningProgress = progress.listeningScore
    const speakingProgress = progress.speakingScore
    return Math.round((vocabProgress + grammarProgress + listeningProgress + speakingProgress) / 4)
  }, [progress])

  const weeklyXp = useMemo(() => {
    const base = progress.xp
    const dayOfWeek = new Date().getDay()
    const factors = [0.15, 0.25, 0.2, 0.3, 0.35, 0.1, 0.05]
    return weekDays.map((_, i) => {
      const factor = i === (dayOfWeek === 0 ? 6 : dayOfWeek - 1) ? 0.4 : factors[i]
      return Math.round(base * factor * 0.1)
    })
  }, [progress.xp])

  const maxWeeklyXp = Math.max(...weeklyXp, 1)

  const skills = [
    { name: '词汇', score: Math.min(Math.round((progress.vocabularyMastered.length / 100) * 100), 100), icon: BookOpen, color: 'bg-primary-500' },
    { name: '语法', score: progress.grammarScore, icon: PenTool, color: 'bg-accent-500' },
    { name: '口语', score: progress.speakingScore, icon: Mic, color: 'bg-emerald-500' },
    { name: '听力', score: progress.listeningScore, icon: Headphones, color: 'bg-amber-500' },
  ]

  const recommendations = useMemo(() => getRecommendations(progress), [progress])

  const dailyGoalPercent = progress.dailyGoal > 0
    ? Math.min(Math.round((progress.dailyProgress / progress.dailyGoal) * 100), 100)
    : 0

  const studyHours = Math.round(progress.completedLessons.length * 0.5 * 10) / 10

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-accent-50 px-4 py-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 text-center">
          <h1 className="mb-2 text-3xl font-bold gradient-text">学习进度</h1>
          <p className="text-slate-500">追踪你的学习旅程，持续进步</p>
        </div>

        <div className="mb-8 glass-card rounded-2xl p-8">
          <div className="flex flex-col items-center gap-6 md:flex-row">
            <div className="flex flex-col items-center">
              <ProgressRing progress={totalCompletion} size={160} strokeWidth={12} color="#3b82f6" />
              <p className="mt-2 text-sm font-medium text-slate-500">总体完成度</p>
            </div>

            <div className="flex-1">
              <div className="mb-4">
                <h2 className="text-xl font-bold text-slate-800">
                  {user?.username || '学习者'}的学习档案
                </h2>
                <p className="text-sm text-slate-400">
                  加入于 {user?.joinDate || '今天'} · 等级 {user?.level || 'A1'}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                <div className="rounded-xl bg-primary-50 p-3">
                  <div className="flex items-center gap-2 text-primary-600">
                    <Clock className="h-4 w-4" />
                    <span className="text-xs">总学习时长</span>
                  </div>
                  <p className="mt-1 text-lg font-bold text-primary-700">{studyHours}h</p>
                </div>
                <div className="rounded-xl bg-emerald-50 p-3">
                  <div className="flex items-center gap-2 text-emerald-600">
                    <BookOpen className="h-4 w-4" />
                    <span className="text-xs">已掌握单词</span>
                  </div>
                  <p className="mt-1 text-lg font-bold text-emerald-700">{progress.vocabularyMastered.length}</p>
                </div>
                <div className="rounded-xl bg-accent-50 p-3">
                  <div className="flex items-center gap-2 text-accent-600">
                    <PenTool className="h-4 w-4" />
                    <span className="text-xs">语法正确率</span>
                  </div>
                  <p className="mt-1 text-lg font-bold text-accent-700">{progress.grammarScore}%</p>
                </div>
                <div className="rounded-xl bg-amber-50 p-3">
                  <div className="flex items-center gap-2 text-amber-600">
                    <Flame className="h-4 w-4" />
                    <span className="text-xs">连续学习天数</span>
                  </div>
                  <p className="mt-1 text-lg font-bold text-amber-700">{progress.streak}天</p>
                </div>
                <div className="rounded-xl bg-rose-50 p-3">
                  <div className="flex items-center gap-2 text-rose-600">
                    <Star className="h-4 w-4" />
                    <span className="text-xs">总经验值</span>
                  </div>
                  <p className="mt-1 text-lg font-bold text-rose-700">{progress.xp}</p>
                </div>
                <div className="rounded-xl bg-slate-50 p-3">
                  <div className="flex items-center gap-2 text-slate-600">
                    <Award className="h-4 w-4" />
                    <span className="text-xs">已完成课程</span>
                  </div>
                  <p className="mt-1 text-lg font-bold text-slate-700">{progress.completedLessons.length}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-8 grid gap-6 md:grid-cols-2">
          <div className="glass-card rounded-2xl p-6">
            <h3 className="mb-4 flex items-center gap-2 font-semibold text-slate-700">
              <Target className="h-5 w-5 text-primary-500" />
              技能概览
            </h3>
            <div className="space-y-4">
              {skills.map(skill => {
                const SkillIcon = skill.icon
                return (
                  <div key={skill.name}>
                    <div className="mb-1 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <SkillIcon className="h-4 w-4 text-slate-500" />
                        <span className="text-sm font-medium text-slate-600">{skill.name}</span>
                      </div>
                      <span className="text-sm font-semibold text-slate-700">{skill.score}%</span>
                    </div>
                    <div className="h-2.5 w-full rounded-full bg-slate-100">
                      <div
                        className={`h-2.5 rounded-full ${skill.color} transition-all duration-500`}
                        style={{ width: `${skill.score}%` }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          <div className="glass-card rounded-2xl p-6">
            <h3 className="mb-4 flex items-center gap-2 font-semibold text-slate-700">
              <Calendar className="h-5 w-5 text-accent-500" />
              本周活跃度
            </h3>
            <div className="flex items-end justify-between gap-2" style={{ height: 160 }}>
              {weekDays.map((day, i) => (
                <div key={day} className="flex flex-1 flex-col items-center gap-1">
                  <span className="text-xs font-medium text-slate-500">{weeklyXp[i]}</span>
                  <div className="w-full rounded-t-md bg-slate-100" style={{ height: 120 }}>
                    <div
                      className="w-full rounded-t-md bg-gradient-to-t from-primary-500 to-accent-400 transition-all duration-500"
                      style={{
                        height: `${(weeklyXp[i] / maxWeeklyXp) * 100}%`,
                        marginTop: `${100 - (weeklyXp[i] / maxWeeklyXp) * 100}%`,
                      }}
                    />
                  </div>
                  <span className="text-xs text-slate-400">{day}</span>
                </div>
              ))}
            </div>
            <p className="mt-2 text-center text-xs text-slate-400">每日经验值 (XP)</p>
          </div>
        </div>

        <div className="mb-8 grid gap-6 md:grid-cols-2">
          <div className="glass-card rounded-2xl p-6">
            <h3 className="mb-4 flex items-center gap-2 font-semibold text-slate-700">
              <Zap className="h-5 w-5 text-amber-500" />
              每日目标
            </h3>
            <div className="mb-3 flex items-center justify-between">
              <span className="text-sm text-slate-500">今日进度</span>
              <span className="text-sm font-semibold text-slate-700">
                {progress.dailyProgress} / {progress.dailyGoal} XP
              </span>
            </div>
            <div className="mb-4 h-4 w-full rounded-full bg-slate-100">
              <div
                className="h-4 rounded-full bg-gradient-to-r from-amber-400 to-amber-500 transition-all duration-500"
                style={{ width: `${dailyGoalPercent}%` }}
              />
            </div>
            <div className="flex items-center gap-3 rounded-xl bg-amber-50 p-3">
              <Flame className="h-6 w-6 text-amber-500" />
              <div>
                <p className="text-sm font-semibold text-amber-700">
                  连续学习 {progress.streak} 天
                </p>
                <p className="text-xs text-amber-500">
                  {progress.streak > 0 ? '保持学习，继续加油！' : '今天开始你的学习之旅吧！'}
                </p>
              </div>
            </div>
          </div>

          <div className="glass-card rounded-2xl p-6">
            <h3 className="mb-4 flex items-center gap-2 font-semibold text-slate-700">
              <TrendingUp className="h-5 w-5 text-emerald-500" />
              最近活动
            </h3>
            <div className="space-y-3">
              {recentActivities.map(activity => {
                const config = activityTypeConfig[activity.type]
                const ActivityIcon = config?.icon || BookOpen
                return (
                  <div key={activity.id} className="flex items-center gap-3 rounded-xl bg-slate-50 p-3">
                    <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${config?.bg || 'bg-slate-100'}`}>
                      <ActivityIcon className={`h-4 w-4 ${config?.color || 'text-slate-500'}`} />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-slate-700">{activity.title}</p>
                      <p className="text-xs text-slate-400">{activity.time}</p>
                    </div>
                    <span className="text-xs font-semibold text-primary-600">+{activity.xp} XP</span>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        <div className="glass-card rounded-2xl p-6">
          <h3 className="mb-4 flex items-center gap-2 font-semibold text-slate-700">
            <TrendingUp className="h-5 w-5 text-primary-500" />
            个性化学习推荐
          </h3>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {recommendations.map(rec => {
              const RecIcon = rec.icon
              return (
                <div key={rec.id} className="group rounded-xl border border-slate-100 bg-white p-5 transition-all hover:shadow-lg hover:-translate-y-1">
                  <div className={`mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br ${rec.color} text-white`}>
                    <RecIcon className="h-5 w-5" />
                  </div>
                  <h4 className="mb-1 font-semibold text-slate-800">{rec.title}</h4>
                  <p className="mb-2 text-sm text-slate-500">{rec.description}</p>
                  <p className="text-xs text-primary-500">{rec.reason}</p>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
