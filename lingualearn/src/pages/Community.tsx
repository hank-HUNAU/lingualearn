import { useState } from "react";
import { Heart, MessageCircle, Plus, Search, Tag, TrendingUp, Users } from "lucide-react";

interface Post {
  id: number;
  author: string;
  avatar: string;
  content: string;
  tags: string[];
  likes: number;
  comments: number;
  timestamp: string;
  category: string;
  liked: boolean;
}

const initialPosts: Post[] = [
  {
    id: 1,
    author: "小明",
    avatar: "#6366f1",
    content: "今天终于把日语N3的语法全部学完了！感觉助词的用法清晰多了，特别是は和が的区别。分享一个小技巧：は强调后面的内容，が强调前面的主语。",
    tags: ["日语", "语法", "学习心得"],
    likes: 24,
    comments: 8,
    timestamp: "10分钟前",
    category: "学习心得",
    liked: false,
  },
  {
    id: 2,
    author: "语学达人",
    avatar: "#ec4899",
    content: "请问有没有好的法语听力材料推荐？目前A2水平，觉得BBC的法语节目有点难，想找一些适合中级学习者的资源。",
    tags: ["法语", "听力", "求助"],
    likes: 12,
    comments: 15,
    timestamp: "30分钟前",
    category: "提问求助",
    liked: false,
  },
  {
    id: 3,
    author: "LinguaFan",
    avatar: "#f59e0b",
    content: "推荐一个超好用的西班牙语播客：Notes in Spanish。从初级到高级都有，主持人是一对西班牙夫妻，对话非常自然，而且免费！",
    tags: ["西班牙语", "资源", "播客"],
    likes: 38,
    comments: 6,
    timestamp: "1小时前",
    category: "资源分享",
    liked: false,
  },
  {
    id: 4,
    author: "坚持就是胜利",
    avatar: "#10b981",
    content: "第30天打卡！🎉 连续学习韩语一个月了，从完全零基础到现在能读韩文，虽然还不太懂意思，但感觉进步很大！加油！",
    tags: ["韩语", "打卡", "坚持"],
    likes: 56,
    comments: 12,
    timestamp: "2小时前",
    category: "打卡签到",
    liked: false,
  },
  {
    id: 5,
    author: "多语种爱好者",
    avatar: "#8b5cf6",
    content: "分享一个记忆单词的方法：用Anki制作自己的记忆卡片，配合图片和例句，比单纯背单词表效率高很多。关键是每天都要复习！",
    tags: ["学习方法", "单词", "Anki"],
    likes: 42,
    comments: 9,
    timestamp: "3小时前",
    category: "学习心得",
    liked: false,
  },
  {
    id: 6,
    author: "德语小白",
    avatar: "#ef4444",
    content: "德语的格变化真的太难了！der、den、dem、des完全分不清，有没有大佬能解释一下什么时候用哪个？",
    tags: ["德语", "语法", "求助"],
    likes: 18,
    comments: 21,
    timestamp: "4小时前",
    category: "提问求助",
    liked: false,
  },
  {
    id: 7,
    author: "英语进阶者",
    avatar: "#0ea5e9",
    content: "推荐一个英语写作工具：Grammarly。不仅能检查语法错误，还能给出风格建议，对提升写作水平很有帮助。免费版就够用了。",
    tags: ["英语", "写作", "工具"],
    likes: 31,
    comments: 4,
    timestamp: "5小时前",
    category: "资源分享",
    liked: false,
  },
  {
    id: 8,
    author: "每日一语",
    avatar: "#14b8a6",
    content: "第15天打卡！今天学了意大利语的过去时态，比想象中简单。坚持每天学习30分钟，积少成多！",
    tags: ["意大利语", "打卡", "语法"],
    likes: 22,
    comments: 5,
    timestamp: "6小时前",
    category: "打卡签到",
    liked: false,
  },
];

const tabs = ["全部", "学习心得", "提问求助", "资源分享", "打卡签到"];

const hotTopics = [
  { tag: "日语N3", count: 128 },
  { tag: "单词记忆法", count: 96 },
  { tag: "英语口语", count: 87 },
  { tag: "法语入门", count: 65 },
  { tag: "韩语发音", count: 54 },
];

const activeUsers = [
  { name: "多语种爱好者", avatar: "#8b5cf6", posts: 42 },
  { name: "坚持就是胜利", avatar: "#10b981", posts: 38 },
  { name: "语学达人", avatar: "#ec4899", posts: 35 },
  { name: "LinguaFan", avatar: "#f59e0b", posts: 29 },
];

const studyGroups = [
  { name: "日语N3冲刺群", members: 156, color: "#6366f1" },
  { name: "法语角", members: 98, color: "#ec4899" },
  { name: "英语写作互助", members: 234, color: "#0ea5e9" },
  { name: "韩语入门组", members: 87, color: "#10b981" },
];

const tagOptions = ["日语", "法语", "英语", "韩语", "德语", "西班牙语", "语法", "听力", "口语", "学习方法", "资源", "打卡"];

const Community: React.FC = () => {
  const [activeTab, setActiveTab] = useState("全部");
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newPostTitle, setNewPostTitle] = useState("");
  const [newPostContent, setNewPostContent] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [newPostCategory, setNewPostCategory] = useState("学习心得");

  const filteredPosts = posts.filter((post) => {
    const matchesTab = activeTab === "全部" || post.category === activeTab;
    const matchesSearch =
      searchQuery === "" ||
      post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesTab && matchesSearch;
  });

  const toggleLike = (postId: number) => {
    setPosts((prev) =>
      prev.map((post) =>
        post.id === postId
          ? { ...post, liked: !post.liked, likes: post.liked ? post.likes - 1 : post.likes + 1 }
          : post
      )
    );
  };

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleSubmitPost = () => {
    if (!newPostContent.trim()) return;

    const newPost: Post = {
      id: Date.now(),
      author: "我",
      avatar: "#6366f1",
      content: newPostContent.trim(),
      tags: selectedTags,
      likes: 0,
      comments: 0,
      timestamp: "刚刚",
      category: newPostCategory,
      liked: false,
    };

    setPosts((prev) => [newPost, ...prev]);
    setNewPostContent("");
    setNewPostTitle("");
    setSelectedTags([]);
    setIsModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-800 mb-2">学习社区</h1>
          <p className="text-slate-500">与全球语言学习者交流心得、分享资源</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          <div className="flex-1">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4 mb-6">
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  placeholder="搜索帖子、用户或标签..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                />
              </div>
              <div className="flex gap-2 overflow-x-auto pb-1">
                {tabs.map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                      activeTab === tab
                        ? "bg-indigo-500 text-white shadow-md shadow-indigo-200"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              {filteredPosts.map((post) => (
                <div
                  key={post.id}
                  className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start gap-3">
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold text-sm shrink-0"
                      style={{ backgroundColor: post.avatar }}
                    >
                      {post.author[0]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-slate-800">{post.author}</span>
                        <span className="text-xs text-slate-400">{post.timestamp}</span>
                        <span className="text-xs px-2 py-0.5 bg-indigo-50 text-indigo-600 rounded-full">
                          {post.category}
                        </span>
                      </div>
                      <p className="text-slate-600 text-sm leading-relaxed mb-3">{post.content}</p>
                      <div className="flex items-center gap-2 flex-wrap mb-3">
                        {post.tags.map((tag) => (
                          <span
                            key={tag}
                            className="inline-flex items-center gap-1 text-xs px-2 py-1 bg-slate-50 text-slate-500 rounded-md"
                          >
                            <Tag className="w-3 h-3" />
                            {tag}
                          </span>
                        ))}
                      </div>
                      <div className="flex items-center gap-4">
                        <button
                          onClick={() => toggleLike(post.id)}
                          className={`flex items-center gap-1.5 text-sm transition-colors ${
                            post.liked ? "text-rose-500" : "text-slate-400 hover:text-rose-500"
                          }`}
                        >
                          <Heart className={`w-4 h-4 ${post.liked ? "fill-current" : ""}`} />
                          <span>{post.likes}</span>
                        </button>
                        <button className="flex items-center gap-1.5 text-sm text-slate-400 hover:text-indigo-500 transition-colors">
                          <MessageCircle className="w-4 h-4" />
                          <span>{post.comments}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {filteredPosts.length === 0 && (
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-12 text-center">
                  <Search className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                  <p className="text-slate-400">没有找到相关帖子</p>
                </div>
              )}
            </div>
          </div>

          <div className="lg:w-80 space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="w-5 h-5 text-orange-500" />
                <h3 className="font-semibold text-slate-800">热门话题</h3>
              </div>
              <div className="space-y-3">
                {hotTopics.map((topic, index) => (
                  <div key={topic.tag} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span
                        className={`w-5 h-5 rounded flex items-center justify-center text-xs font-bold text-white ${
                          index < 3 ? "bg-orange-500" : "bg-slate-300"
                        }`}
                      >
                        {index + 1}
                      </span>
                      <span className="text-sm text-slate-600">{topic.tag}</span>
                    </div>
                    <span className="text-xs text-slate-400">{topic.count} 讨论</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
              <div className="flex items-center gap-2 mb-4">
                <Users className="w-5 h-5 text-indigo-500" />
                <h3 className="font-semibold text-slate-800">活跃用户</h3>
              </div>
              <div className="space-y-3">
                {activeUsers.map((user) => (
                  <div key={user.name} className="flex items-center gap-3">
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center text-white font-semibold text-xs"
                      style={{ backgroundColor: user.avatar }}
                    >
                      {user.name[0]}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-slate-700">{user.name}</p>
                      <p className="text-xs text-slate-400">{user.posts} 篇帖子</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
              <div className="flex items-center gap-2 mb-4">
                <Users className="w-5 h-5 text-emerald-500" />
                <h3 className="font-semibold text-slate-800">学习小组</h3>
              </div>
              <div className="space-y-3">
                {studyGroups.map((group) => (
                  <div
                    key={group.name}
                    className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 cursor-pointer transition-colors"
                  >
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-bold"
                      style={{ backgroundColor: group.color }}
                    >
                      {group.name[0]}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-slate-700">{group.name}</p>
                      <p className="text-xs text-slate-400">{group.members} 名成员</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <button
        onClick={() => setIsModalOpen(true)}
        className="fixed bottom-8 right-8 w-14 h-14 bg-indigo-500 hover:bg-indigo-600 text-white rounded-full shadow-lg shadow-indigo-200 flex items-center justify-center transition-all hover:scale-110 active:scale-95"
      >
        <Plus className="w-6 h-6" />
      </button>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg">
            <div className="p-6">
              <h2 className="text-xl font-bold text-slate-800 mb-5">发布新帖</h2>

              <div className="mb-4">
                <label className="block text-sm font-medium text-slate-600 mb-1.5">分类</label>
                <div className="flex gap-2 flex-wrap">
                  {tabs.filter((t) => t !== "全部").map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setNewPostCategory(tab)}
                      className={`px-3 py-1.5 rounded-lg text-sm transition-all ${
                        newPostCategory === tab
                          ? "bg-indigo-500 text-white"
                          : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-slate-600 mb-1.5">标题</label>
                <input
                  type="text"
                  value={newPostTitle}
                  onChange={(e) => setNewPostTitle(e.target.value)}
                  placeholder="输入帖子标题..."
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-slate-600 mb-1.5">内容</label>
                <textarea
                  value={newPostContent}
                  onChange={(e) => setNewPostContent(e.target.value)}
                  placeholder="分享你的学习心得..."
                  rows={4}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                />
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-slate-600 mb-1.5">标签</label>
                <div className="flex gap-2 flex-wrap">
                  {tagOptions.map((tag) => (
                    <button
                      key={tag}
                      onClick={() => toggleTag(tag)}
                      className={`px-3 py-1.5 rounded-lg text-sm transition-all ${
                        selectedTags.includes(tag)
                          ? "bg-indigo-500 text-white"
                          : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                      }`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 text-sm font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
                >
                  取消
                </button>
                <button
                  onClick={handleSubmitPost}
                  disabled={!newPostContent.trim()}
                  className="px-5 py-2.5 text-sm font-medium text-white bg-indigo-500 hover:bg-indigo-600 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  发布
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Community;
