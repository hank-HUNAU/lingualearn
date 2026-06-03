import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import {
  Mic,
  Zap,
  List,
  Target,
  Wind,
  CheckCircle,
  Music,
  Gauge,
  Clock,
  Brain,
  BookOpen,
  Headphones,
  PenTool,
  Users,
  ArrowRight,
  Star,
  ChevronRight,
  Sparkles,
  MessageCircle,
  Activity,
} from 'lucide-react'

const languageBubbles = [
  { text: 'EN', color: 'from-blue-400 to-blue-600', x: '10%', y: '20%', delay: '0s' },
  { text: 'Hello', color: 'from-rose-400 to-rose-600', x: '80%', y: '15%', delay: '0.5s' },
  { text: 'Shadow', color: 'from-purple-400 to-purple-600', x: '70%', y: '70%', delay: '1s' },
  { text: 'Speak', color: 'from-amber-400 to-amber-600', x: '15%', y: '65%', delay: '1.5s' },
  { text: 'Read', color: 'from-emerald-400 to-emerald-600', x: '50%', y: '10%', delay: '2s' },
  { text: 'AI', color: 'from-orange-400 to-orange-600', x: '90%', y: '50%', delay: '0.8s' },
  { text: 'Echo', color: 'from-teal-400 to-teal-600', x: '5%', y: '45%', delay: '1.2s' },
  { text: 'Pro', color: 'from-indigo-400 to-indigo-600', x: '60%', y: '80%', delay: '1.8s' },
]

const scoreDimensions = [
  { icon: Target, name: '准确度', description: '单词发音是否正确', weight: '20%', color: 'border-blue-500', bg: 'bg-blue-50', iconBg: 'from-blue-500 to-blue-600' },
  { icon: Wind, name: '流利度', description: '是否有多余停顿和重复', weight: '15%', color: 'border-cyan-500', bg: 'bg-cyan-50', iconBg: 'from-cyan-500 to-cyan-600' },
  { icon: CheckCircle, name: '完整度', description: '是否遗漏关键单词', weight: '15%', color: 'border-emerald-500', bg: 'bg-emerald-50', iconBg: 'from-emerald-500 to-emerald-600' },
  { icon: Music, name: '语调匹配度', description: '升降调和重音位置', weight: '20%', color: 'border-purple-500', bg: 'bg-purple-50', iconBg: 'from-purple-500 to-purple-600' },
  { icon: Gauge, name: '语速匹配度', description: '跟读速度与原声的偏差', weight: '15%', color: 'border-amber-500', bg: 'bg-amber-50', iconBg: 'from-amber-500 to-amber-600' },
  { icon: Clock, name: '停顿节奏', description: '意群停顿位置是否正确', weight: '15%', color: 'border-rose-500', bg: 'bg-rose-50', iconBg: 'from-rose-500 to-rose-600' },
]

const materialCategories = [
  { emoji: '🎯', name: '雅思', description: '雅思口语真题素材，覆盖Part1-3高频话题' },
  { emoji: '📘', name: '托福', description: '托福口语独立题与综合题，TPO原声跟读' },
  { emoji: '📖', name: '新概念英语', description: '经典教材逐课跟读，夯实英语基础' },
  { emoji: '🎓', name: '四六级', description: '四六级听力原文跟读，考试口语双提升' },
  { emoji: '📻', name: 'BBC英语', description: 'BBC新闻原声跟读，练就英式发音' },
  { emoji: '📚', name: '中小学教材', description: '同步课标教材，课后跟读巩固提升' },
  { emoji: '🎬', name: '影视对白', description: '经典电影美剧对白，趣味跟读不枯燥' },
]

const scientificBasis = [
  {
    icon: Brain,
    title: '工作记忆强化',
    description: '影子跟读训练语音回路，增强听觉信息在工作记忆中的保持和加工能力',
    gradient: 'from-indigo-500 to-blue-600',
  },
  {
    icon: Activity,
    title: '语调内化',
    description: '通过模仿母语者的语调模式，将正确的韵律特征内化为自动化产出能力',
    gradient: 'from-purple-500 to-pink-600',
  },
  {
    icon: MessageCircle,
    title: '听说协同',
    description: '同时进行听觉输入和口语输出，建立高效的听觉-口腔神经通路',
    gradient: 'from-emerald-500 to-teal-600',
  },
]

const otherFeatures = [
  {
    icon: PenTool,
    title: '单词拼写',
    description: '听音拼写，巩固单词记忆',
    gradient: 'from-blue-500 to-indigo-600',
    link: '/learn/vocabulary',
  },
  {
    icon: Headphones,
    title: '句子听写',
    description: '逐句听写训练，提升听力精度',
    gradient: 'from-purple-500 to-violet-600',
    link: '/learn/listening',
  },
  {
    icon: BookOpen,
    title: '语法练习',
    description: '场景化语法训练，掌握核心规则',
    gradient: 'from-emerald-500 to-teal-600',
    link: '/learn/grammar',
  },
  {
    icon: Users,
    title: '学习社区',
    description: '与学友交流心得，互相激励进步',
    gradient: 'from-amber-500 to-orange-600',
    link: '/community',
  },
]

const stats = [
  { value: 50000, suffix: '+', label: '学员', icon: Users },
  { value: 1000, suffix: '+', label: '跟读素材', icon: Mic },
  { value: 98, suffix: '%', label: '好评率', icon: Star },
  { value: 6, suffix: '维', label: 'AI评分', icon: Sparkles },
]

const testimonials = [
  {
    name: '陈思雨',
    avatar: 'https://trae-api-cn.mchort.guru/api/ide/v1/text_to_image?prompt=young%20chinese%20woman%20portrait%20smiling&image_size=square_hd',
    quote: '影子跟读模式太上瘾了！每天30分钟，一个月下来口语流利度提升明显，雅思口语从5.5提到了7分，六维评分让我清楚知道哪里需要改进。',
    level: '雅思口语7分',
  },
  {
    name: '刘博文',
    avatar: 'https://trae-api-cn.mchort.guru/api/ide/v1/text_to_image?prompt=young%20chinese%20man%20portrait%20smiling&image_size=square_hd',
    quote: '实时跟读模式让我像影子一样跟着原声读，语调和节奏进步飞快。以前说英语总是中式语调，现在同事都说我说话像母语者了！',
    level: '英语流利表达',
  },
  {
    name: '赵雅琪',
    avatar: 'https://trae-api-cn.mchort.guru/api/ide/v1/text_to_image?prompt=middle%20aged%20chinese%20woman%20portrait%20friendly&image_size=square_hd',
    quote: '逐句跟读特别适合我这种初学者，每句话都有AI评分反馈，知道哪个音发得不准。素材也很丰富，从新概念到BBC新闻都有，每天坚持打卡！',
    level: '新概念英语学习',
  },
]

function AnimatedCounter({ target, suffix }: { target: number; suffix: string }) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLDivElement>(null)
  const hasAnimated = useRef(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true
          const duration = 2000
          const steps = 60
          const increment = target / steps
          let current = 0
          const timer = setInterval(() => {
            current += increment
            if (current >= target) {
              setCount(target)
              clearInterval(timer)
            } else {
              setCount(Math.floor(current))
            }
          }, duration / steps)
        }
      },
      { threshold: 0.5 }
    )

    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [target])

  return (
    <div ref={ref} className="text-4xl font-bold gradient-text">
      {count.toLocaleString()}{suffix}
    </div>
  )
}

const Home: React.FC = () => {
  return (
    <div className="overflow-hidden">
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-indigo-50 via-white to-purple-50">
        <div className="absolute inset-0 overflow-hidden">
          {languageBubbles.map((bubble, i) => (
            <div
              key={i}
              className={`absolute animate-float rounded-2xl bg-gradient-to-br ${bubble.color} px-4 py-2 text-lg font-bold text-white shadow-lg opacity-80`}
              style={{
                left: bubble.x,
                top: bubble.y,
                animationDelay: bubble.delay,
                animationDuration: `${3 + i * 0.5}s`,
              }}
            >
              {bubble.text}
            </div>
          ))}
        </div>

        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-end gap-1 opacity-20">
            {[...Array(40)].map((_, i) => (
              <div
                key={i}
                className="w-1.5 bg-gradient-to-t from-primary-400 to-accent-400 rounded-full"
                style={{
                  height: `${20 + Math.sin(i * 0.5) * 30 + 20}px`,
                  animation: `float ${1.5 + (i % 5) * 0.3}s ease-in-out infinite`,
                  animationDelay: `${i * 0.08}s`,
                }}
              />
            ))}
          </div>
        </div>

        <div className="absolute top-1/4 left-[15%] animate-float opacity-30" style={{ animationDelay: '0.5s' }}>
          <Mic className="h-16 w-16 text-primary-500" />
        </div>
        <div className="absolute bottom-1/4 right-[15%] animate-float opacity-25" style={{ animationDelay: '1.2s' }}>
          <div className="h-20 w-20 rounded-full bg-gradient-to-br from-accent-400 to-primary-400 blur-xl" />
        </div>

        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(99,102,241,0.08),transparent_70%)]" />

        <div className="relative z-10 mx-auto max-w-5xl px-4 text-center">
          <div className="animate-slide-up">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/80 px-4 py-2 text-sm font-medium text-primary-700 shadow-sm backdrop-blur-sm">
              <Mic className="h-4 w-4" />
              AI驱动的影子跟读英语口语平台
            </div>
            <h1 className="mb-6 text-5xl font-extrabold leading-tight tracking-tight sm:text-6xl lg:text-7xl">
              <span className="gradient-text">影子跟读，练就地道英语口语</span>
            </h1>
            <p className="mx-auto mb-10 max-w-2xl text-lg text-slate-600 sm:text-xl">
              基于科学研究的影子跟读法，AI六维评分，实时反馈，让发音和语调更接近母语者
            </p>
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                to="/shadow-reading"
                className="group inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-primary-600 to-accent-600 px-8 py-4 text-lg font-semibold text-white shadow-lg shadow-primary-500/25 transition-all hover:shadow-xl hover:shadow-primary-500/40 hover:-translate-y-0.5"
              >
                开始影子跟读
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Link>
              <a
                href="#core-feature"
                className="inline-flex items-center gap-2 rounded-xl border-2 border-slate-200 bg-white/80 px-8 py-4 text-lg font-semibold text-slate-700 backdrop-blur-sm transition-all hover:border-primary-300 hover:text-primary-600 hover:-translate-y-0.5"
              >
                了解更多
                <ChevronRight className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-float">
          <div className="flex flex-col items-center gap-2 text-slate-400">
            <span className="text-xs">向下滚动</span>
            <div className="h-8 w-5 rounded-full border-2 border-slate-300 p-1">
              <div className="h-2 w-1.5 mx-auto animate-bounce rounded-full bg-slate-400" />
            </div>
          </div>
        </div>
      </section>

      <section id="core-feature" className="relative py-24 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-3xl font-bold text-slate-900 sm:text-4xl">
              核心功能：<span className="gradient-text">影子跟读</span>
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-slate-600">
              两种跟读模式，满足不同学习阶段的需求
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2">
            <div className="group relative overflow-hidden rounded-2xl border border-slate-100 bg-white p-8 shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
              <div className="absolute inset-0 bg-gradient-to-br from-primary-50 to-blue-50 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              <div className="relative">
                <div className="mb-5 inline-flex rounded-xl bg-gradient-to-br from-primary-500 to-blue-600 p-3 text-white shadow-lg">
                  <Zap className="h-6 w-6" />
                </div>
                <h3 className="mb-3 text-2xl font-bold text-slate-900">实时跟读</h3>
                <p className="mb-6 text-slate-600 leading-relaxed">
                  音频持续播放不暂停，你像影子一样延迟0.5秒同步跟读，训练听觉-口腔-大脑协同
                </p>
                <Link
                  to="/shadow-reading"
                  className="inline-flex items-center gap-1 text-sm font-semibold text-primary-600 transition-colors hover:text-primary-700"
                >
                  立即体验
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </div>

            <div className="group relative overflow-hidden rounded-2xl border border-slate-100 bg-white p-8 shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
              <div className="absolute inset-0 bg-gradient-to-br from-accent-50 to-purple-50 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              <div className="relative">
                <div className="mb-5 inline-flex rounded-xl bg-gradient-to-br from-accent-500 to-purple-600 p-3 text-white shadow-lg">
                  <List className="h-6 w-6" />
                </div>
                <h3 className="mb-3 text-2xl font-bold text-slate-900">逐句跟读</h3>
                <p className="mb-6 text-slate-600 leading-relaxed">
                  逐句播放、录音、评分，适合初学者精细纠音，每句话都有六维AI评分反馈
                </p>
                <Link
                  to="/shadow-reading"
                  className="inline-flex items-center gap-1 text-sm font-semibold text-accent-600 transition-colors hover:text-accent-700"
                >
                  立即体验
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="relative py-24 bg-gradient-to-br from-slate-50 to-indigo-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-3xl font-bold text-slate-900 sm:text-4xl">
              <span className="gradient-text">AI 六维评分体系</span>
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-slate-600">
              基于语音科学，全面评估你的口语表现
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {scoreDimensions.map((dim, i) => (
              <div
                key={i}
                className={`group relative overflow-hidden rounded-2xl bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1 border-l-4 ${dim.color}`}
              >
                <div className={`absolute inset-0 ${dim.bg} opacity-0 transition-opacity duration-300 group-hover:opacity-100`} />
                <div className="relative">
                  <div className="mb-4 flex items-center justify-between">
                    <div className={`inline-flex rounded-xl bg-gradient-to-br ${dim.iconBg} p-2.5 text-white shadow-lg`}>
                      <dim.icon className="h-5 w-5" />
                    </div>
                    <span className="text-2xl font-bold gradient-text">{dim.weight}</span>
                  </div>
                  <h3 className="mb-2 text-lg font-bold text-slate-900">{dim.name}</h3>
                  <p className="text-sm text-slate-600">{dim.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative py-24 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-3xl font-bold text-slate-900 sm:text-4xl">
              <span className="gradient-text">丰富素材库</span>
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-slate-600">
              覆盖主流考试和教材，从入门到精通
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {materialCategories.map((cat, i) => (
              <div
                key={i}
                className="group relative overflow-hidden rounded-2xl border border-slate-100 bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary-50/50 to-accent-50/50 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                <div className="relative">
                  <span className="mb-3 block text-3xl">{cat.emoji}</span>
                  <h3 className="mb-2 text-lg font-bold text-slate-900">{cat.name}</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">{cat.description}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10 text-center">
            <Link
              to="/shadow-reading"
              className="group inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-primary-600 to-accent-600 px-6 py-3 text-sm font-semibold text-white shadow-md transition-all hover:shadow-lg hover:-translate-y-0.5"
            >
              查看全部素材
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </section>

      <section className="relative py-24 bg-gradient-to-br from-indigo-50 via-white to-purple-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-3xl font-bold text-slate-900 sm:text-4xl">
              <span className="gradient-text">科学依据</span>
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-slate-600">
              影子跟读法背后的认知科学原理
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {scientificBasis.map((item, i) => (
              <div
                key={i}
                className="group relative overflow-hidden rounded-2xl border border-slate-100 bg-white p-8 shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${item.gradient} opacity-0 transition-opacity duration-300 group-hover:opacity-5`} />
                <div className="relative">
                  <div className={`mb-5 inline-flex rounded-xl bg-gradient-to-br ${item.gradient} p-3 text-white shadow-lg`}>
                    <item.icon className="h-6 w-6" />
                  </div>
                  <h3 className="mb-3 text-xl font-bold text-slate-900">{item.title}</h3>
                  <p className="text-slate-600 leading-relaxed">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative py-24 bg-slate-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-3xl font-bold text-slate-900 sm:text-4xl">
              <span className="gradient-text">更多学习模块</span>
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-slate-600">
              全方位提升英语能力，不止于影子跟读
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {otherFeatures.map((feat, i) => (
              <div
                key={i}
                className="group relative overflow-hidden rounded-2xl bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-2"
              >
                <div className={`absolute top-0 left-0 h-1 w-full bg-gradient-to-r ${feat.gradient}`} />
                <div className={`mb-4 inline-flex rounded-xl bg-gradient-to-br ${feat.gradient} p-3 text-white shadow-lg`}>
                  <feat.icon className="h-6 w-6" />
                </div>
                <h3 className="mb-2 text-lg font-bold text-slate-900">{feat.title}</h3>
                <p className="mb-5 text-sm text-slate-600 leading-relaxed">{feat.description}</p>
                <Link
                  to={feat.link}
                  className="inline-flex items-center gap-1 text-sm font-semibold text-primary-600 transition-colors hover:text-primary-700"
                >
                  立即体验
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative py-24 bg-gradient-to-br from-primary-600 via-accent-600 to-purple-700">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(255,255,255,0.1),transparent_50%)]" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-white sm:text-4xl">
              数据见证实力
            </h2>
            <p className="text-lg text-white/70">
              来自全球学习者的信赖之选
            </p>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat, i) => (
              <div
                key={i}
                className="glass-card rounded-2xl p-8 text-center transition-transform hover:-translate-y-1"
                style={{ background: 'rgba(255,255,255,0.15)', borderColor: 'rgba(255,255,255,0.2)' }}
              >
                <div className="mb-3 inline-flex rounded-xl bg-white/20 p-3 text-white">
                  <stat.icon className="h-6 w-6" />
                </div>
                <AnimatedCounter target={stat.value} suffix={stat.suffix} />
                <p className="mt-2 text-sm text-white/70">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative py-24 overflow-hidden bg-gradient-to-br from-primary-700 via-accent-600 to-purple-800">
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 h-64 w-64 rounded-full bg-white/5 blur-3xl" />
          <div className="absolute bottom-10 right-10 h-80 w-80 rounded-full bg-white/5 blur-3xl" />
        </div>
        <div className="relative mx-auto max-w-4xl px-4 text-center">
          <h2 className="mb-6 text-3xl font-bold text-white sm:text-4xl lg:text-5xl">
            开始你的影子跟读之旅
          </h2>
          <p className="mx-auto mb-10 max-w-2xl text-lg text-white/70">
            加入50,000+学员的行列，用科学的影子跟读法练就地道英语口语。免费体验，立即开始
          </p>
          <Link
            to="/shadow-reading"
            className="group inline-flex items-center gap-2 rounded-xl bg-white px-8 py-4 text-lg font-semibold text-primary-700 shadow-xl transition-all hover:shadow-2xl hover:-translate-y-0.5"
          >
            开始影子跟读
            <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </section>

      <section className="relative py-24 bg-slate-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-3xl font-bold text-slate-900 sm:text-4xl">
              学员 <span className="gradient-text">真实评价</span>
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-slate-600">
              听听他们关于影子跟读的体验
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {testimonials.map((t, i) => (
              <div
                key={i}
                className="rounded-2xl bg-white p-8 shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
              >
                <div className="mb-4 flex gap-1">
                  {[...Array(5)].map((_, j) => (
                    <Star key={j} className="h-4 w-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="mb-6 text-slate-600 leading-relaxed">"{t.quote}"</p>
                <div className="flex items-center gap-4">
                  <img
                    src={t.avatar}
                    alt={t.name}
                    className="h-12 w-12 rounded-full object-cover ring-2 ring-primary-100"
                  />
                  <div>
                    <p className="font-semibold text-slate-900">{t.name}</p>
                    <p className="text-sm text-primary-600">{t.level}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home
