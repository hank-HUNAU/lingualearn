import { Link } from 'react-router-dom'
import { BookOpen, Brain, Mic, Headphones, ArrowRight, Zap, List } from 'lucide-react'
import { useLearning } from '../context/LearningContext'

const coreModule = {
  icon: Mic,
  title: '影子跟读',
  description: '基于科学研究的影子跟读法，支持实时跟读和逐句跟读两种模式，AI六维评分（准确度/流利度/完整度/语调/语速/节奏），覆盖雅思、托福、新概念等主流考试素材。',
  link: '/shadow-reading',
  gradient: 'from-primary-500 to-accent-600',
  bg: 'bg-primary-50',
  textColor: 'text-primary-600',
  stats: '16+ 素材',
}

const modules = [
  {
    icon: BookOpen,
    title: '单词记忆',
    description: '听音拼写，高效记忆。覆盖日常、旅行、商务、学术等分类，支持英式/美式发音与多倍速播放，通过闪卡翻转强化单词记忆。',
    link: '/learn/vocabulary',
    gradient: 'from-purple-500 to-indigo-600',
    bg: 'bg-purple-50',
    textColor: 'text-purple-600',
    stats: '32+ 词汇',
  },
  {
    icon: Headphones,
    title: '听力训练',
    description: '多场景听力素材，支持语速调节和四级提示系统，从慢速到原速渐进训练，全面提升听力理解与听写能力。',
    link: '/learn/listening',
    gradient: 'from-amber-500 to-orange-600',
    bg: 'bg-amber-50',
    textColor: 'text-amber-600',
    stats: '10+ 素材',
  },
  {
    icon: Brain,
    title: '语法练习',
    description: '从基础句型到复杂语法结构，通过填空、选择、排序三种题型场景化练习，即时反馈与详细解析，轻松掌握语法规则。',
    link: '/learn/grammar',
    gradient: 'from-emerald-500 to-teal-600',
    bg: 'bg-emerald-50',
    textColor: 'text-emerald-600',
    stats: '18+ 练习',
  },
]

export default function LearnHub() {
  const { progress } = useLearning()

  const skillScores = [
    { label: '口语', value: progress.speakingScore, color: 'bg-primary-500' },
    { label: '听力', value: progress.listeningScore, color: 'bg-amber-500' },
    { label: '词汇', value: Math.min(100, progress.vocabularyMastered.length * 3), color: 'bg-purple-500' },
    { label: '语法', value: progress.grammarScore, color: 'bg-emerald-500' },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-10 text-center">
          <h1 className="mb-3 text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
            <span className="gradient-text">互动学习中心</span>
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-slate-500">
            以影子跟读为核心，听说读写全面提升
          </p>
        </div>

        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {skillScores.map((skill) => (
            <div key={skill.label} className="rounded-2xl bg-white p-5 shadow-sm border border-slate-100">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-sm font-medium text-slate-600">{skill.label}</span>
                <span className="text-sm font-bold text-slate-800">{skill.value}%</span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
                <div
                  className={`h-2 rounded-full ${skill.color} transition-all duration-700`}
                  style={{ width: `${skill.value}%` }}
                />
              </div>
            </div>
          ))}
        </div>

        <Link
          to={coreModule.link}
          className="group mb-8 block relative overflow-hidden rounded-2xl bg-white p-8 shadow-md border-2 border-primary-100 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:border-primary-200"
        >
          <div className={`absolute top-0 left-0 h-2 w-full bg-gradient-to-r ${coreModule.gradient}`} />
          <div className="flex items-start gap-5">
            <div className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${coreModule.gradient} text-white shadow-lg`}>
              <coreModule.icon className="h-8 w-8" />
            </div>
            <div className="flex-1">
              <div className="mb-2 flex items-center gap-3">
                <h3 className="text-2xl font-bold text-slate-900">{coreModule.title}</h3>
                <span className={`rounded-full px-3 py-1 text-xs font-medium ${coreModule.bg} ${coreModule.textColor}`}>
                  {coreModule.stats}
                </span>
                <span className="rounded-full bg-accent-50 px-3 py-1 text-xs font-medium text-accent-600">
                  核心功能
                </span>
              </div>
              <p className="mb-4 text-sm text-slate-500 leading-relaxed">{coreModule.description}</p>
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2 rounded-lg bg-primary-50 px-3 py-1.5 text-xs font-medium text-primary-700">
                  <Zap className="h-3.5 w-3.5" />
                  实时跟读
                </div>
                <div className="flex items-center gap-2 rounded-lg bg-accent-50 px-3 py-1.5 text-xs font-medium text-accent-700">
                  <List className="h-3.5 w-3.5" />
                  逐句跟读
                </div>
                <span className="inline-flex items-center gap-1 text-sm font-semibold text-primary-600 transition-colors group-hover:text-primary-700">
                  立即体验
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </span>
              </div>
            </div>
          </div>
        </Link>

        <div className="grid gap-6 sm:grid-cols-3">
          {modules.map((mod) => (
            <Link
              key={mod.title}
              to={mod.link}
              className="group relative overflow-hidden rounded-2xl bg-white p-6 shadow-sm border border-slate-100 transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
            >
              <div className={`absolute top-0 left-0 h-1.5 w-full bg-gradient-to-r ${mod.gradient}`} />
              <div className="flex items-start gap-4">
                <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${mod.gradient} text-white shadow-lg`}>
                  <mod.icon className="h-6 w-6" />
                </div>
                <div className="flex-1">
                  <div className="mb-1 flex items-center gap-2">
                    <h3 className="text-lg font-bold text-slate-900">{mod.title}</h3>
                    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${mod.bg} ${mod.textColor}`}>
                      {mod.stats}
                    </span>
                  </div>
                  <p className="mb-3 text-sm text-slate-500 leading-relaxed">{mod.description}</p>
                  <span className="inline-flex items-center gap-1 text-sm font-semibold text-primary-600 transition-colors group-hover:text-primary-700">
                    立即体验
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-12 rounded-2xl bg-gradient-to-r from-primary-600 to-accent-600 p-8 text-center text-white shadow-lg">
          <h3 className="mb-2 text-2xl font-bold">坚持每天跟读，练就地道口语</h3>
          <p className="mb-6 text-white/70">
            当前连续学习 <span className="text-2xl font-bold text-white">{progress.streak}</span> 天，继续加油！
          </p>
          <div className="flex items-center justify-center gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold">{progress.xp}</div>
              <div className="text-sm text-white/60">总经验值</div>
            </div>
            <div className="h-10 w-px bg-white/20" />
            <div className="text-center">
              <div className="text-3xl font-bold">{progress.speakingScore}%</div>
              <div className="text-sm text-white/60">口语评分</div>
            </div>
            <div className="h-10 w-px bg-white/20" />
            <div className="text-center">
              <div className="text-3xl font-bold">{progress.completedLessons.length}</div>
              <div className="text-sm text-white/60">已完成课时</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
