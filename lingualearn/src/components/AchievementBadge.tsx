import * as LucideIcons from 'lucide-react'
import { Lock } from 'lucide-react'

type Rarity = 'common' | 'rare' | 'epic' | 'legendary'

interface AchievementBadgeProps {
  icon: string
  title: string
  description: string
  unlocked: boolean
  rarity: Rarity
}

const rarityConfig: Record<Rarity, { border: string; glow: string; bg: string; text: string; label: string }> = {
  common: {
    border: 'border-slate-300',
    glow: '',
    bg: 'bg-slate-50',
    text: 'text-slate-600',
    label: '普通',
  },
  rare: {
    border: 'border-primary-300',
    glow: 'shadow-[0_0_15px_rgba(59,130,246,0.3)]',
    bg: 'bg-primary-50',
    text: 'text-primary-600',
    label: '稀有',
  },
  epic: {
    border: 'border-accent-300',
    glow: 'shadow-[0_0_20px_rgba(217,70,239,0.4)]',
    bg: 'bg-accent-50',
    text: 'text-accent-600',
    label: '史诗',
  },
  legendary: {
    border: 'border-amber-300',
    glow: 'shadow-[0_0_25px_rgba(245,158,11,0.5)]',
    bg: 'bg-amber-50',
    text: 'text-amber-600',
    label: '传说',
  },
}

const AchievementBadge: React.FC<AchievementBadgeProps> = ({
  icon,
  title,
  description,
  unlocked,
  rarity,
}) => {
  const config = rarityConfig[rarity]
  const IconComponent = (LucideIcons as unknown as Record<string, React.ComponentType<{ className?: string }>>)[icon]

  if (!unlocked) {
    return (
      <div className="flex flex-col items-center gap-2 rounded-2xl border border-slate-200 bg-slate-100 p-5 opacity-60 grayscale transition-transform hover:scale-105">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-slate-200">
          <Lock className="h-6 w-6 text-slate-400" />
        </div>
        <h3 className="text-sm font-medium text-slate-400">{title}</h3>
        <p className="text-center text-xs text-slate-400">{description}</p>
        <span className="rounded-full bg-slate-200 px-2 py-0.5 text-xs text-slate-400">未解锁</span>
      </div>
    )
  }

  return (
    <div
      className={`flex flex-col items-center gap-2 rounded-2xl border-2 ${config.border} ${config.bg} ${config.glow} p-5 transition-transform hover:scale-105`}
    >
      <div className={`flex h-14 w-14 items-center justify-center rounded-full ${config.bg} ${config.text}`}>
        {IconComponent ? <IconComponent className="h-7 w-7" /> : <LucideIcons.Star className="h-7 w-7" />}
      </div>
      <h3 className="text-sm font-semibold text-slate-800">{title}</h3>
      <p className="text-center text-xs text-slate-500">{description}</p>
      <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${config.bg} ${config.text}`}>
        {config.label}
      </span>
    </div>
  )
}

export default AchievementBadge
