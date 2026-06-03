import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { BookOpen, User, Mail, Lock, Eye, EyeOff } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

const languages = [
  { id: 'en', label: '英语', flag: '🇬🇧' },
  { id: 'ja', label: '日语', flag: '🇯🇵' },
  { id: 'ko', label: '韩语', flag: '🇰🇷' },
]

const levels = [
  { id: 'beginner', label: '零基础', description: '从未接触过该语言' },
  { id: 'elementary', label: '初级', description: '掌握基础词汇和简单句型' },
  { id: 'intermediate', label: '中级', description: '能进行日常对话交流' },
  { id: 'advanced', label: '高级', description: '能流利表达和理解复杂内容' },
]

const Register: React.FC = () => {
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([])
  const [selectedLevel, setSelectedLevel] = useState('')
  const [error, setError] = useState('')
  const { register, isLoading } = useAuth()
  const navigate = useNavigate()

  const toggleLanguage = (id: string) => {
    setSelectedLanguages((prev) =>
      prev.includes(id) ? prev.filter((l) => l !== id) : [...prev, id]
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (password !== confirmPassword) {
      setError('两次输入的密码不一致')
      return
    }

    if (password.length < 6) {
      setError('密码长度至少6位')
      return
    }

    try {
      await register(username, email, password)
      navigate('/')
    } catch {
      setError('注册失败，请稍后重试')
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 px-4 py-12">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 h-80 w-80 rounded-full bg-primary-200/30 blur-3xl" />
        <div className="absolute -bottom-40 -right-40 h-80 w-80 rounded-full bg-accent-200/30 blur-3xl" />
      </div>

      <div className="relative w-full max-w-md animate-slide-up">
        <div className="glass-card rounded-3xl p-8 shadow-xl sm:p-10">
          <div className="mb-8 text-center">
            <Link to="/" className="mb-6 inline-flex items-center gap-2">
              <BookOpen className="h-8 w-8 text-primary-600" />
              <span className="gradient-text text-2xl font-bold">LinguaLearn</span>
            </Link>
            <h2 className="mt-4 text-2xl font-bold text-slate-900">创建账户</h2>
            <p className="mt-2 text-sm text-slate-500">开启你的语言学习之旅</p>
          </div>

          {error && (
            <div className="mb-6 rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-600">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">用户名</label>
              <div className="relative">
                <User className="absolute top-1/2 left-3.5 h-4.5 w-4.5 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="请输入用户名"
                  required
                  className="w-full rounded-xl border border-slate-200 bg-white/80 py-3 pr-4 pl-11 text-sm text-slate-900 transition-all placeholder:text-slate-400 focus:border-primary-400 focus:ring-2 focus:ring-primary-100 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">邮箱</label>
              <div className="relative">
                <Mail className="absolute top-1/2 left-3.5 h-4.5 w-4.5 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="请输入邮箱地址"
                  required
                  className="w-full rounded-xl border border-slate-200 bg-white/80 py-3 pr-4 pl-11 text-sm text-slate-900 transition-all placeholder:text-slate-400 focus:border-primary-400 focus:ring-2 focus:ring-primary-100 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">密码</label>
              <div className="relative">
                <Lock className="absolute top-1/2 left-3.5 h-4.5 w-4.5 -translate-y-1/2 text-slate-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="请输入密码（至少6位）"
                  required
                  className="w-full rounded-xl border border-slate-200 bg-white/80 py-3 pr-11 pl-11 text-sm text-slate-900 transition-all placeholder:text-slate-400 focus:border-primary-400 focus:ring-2 focus:ring-primary-100 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute top-1/2 right-3.5 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="h-4.5 w-4.5" /> : <Eye className="h-4.5 w-4.5" />}
                </button>
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">确认密码</label>
              <div className="relative">
                <Lock className="absolute top-1/2 left-3.5 h-4.5 w-4.5 -translate-y-1/2 text-slate-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="请再次输入密码"
                  required
                  className="w-full rounded-xl border border-slate-200 bg-white/80 py-3 pr-4 pl-11 text-sm text-slate-900 transition-all placeholder:text-slate-400 focus:border-primary-400 focus:ring-2 focus:ring-primary-100 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">感兴趣的语言</label>
              <div className="flex gap-3">
                {languages.map((lang) => (
                  <button
                    key={lang.id}
                    type="button"
                    onClick={() => toggleLanguage(lang.id)}
                    className={`flex flex-1 items-center justify-center gap-1.5 rounded-xl border-2 py-2.5 text-sm font-medium transition-all ${
                      selectedLanguages.includes(lang.id)
                        ? 'border-primary-400 bg-primary-50 text-primary-700'
                        : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    <span>{lang.flag}</span>
                    {lang.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">当前水平</label>
              <div className="grid grid-cols-2 gap-2">
                {levels.map((level) => (
                  <button
                    key={level.id}
                    type="button"
                    onClick={() => setSelectedLevel(level.id)}
                    className={`rounded-xl border-2 px-3 py-2.5 text-left transition-all ${
                      selectedLevel === level.id
                        ? 'border-primary-400 bg-primary-50'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <p className={`text-sm font-medium ${selectedLevel === level.id ? 'text-primary-700' : 'text-slate-700'}`}>
                      {level.label}
                    </p>
                    <p className="text-xs text-slate-400">{level.description}</p>
                  </button>
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full rounded-xl bg-gradient-to-r from-primary-600 to-accent-600 py-3 text-sm font-semibold text-white shadow-lg shadow-primary-500/25 transition-all hover:shadow-xl hover:shadow-primary-500/40 disabled:opacity-60"
            >
              {isLoading ? '注册中...' : '注册'}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-500">
            已有账户？{' '}
            <Link to="/login" className="font-semibold text-primary-600 hover:text-primary-700">
              立即登录
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Register
