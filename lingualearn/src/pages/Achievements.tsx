import { useState, useMemo } from 'react'
import { Trophy, Flame, Calendar, Star, Crown, Medal, ChevronLeft, ChevronRight } from 'lucide-react'
import { useLearning } from '../context/LearningContext'
import AchievementBadge from '../components/AchievementBadge'

type AchievementCategory = '学习里程碑' | '技能达人' | '社区之星' | '特殊成就'
type Rarity = 'common' | 'rare' | 'epic' | 'legendary'

interface AchievementItem {
  id: string
  icon: string
  title: string
  description: string
  unlocked: boolean
  rarity: Rarity
  xpReward: number
  category: AchievementCategory
}

const allAchievements: AchievementItem[] = [
  { id: 'ach_m_1', icon: 'Rocket', title: '初出茅庐', description: '完成第一节课', unlocked: false, rarity: 'common', xpReward: 10, category: '学习里程碑' },
  { id: 'ach_m_2', icon: 'BookOpen', title: '词汇新手', description: '掌握10个单词', unlocked: false, rarity: 'common', xpReward: 15, category: '学习里程碑' },
  { id: 'ach_m_3', icon: 'Library', title: '词汇达人', description: '掌握50个单词', unlocked: false, rarity: 'rare', xpReward: 50, category: '学习里程碑' },
  { id: 'ach_m_4', icon: 'GraduationCap', title: '课程完成者', description: '完成10节课程', unlocked: false, rarity: 'rare', xpReward: 40, category: '学习里程碑' },
  { id: 'ach_m_5', icon: 'Trophy', title: '百分达人', description: '累计获得100经验值', unlocked: false, rarity: 'common', xpReward: 20, category: '学习里程碑' },
  { id: 'ach_m_6', icon: 'Crown', title: '千分大师', description: '累计获得1000经验值', unlocked: false, rarity: 'epic', xpReward: 100, category: '学习里程碑' },
  { id: 'ach_s_1', icon: 'PenTool', title: '语法新星', description: '语法得分达到80分', unlocked: false, rarity: 'rare', xpReward: 30, category: '技能达人' },
  { id: 'ach_s_2', icon: 'Mic', title: '口语流利', description: '口语得分达到80分', unlocked: false, rarity: 'rare', xpReward: 30, category: '技能达人' },
  { id: 'ach_s_3', icon: 'Headphones', title: '听力高手', description: '听力得分达到80分', unlocked: false, rarity: 'rare', xpReward: 30, category: '技能达人' },
  { id: 'ach_s_4', icon: 'Star', title: '全能学者', description: '所有技能得分超过70分', unlocked: false, rarity: 'epic', xpReward: 80, category: '技能达人' },
  { id: 'ach_s_5', icon: 'Zap', title: '完美表现', description: '任一技能获得满分', unlocked: false, rarity: 'legendary', xpReward: 150, category: '技能达人' },
  { id: 'ach_c_1', icon: 'Users', title: '学习伙伴', description: '邀请一位好友加入', unlocked: false, rarity: 'common', xpReward: 20, category: '社区之星' },
  { id: 'ach_c_2', icon: 'MessageCircle', title: '热心助人', description: '帮助5位学习者解答问题', unlocked: false, rarity: 'rare', xpReward: 40, category: '社区之星' },
  { id: 'ach_c_3', icon: 'Heart', title: '社区之星', description: '获得10次点赞', unlocked: false, rarity: 'epic', xpReward: 60, category: '社区之星' },
  { id: 'ach_c_4', icon: 'Award', title: '社区领袖', description: '连续30天活跃于社区', unlocked: false, rarity: 'legendary', xpReward: 200, category: '社区之星' },
  { id: 'ach_sp_1', icon: 'Flame', title: '连续学习', description: '连续学习3天', unlocked: false, rarity: 'common', xpReward: 15, category: '特殊成就' },
  { id: 'ach_sp_2', icon: 'Flame', title: '坚持不懈', description: '连续学习7天', unlocked: false, rarity: 'rare', xpReward: 35, category: '特殊成就' },
  { id: 'ach_sp_3', icon: 'Flame', title: '学习狂人', description: '连续学习30天', unlocked: false, rarity: 'epic', xpReward: 100, category: '特殊成就' },
  { id: 'ach_sp_4', icon: 'Sun', title: '早起鸟儿', description: '在早上6点前完成学习', unlocked: false, rarity: 'rare', xpReward: 25, category: '特殊成就' },
  { id: 'ach_sp_5', icon: 'Sparkles', title: '传奇学习者', description: '解锁所有其他成就', unlocked: false, rarity: 'legendary', xpReward: 500, category: '特殊成就' },
]

const leaderboardData = [
  { rank: 1, name: '英语达人', xp: 2580, avatar: '🥇' },
  { rank: 2, name: '学习先锋', xp: 2150, avatar: '🥈' },
  { rank: 3, name: '词汇王者', xp: 1890, avatar: '🥉' },
  { rank: 4, name: '语法高手', xp: 1560, avatar: '🌟' },
  { rank: 5, name: '口语达人', xp: 1320, avatar: '⭐' },
]

const categories: AchievementCategory[] = ['学习里程碑', '技能达人', '社区之星', '特殊成就']

const categoryIcons: Record<AchievementCategory, typeof Trophy> = {
  '学习里程碑': Trophy,
  '技能达人': Medal,
  '社区之星': Star,
  '特殊成就': Crown,
}

export default function Achievements() {
  const { progress } = useLearning()
  const [activeCategory, setActiveCategory] = useState<AchievementCategory>('学习里程碑')
  const [calendarMonth, setCalendarMonth] = useState(new Date())

  const displayAchievements = useMemo(() => {
    const ids = new Set(progress.achievements.filter(a => a.unlockedAt).map(a => a.id))
    return allAchievements.map(a => ({
      ...a,
      unlocked: ids.has(a.id) || a.unlocked,
    }))
  }, [progress.achievements])

  const filteredAchievements = displayAchievements.filter(a => a.category === activeCategory)

  const totalUnlocked = displayAchievements.filter(a => a.unlocked).length
  const totalAchievements = displayAchievements.length

  const checkedDays = useMemo(() => {
    const days = new Set<number>()
    const today = new Date()
    const streak = progress.streak
    for (let i = 0; i < streak; i++) {
      const d = new Date(today)
      d.setDate(d.getDate() - i)
      days.add(d.getDate())
    }
    return days
  }, [progress.streak])

  const calendarDays = useMemo(() => {
    const year = calendarMonth.getFullYear()
    const month = calendarMonth.getMonth()
    const firstDay = new Date(year, month, 1).getDay()
    const daysInMonth = new Date(year, month + 1, 0).getDate()
    const adjustedFirstDay = firstDay === 0 ? 6 : firstDay - 1
    const days: (number | null)[] = []
    for (let i = 0; i < adjustedFirstDay; i++) {
      days.push(null)
    }
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i)
    }
    return days
  }, [calendarMonth])

  const today = new Date().getDate()
  const currentMonth = new Date().getMonth()
  const currentYear = new Date().getFullYear()

  const prevMonth = () => {
    setCalendarMonth(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1))
  }

  const nextMonth = () => {
    setCalendarMonth(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1))
  }

  const monthLabel = `${calendarMonth.getFullYear()}年${calendarMonth.getMonth() + 1}月`

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-primary-50 px-4 py-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 text-center">
          <h1 className="mb-2 text-3xl font-bold gradient-text">成就系统</h1>
          <p className="text-slate-500">收集成就徽章，记录你的每一步成长</p>
        </div>

        <div className="mb-8 glass-card rounded-2xl p-6">
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-400 to-amber-500 text-white shadow-lg shadow-amber-200">
                <Trophy className="h-8 w-8" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-800">成就进度</h2>
                <p className="text-sm text-slate-500">
                  已解锁 <span className="font-semibold text-amber-600">{totalUnlocked}</span> / {totalAchievements}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-6">
              <div className="text-center">
                <p className="text-2xl font-bold text-amber-600">{totalUnlocked}</p>
                <p className="text-xs text-slate-400">已解锁</p>
              </div>
              <div className="h-8 w-px bg-slate-200" />
              <div className="text-center">
                <p className="text-2xl font-bold text-slate-600">{totalAchievements - totalUnlocked}</p>
                <p className="text-xs text-slate-400">未解锁</p>
              </div>
              <div className="h-8 w-px bg-slate-200" />
              <div className="text-center">
                <p className="text-2xl font-bold text-primary-600">{progress.xp}</p>
                <p className="text-xs text-slate-400">总经验值</p>
              </div>
            </div>
          </div>

          <div className="mt-4 h-3 w-full rounded-full bg-slate-100">
            <div
              className="h-3 rounded-full bg-gradient-to-r from-amber-400 to-amber-500 transition-all duration-500"
              style={{ width: `${(totalUnlocked / totalAchievements) * 100}%` }}
            />
          </div>
        </div>

        <div className="mb-6 flex flex-wrap gap-2">
          {categories.map(cat => {
            const CatIcon = categoryIcons[cat]
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium transition-all ${
                  activeCategory === cat
                    ? 'bg-amber-500 text-white shadow-lg shadow-amber-200'
                    : 'bg-white text-slate-600 hover:bg-amber-50 hover:text-amber-600'
                }`}
              >
                <CatIcon className="h-4 w-4" />
                {cat}
              </button>
            )
          })}
        </div>

        <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {filteredAchievements.map(achievement => (
            <div key={achievement.id} className="relative">
              <AchievementBadge
                icon={achievement.icon}
                title={achievement.title}
                description={achievement.description}
                unlocked={achievement.unlocked}
                rarity={achievement.rarity}
              />
              <div className="absolute -right-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full bg-amber-100 text-xs font-bold text-amber-600">
                {achievement.xpReward}
              </div>
            </div>
          ))}
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="glass-card rounded-2xl p-6">
            <h3 className="mb-4 flex items-center gap-2 font-semibold text-slate-700">
              <Flame className="h-5 w-5 text-amber-500" />
              经验值排行榜
            </h3>
            <div className="space-y-3">
              {leaderboardData.map(user => (
                <div key={user.rank} className="flex items-center gap-3 rounded-xl bg-slate-50 p-3 transition-all hover:bg-slate-100">
                  <span className="text-xl">{user.avatar}</span>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-slate-700">{user.name}</p>
                    <p className="text-xs text-slate-400">第 {user.rank} 名</p>
                  </div>
                  <span className="text-sm font-bold text-amber-600">{user.xp} XP</span>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-card rounded-2xl p-6">
            <h3 className="mb-4 flex items-center gap-2 font-semibold text-slate-700">
              <Calendar className="h-5 w-5 text-primary-500" />
              每日签到
            </h3>

            <div className="mb-4 flex items-center justify-between">
              <button onClick={prevMonth} className="rounded-full p-1 hover:bg-slate-100">
                <ChevronLeft className="h-4 w-4 text-slate-400" />
              </button>
              <span className="text-sm font-medium text-slate-600">{monthLabel}</span>
              <button onClick={nextMonth} className="rounded-full p-1 hover:bg-slate-100">
                <ChevronRight className="h-4 w-4 text-slate-400" />
              </button>
            </div>

            <div className="mb-2 grid grid-cols-7 gap-1 text-center">
              {['一', '二', '三', '四', '五', '六', '日'].map(d => (
                <span key={d} className="text-xs font-medium text-slate-400">{d}</span>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-1">
              {calendarDays.map((day, idx) => (
                <div
                  key={idx}
                  className={`flex h-9 items-center justify-center rounded-lg text-sm ${
                    day === null
                      ? ''
                      : checkedDays.has(day) &&
                        calendarMonth.getMonth() === currentMonth &&
                        calendarMonth.getFullYear() === currentYear
                        ? 'bg-amber-100 font-semibold text-amber-700'
                        : day === today &&
                            calendarMonth.getMonth() === currentMonth &&
                            calendarMonth.getFullYear() === currentYear
                          ? 'bg-primary-100 font-semibold text-primary-700'
                          : 'text-slate-500'
                  }`}
                >
                  {day}
                </div>
              ))}
            </div>

            <div className="mt-3 flex items-center gap-3 text-xs text-slate-400">
              <span className="flex items-center gap-1">
                <span className="inline-block h-3 w-3 rounded bg-amber-100" />
                已签到
              </span>
              <span className="flex items-center gap-1">
                <span className="inline-block h-3 w-3 rounded bg-primary-100" />
                今天
              </span>
            </div>

            <div className="mt-4 rounded-xl bg-amber-50 p-3">
              <div className="flex items-center gap-2">
                <Flame className="h-5 w-5 text-amber-500" />
                <span className="text-sm font-semibold text-amber-700">
                  当前连续签到 {progress.streak} 天
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
