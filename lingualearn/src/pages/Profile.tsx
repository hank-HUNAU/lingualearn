import { useState } from "react";
import { Edit, Settings, Shield, Trash2, Bell, Globe, Target } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useLearning } from "../context/LearningContext";
import ProgressRing from "../components/ProgressRing";

const Profile: React.FC = () => {
  const { user } = useAuth();
  const { progress } = useLearning();

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editUsername, setEditUsername] = useState(user?.username ?? "");
  const [editEmail, setEditEmail] = useState(user?.email ?? "");
  const [editBio, setEditBio] = useState("");
  const [notifications, setNotifications] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(false);
  const [dailyGoal, setDailyGoal] = useState(progress.dailyGoal);
  const [targetLanguage, setTargetLanguage] = useState("日语");
  const [difficulty, setDifficulty] = useState("中级");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const username = user?.username ?? "学习者";
  const email = user?.email ?? "learner@example.com";
  const joinDate = user?.joinDate ?? new Date().toISOString().split("T")[0];
  const level = user?.level ?? "A1";
  const avatarColor = "#6366f1";

  const skills = [
    { name: "语法", score: progress.grammarScore, color: "#6366f1" },
    { name: "听力", score: progress.listeningScore, color: "#0ea5e9" },
    { name: "口语", score: progress.speakingScore, color: "#10b981" },
    { name: "词汇", score: Math.min((progress.vocabularyMastered.length / 50) * 100, 100), color: "#f59e0b" },
  ];

  const stats = [
    { label: "学习天数", value: progress.streak, icon: "📅" },
    { label: "掌握单词", value: progress.vocabularyMastered.length, icon: "📖" },
    { label: "完成课程", value: progress.completedLessons.length, icon: "🎓" },
    { label: "总经验值", value: progress.xp, icon: "⭐" },
  ];

  const levelColors: Record<string, string> = {
    A1: "bg-emerald-100 text-emerald-700",
    A2: "bg-blue-100 text-blue-700",
    B1: "bg-indigo-100 text-indigo-700",
    B2: "bg-purple-100 text-purple-700",
    C1: "bg-rose-100 text-rose-700",
    C2: "bg-amber-100 text-amber-700",
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden mb-6">
          <div className="h-32 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />
          <div className="px-6 pb-6">
            <div className="flex items-end gap-4 -mt-12">
              <div
                className="w-24 h-24 rounded-2xl flex items-center justify-center text-white text-3xl font-bold border-4 border-white shadow-lg"
                style={{ backgroundColor: avatarColor }}
              >
                {username[0]}
              </div>
              <div className="flex-1 pb-1">
                <div className="flex items-center gap-3">
                  <h1 className="text-2xl font-bold text-slate-800">{username}</h1>
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${levelColors[level] ?? "bg-slate-100 text-slate-600"}`}>
                    {level}
                  </span>
                </div>
                <p className="text-sm text-slate-500 mt-0.5">{email}</p>
              </div>
              <button
                onClick={() => {
                  setEditUsername(username);
                  setEditEmail(email);
                  setIsEditModalOpen(true);
                }}
                className="flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-600 rounded-xl text-sm font-medium hover:bg-indigo-100 transition-colors"
              >
                <Edit className="w-4 h-4" />
                编辑资料
              </button>
            </div>
            <div className="flex items-center gap-4 mt-4 text-sm text-slate-500">
              <span>加入于 {joinDate}</span>
              <span>·</span>
              <span>连续学习 {progress.streak} 天</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4 text-center"
            >
              <div className="text-2xl mb-1">{stat.icon}</div>
              <div className="text-2xl font-bold text-slate-800">{stat.value}</div>
              <div className="text-xs text-slate-500 mt-0.5">{stat.label}</div>
            </div>
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
            <h2 className="text-lg font-semibold text-slate-800 mb-5">技能概览</h2>
            <div className="flex justify-center mb-6">
              <ProgressRing
                progress={Math.round(
                  skills.reduce((sum, s) => sum + s.score, 0) / skills.length
                )}
                size={140}
                strokeWidth={10}
                color="#6366f1"
              />
            </div>
            <div className="space-y-4">
              {skills.map((skill) => (
                <div key={skill.name}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-sm font-medium text-slate-600">{skill.name}</span>
                    <span className="text-sm font-semibold text-slate-800">{Math.round(skill.score)}%</span>
                  </div>
                  <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{ width: `${skill.score}%`, backgroundColor: skill.color }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
            <div className="flex items-center gap-2 mb-5">
              <Settings className="w-5 h-5 text-indigo-500" />
              <h2 className="text-lg font-semibold text-slate-800">学习偏好</h2>
            </div>

            <div className="space-y-6">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Globe className="w-4 h-4 text-slate-400" />
                  <label className="text-sm font-medium text-slate-600">目标语言</label>
                </div>
                <select
                  value={targetLanguage}
                  onChange={(e) => setTargetLanguage(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  <option value="日语">日语</option>
                  <option value="英语">英语</option>
                  <option value="法语">法语</option>
                  <option value="韩语">韩语</option>
                  <option value="德语">德语</option>
                  <option value="西班牙语">西班牙语</option>
                  <option value="意大利语">意大利语</option>
                </select>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Target className="w-4 h-4 text-slate-400" />
                    <label className="text-sm font-medium text-slate-600">每日目标</label>
                  </div>
                  <span className="text-sm font-semibold text-indigo-600">{dailyGoal} 分钟</span>
                </div>
                <input
                  type="range"
                  min={10}
                  max={120}
                  step={5}
                  value={dailyGoal}
                  onChange={(e) => setDailyGoal(Number(e.target.value))}
                  className="w-full h-2 bg-slate-100 rounded-full appearance-none cursor-pointer accent-indigo-500"
                />
                <div className="flex justify-between text-xs text-slate-400 mt-1">
                  <span>10分钟</span>
                  <span>120分钟</span>
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Shield className="w-4 h-4 text-slate-400" />
                  <label className="text-sm font-medium text-slate-600">难度偏好</label>
                </div>
                <div className="flex gap-2">
                  {["初级", "中级", "高级"].map((d) => (
                    <button
                      key={d}
                      onClick={() => setDifficulty(d)}
                      className={`flex-1 py-2 rounded-xl text-sm font-medium transition-all ${
                        difficulty === d
                          ? "bg-indigo-500 text-white shadow-md shadow-indigo-200"
                          : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                      }`}
                    >
                      {d}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 mb-6">
          <div className="flex items-center gap-2 mb-5">
            <Bell className="w-5 h-5 text-indigo-500" />
            <h2 className="text-lg font-semibold text-slate-800">通知设置</h2>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-700">推送通知</p>
                <p className="text-xs text-slate-400">接收学习提醒和社区消息</p>
              </div>
              <button
                onClick={() => setNotifications(!notifications)}
                className={`relative w-11 h-6 rounded-full transition-colors ${
                  notifications ? "bg-indigo-500" : "bg-slate-300"
                }`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                    notifications ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-700">邮件通知</p>
                <p className="text-xs text-slate-400">接收每周学习报告</p>
              </div>
              <button
                onClick={() => setEmailNotifications(!emailNotifications)}
                className={`relative w-11 h-6 rounded-full transition-colors ${
                  emailNotifications ? "bg-indigo-500" : "bg-slate-300"
                }`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                    emailNotifications ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-red-100 p-6">
          <div className="flex items-center gap-2 mb-2">
            <Trash2 className="w-5 h-5 text-red-500" />
            <h2 className="text-lg font-semibold text-red-600">危险区域</h2>
          </div>
          <p className="text-sm text-slate-500 mb-4">删除账户后，所有学习数据将无法恢复。</p>
          {!showDeleteConfirm ? (
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="px-4 py-2 bg-red-50 text-red-600 border border-red-200 rounded-xl text-sm font-medium hover:bg-red-100 transition-colors"
            >
              删除账户
            </button>
          ) : (
            <div className="flex items-center gap-3 p-4 bg-red-50 rounded-xl">
              <p className="text-sm text-red-700 font-medium">确定要删除账户吗？此操作不可撤销。</p>
              <div className="flex gap-2 shrink-0">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="px-3 py-1.5 bg-white text-slate-600 border border-slate-200 rounded-lg text-sm hover:bg-slate-50 transition-colors"
                >
                  取消
                </button>
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="px-3 py-1.5 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700 transition-colors"
                >
                  确认删除
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="p-6">
              <h2 className="text-xl font-bold text-slate-800 mb-5">编辑资料</h2>

              <div className="mb-4">
                <label className="block text-sm font-medium text-slate-600 mb-1.5">用户名</label>
                <input
                  type="text"
                  value={editUsername}
                  onChange={(e) => setEditUsername(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-slate-600 mb-1.5">邮箱</label>
                <input
                  type="email"
                  value={editEmail}
                  onChange={(e) => setEditEmail(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-slate-600 mb-1.5">个人简介</label>
                <textarea
                  value={editBio}
                  onChange={(e) => setEditBio(e.target.value)}
                  placeholder="介绍一下自己..."
                  rows={3}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                />
              </div>

              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-5 py-2.5 text-sm font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
                >
                  取消
                </button>
                <button
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-5 py-2.5 text-sm font-medium text-white bg-indigo-500 hover:bg-indigo-600 rounded-xl transition-colors"
                >
                  保存
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
