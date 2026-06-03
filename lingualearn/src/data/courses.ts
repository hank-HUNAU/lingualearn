export interface CourseModule {
  id: string;
  title: string;
  lessons: number;
}

export interface Course {
  id: string;
  language: string;
  level: string;
  code: string;
  title: string;
  description: string;
  totalLessons: number;
  duration: string;
  icon: string;
  color: string;
  modules: CourseModule[];
}

export const courses: Course[] = [
  {
    id: "en-a1",
    language: "英语",
    level: "A1",
    code: "EN-A1",
    title: "英语入门",
    description: "从零开始学习英语，掌握基础发音、简单词汇和日常对话，适合完全没有英语基础的学员。",
    totalLessons: 48,
    duration: "3个月",
    icon: "🌱",
    color: "bg-green-500",
    modules: [
      { id: "en-a1-m1", title: "字母与发音", lessons: 6 },
      { id: "en-a1-m2", title: "日常问候", lessons: 6 },
      { id: "en-a1-m3", title: "数字与时间", lessons: 6 },
      { id: "en-a1-m4", title: "家庭与人物", lessons: 6 },
      { id: "en-a1-m5", title: "食物与饮品", lessons: 6 },
      { id: "en-a1-m6", title: "颜色与形状", lessons: 6 },
      { id: "en-a1-m7", title: "基础动词", lessons: 6 },
      { id: "en-a1-m8", title: "简单句型", lessons: 6 }
    ]
  },
  {
    id: "en-a2",
    language: "英语",
    level: "A2",
    code: "EN-A2",
    title: "英语基础",
    description: "巩固基础英语能力，扩展日常词汇量，能够进行简单的日常交流和基本写作。",
    totalLessons: 52,
    duration: "3个月",
    icon: "🌿",
    color: "bg-emerald-500",
    modules: [
      { id: "en-a2-m1", title: "购物与消费", lessons: 6 },
      { id: "en-a2-m2", title: "交通出行", lessons: 6 },
      { id: "en-a2-m3", title: "健康与就医", lessons: 7 },
      { id: "en-a2-m4", title: "天气与季节", lessons: 6 },
      { id: "en-a2-m5", title: "爱好与休闲", lessons: 7 },
      { id: "en-a2-m6", title: "工作与职业", lessons: 6 },
      { id: "en-a2-m7", title: "过去时态", lessons: 7 },
      { id: "en-a2-m8", title: "日常对话进阶", lessons: 7 }
    ]
  },
  {
    id: "en-b1",
    language: "英语",
    level: "B1",
    code: "EN-B1",
    title: "英语中级",
    description: "提升英语综合能力，能够理解较复杂的文本，就熟悉的话题进行流利表达和讨论。",
    totalLessons: 56,
    duration: "4个月",
    icon: "🌳",
    color: "bg-teal-500",
    modules: [
      { id: "en-b1-m1", title: "旅行与冒险", lessons: 7 },
      { id: "en-b1-m2", title: "教育与学习", lessons: 7 },
      { id: "en-b1-m3", title: "科技与生活", lessons: 7 },
      { id: "en-b1-m4", title: "环境与自然", lessons: 7 },
      { id: "en-b1-m5", title: "完成时态", lessons: 7 },
      { id: "en-b1-m6", title: "条件句与虚拟", lessons: 7 },
      { id: "en-b1-m7", title: "被动语态", lessons: 7 },
      { id: "en-b1-m8", title: "观点表达与辩论", lessons: 7 }
    ]
  },
  {
    id: "en-b2",
    language: "英语",
    level: "B2",
    code: "EN-B2",
    title: "英语中高级",
    description: "能够理解复杂文本的主旨，与英语母语者进行较为流畅自然的交流，表达个人观点。",
    totalLessons: 60,
    duration: "4个月",
    icon: "🌲",
    color: "bg-cyan-500",
    modules: [
      { id: "en-b2-m1", title: "社会与文化", lessons: 8 },
      { id: "en-b2-m2", title: "商业与经济", lessons: 8 },
      { id: "en-b2-m3", title: "法律与政治", lessons: 7 },
      { id: "en-b2-m4", title: "艺术与文学", lessons: 7 },
      { id: "en-b2-m5", title: "定语从句进阶", lessons: 8 },
      { id: "en-b2-m6", title: "非谓语动词", lessons: 8 },
      { id: "en-b2-m7", title: "学术写作基础", lessons: 7 },
      { id: "en-b2-m8", title: "演讲与展示", lessons: 7 }
    ]
  },
  {
    id: "en-c1",
    language: "英语",
    level: "C1",
    code: "EN-C1",
    title: "英语高级",
    description: "能够理解广泛的、要求较高的长篇文本，自然流畅地表达思想，适用于社交、学术和专业场合。",
    totalLessons: 64,
    duration: "5个月",
    icon: "🏔️",
    color: "bg-blue-500",
    modules: [
      { id: "en-c1-m1", title: "哲学与思辨", lessons: 8 },
      { id: "en-c1-m2", title: "科学研究方法", lessons: 8 },
      { id: "en-c1-m3", title: "国际关系", lessons: 8 },
      { id: "en-c1-m4", title: "高级写作技巧", lessons: 8 },
      { id: "en-c1-m5", title: "复杂句式分析", lessons: 8 },
      { id: "en-c1-m6", title: "隐喻与修辞", lessons: 8 },
      { id: "en-c1-m7", title: "跨文化交际", lessons: 8 },
      { id: "en-c1-m8", title: "学术论文写作", lessons: 8 }
    ]
  },
  {
    id: "en-c2",
    language: "英语",
    level: "C2",
    code: "EN-C2",
    title: "英语精通",
    description: "达到接近母语者的英语水平，能够理解几乎所有听到和读到的内容，进行高度专业化的表达。",
    totalLessons: 68,
    duration: "6个月",
    icon: "👑",
    color: "bg-indigo-500",
    modules: [
      { id: "en-c2-m1", title: "文学精读", lessons: 9 },
      { id: "en-c2-m2", title: "高级口译技巧", lessons: 9 },
      { id: "en-c2-m3", title: "专业领域术语", lessons: 8 },
      { id: "en-c2-m4", title: "英语语言学", lessons: 8 },
      { id: "en-c2-m5", title: "创意写作", lessons: 9 },
      { id: "en-c2-m6", title: "批判性思维", lessons: 8 },
      { id: "en-c2-m7", title: "英语文化深度", lessons: 8 },
      { id: "en-c2-m8", title: "综合能力提升", lessons: 9 }
    ]
  },
  {
    id: "ja-a1",
    language: "日语",
    level: "A1",
    code: "JA-A1",
    title: "日语入门",
    description: "从五十音图开始学习日语，掌握基础发音、简单词汇和日常寒暄语，适合零基础学员。",
    totalLessons: 48,
    duration: "3个月",
    icon: "🌸",
    color: "bg-pink-500",
    modules: [
      { id: "ja-a1-m1", title: "五十音图·平假名", lessons: 8 },
      { id: "ja-a1-m2", title: "五十音图·片假名", lessons: 6 },
      { id: "ja-a1-m3", title: "日常问候语", lessons: 6 },
      { id: "ja-a1-m4", title: "数字与计数", lessons: 6 },
      { id: "ja-a1-m5", title: "自我介绍", lessons: 6 },
      { id: "ja-a1-m6", title: "时间与日期", lessons: 5 },
      { id: "ja-a1-m7", title: "基础助词", lessons: 5 },
      { id: "ja-a1-m8", title: "简单句型", lessons: 6 }
    ]
  },
  {
    id: "ja-a2",
    language: "日语",
    level: "A2",
    code: "JA-A2",
    title: "日语基础",
    description: "巩固日语基础，扩展日常词汇，掌握基本语法结构，能够进行简单的日常会话。",
    totalLessons: 52,
    duration: "3个月",
    icon: "🎋",
    color: "bg-rose-500",
    modules: [
      { id: "ja-a2-m1", title: "购物与点餐", lessons: 7 },
      { id: "ja-a2-m2", title: "交通与问路", lessons: 6 },
      { id: "ja-a2-m3", title: "动词变形入门", lessons: 7 },
      { id: "ja-a2-m4", title: "形容词与形容动词", lessons: 7 },
      { id: "ja-a2-m5", title: "家庭与生活", lessons: 6 },
      { id: "ja-a2-m6", title: "季节与天气", lessons: 6 },
      { id: "ja-a2-m7", title: "敬语基础", lessons: 7 },
      { id: "ja-a2-m8", title: "日常对话进阶", lessons: 6 }
    ]
  },
  {
    id: "ja-b1",
    language: "日语",
    level: "B1",
    code: "JA-B1",
    title: "日语中级",
    description: "提升日语综合能力，理解较复杂的文本，就熟悉话题进行较为流利的表达，对应JLPT N3水平。",
    totalLessons: 56,
    duration: "4个月",
    icon: "⛩️",
    color: "bg-fuchsia-500",
    modules: [
      { id: "ja-b1-m1", title: "职场日语", lessons: 7 },
      { id: "ja-b1-m2", title: "日本文化", lessons: 7 },
      { id: "ja-b1-m3", title: "复合动词", lessons: 7 },
      { id: "ja-b1-m4", title: "条件表达", lessons: 7 },
      { id: "ja-b1-m5", title: "受身与使役", lessons: 7 },
      { id: "ja-b1-m6", title: "阅读理解训练", lessons: 7 },
      { id: "ja-b1-m7", title: "听力强化", lessons: 7 },
      { id: "ja-b1-m8", title: "中級会話", lessons: 7 }
    ]
  },
  {
    id: "ja-b2",
    language: "日语",
    level: "B2",
    code: "JA-B2",
    title: "日语中高级",
    description: "能够理解复杂文本，与日语母语者进行较为自然流畅的交流，对应JLPT N2水平。",
    totalLessons: 60,
    duration: "4个月",
    icon: "🏯",
    color: "bg-purple-500",
    modules: [
      { id: "ja-b2-m1", title: "商务日语", lessons: 8 },
      { id: "ja-b2-m2", title: "新闻听读", lessons: 7 },
      { id: "ja-b2-m3", title: "高级敬语", lessons: 8 },
      { id: "ja-b2-m4", title: "古典语法入门", lessons: 7 },
      { id: "ja-b2-m5", title: "论文与报告", lessons: 8 },
      { id: "ja-b2-m6", title: "惯用句与谚语", lessons: 7 },
      { id: "ja-b2-m7", title: "长文阅读", lessons: 8 },
      { id: "ja-b2-m8", title: "辩论与讨论", lessons: 7 }
    ]
  },
  {
    id: "ja-c1",
    language: "日语",
    level: "C1",
    code: "JA-C1",
    title: "日语高级",
    description: "达到日语高级水平，能够理解广泛的文本内容，自然流畅地表达思想，对应JLPT N1水平。",
    totalLessons: 64,
    duration: "5个月",
    icon: "🗻",
    color: "bg-violet-500",
    modules: [
      { id: "ja-c1-m1", title: "学术日语", lessons: 8 },
      { id: "ja-c1-m2", title: "文学鉴赏", lessons: 8 },
      { id: "ja-c1-m3", title: "专业领域词汇", lessons: 8 },
      { id: "ja-c1-m4", title: "高级语法结构", lessons: 8 },
      { id: "ja-c1-m5", title: "同声传译基础", lessons: 8 },
      { id: "ja-c1-m6", title: "日语语言学", lessons: 8 },
      { id: "ja-c1-m7", title: "跨文化交际", lessons: 8 },
      { id: "ja-c1-m8", title: "综合实战", lessons: 8 }
    ]
  },
  {
    id: "ja-c2",
    language: "日语",
    level: "C2",
    code: "JA-C2",
    title: "日语精通",
    description: "达到接近母语者的日语水平，能够理解几乎所有内容，进行高度专业化的表达与创作。",
    totalLessons: 68,
    duration: "6个月",
    icon: "🗾",
    color: "bg-slate-500",
    modules: [
      { id: "ja-c2-m1", title: "古典文学精读", lessons: 9 },
      { id: "ja-c2-m2", title: "高级翻译实践", lessons: 9 },
      { id: "ja-c2-m3", title: "专业口译", lessons: 8 },
      { id: "ja-c2-m4", title: "日语教育学", lessons: 8 },
      { id: "ja-c2-m5", title: "创意写作", lessons: 9 },
      { id: "ja-c2-m6", title: "方言与社会语言学", lessons: 8 },
      { id: "ja-c2-m7", title: "日本思想与文化", lessons: 8 },
      { id: "ja-c2-m8", title: "综合能力巅峰", lessons: 9 }
    ]
  },
  {
    id: "ko-a1",
    language: "韩语",
    level: "A1",
    code: "KO-A1",
    title: "韩语入门",
    description: "从韩文字母开始学习韩语，掌握基础发音、简单词汇和日常问候，适合零基础学员。",
    totalLessons: 48,
    duration: "3个月",
    icon: "🇰🇷",
    color: "bg-red-500",
    modules: [
      { id: "ko-a1-m1", title: "韩文字母·辅音", lessons: 8 },
      { id: "ko-a1-m2", title: "韩文字母·元音", lessons: 6 },
      { id: "ko-a1-m3", title: "日常问候语", lessons: 6 },
      { id: "ko-a1-m4", title: "数字与计数", lessons: 6 },
      { id: "ko-a1-m5", title: "自我介绍", lessons: 6 },
      { id: "ko-a1-m6", title: "时间与日期", lessons: 5 },
      { id: "ko-a1-m7", title: "基础助词", lessons: 5 },
      { id: "ko-a1-m8", title: "简单句型", lessons: 6 }
    ]
  },
  {
    id: "ko-a2",
    language: "韩语",
    level: "A2",
    code: "KO-A2",
    title: "韩语基础",
    description: "巩固韩语基础，扩展日常词汇，掌握基本语法结构，能够进行简单的日常会话。",
    totalLessons: 52,
    duration: "3个月",
    icon: "🍲",
    color: "bg-orange-500",
    modules: [
      { id: "ko-a2-m1", title: "购物与点餐", lessons: 7 },
      { id: "ko-a2-m2", title: "交通与方向", lessons: 6 },
      { id: "ko-a2-m3", title: "动词变形入门", lessons: 7 },
      { id: "ko-a2-m4", title: "形容词与修饰", lessons: 7 },
      { id: "ko-a2-m5", title: "家庭与生活", lessons: 6 },
      { id: "ko-a2-m6", title: "季节与天气", lessons: 6 },
      { id: "ko-a2-m7", title: "敬语基础", lessons: 7 },
      { id: "ko-a2-m8", title: "日常对话进阶", lessons: 6 }
    ]
  },
  {
    id: "ko-b1",
    language: "韩语",
    level: "B1",
    code: "KO-B1",
    title: "韩语中级",
    description: "提升韩语综合能力，理解较复杂的文本，就熟悉话题进行较为流利的表达，对应TOPIK III水平。",
    totalLessons: 56,
    duration: "4个月",
    icon: "🎭",
    color: "bg-amber-500",
    modules: [
      { id: "ko-b1-m1", title: "职场韩语", lessons: 7 },
      { id: "ko-b1-m2", title: "韩国文化", lessons: 7 },
      { id: "ko-b1-m3", title: "复合动词", lessons: 7 },
      { id: "ko-b1-m4", title: "条件与推测", lessons: 7 },
      { id: "ko-b1-m5", title: "被动与使动", lessons: 7 },
      { id: "ko-b1-m6", title: "阅读理解训练", lessons: 7 },
      { id: "ko-b1-m7", title: "听力强化", lessons: 7 },
      { id: "ko-b1-m8", title: "中级会话", lessons: 7 }
    ]
  },
  {
    id: "ko-b2",
    language: "韩语",
    level: "B2",
    code: "KO-B2",
    title: "韩语中高级",
    description: "能够理解复杂文本，与韩语母语者进行较为自然流畅的交流，对应TOPIK IV水平。",
    totalLessons: 60,
    duration: "4个月",
    icon: "🏛️",
    color: "bg-yellow-500",
    modules: [
      { id: "ko-b2-m1", title: "商务韩语", lessons: 8 },
      { id: "ko-b2-m2", title: "新闻听读", lessons: 7 },
      { id: "ko-b2-m3", title: "高级敬语", lessons: 8 },
      { id: "ko-b2-m4", title: "惯用表达", lessons: 7 },
      { id: "ko-b2-m5", title: "论文与报告", lessons: 8 },
      { id: "ko-b2-m6", title: "谚语与成语", lessons: 7 },
      { id: "ko-b2-m7", title: "长文阅读", lessons: 8 },
      { id: "ko-b2-m8", title: "辩论与讨论", lessons: 7 }
    ]
  },
  {
    id: "ko-c1",
    language: "韩语",
    level: "C1",
    code: "KO-C1",
    title: "韩语高级",
    description: "达到韩语高级水平，能够理解广泛的文本内容，自然流畅地表达思想，对应TOPIK V水平。",
    totalLessons: 64,
    duration: "5个月",
    icon: "🌟",
    color: "bg-lime-500",
    modules: [
      { id: "ko-c1-m1", title: "学术韩语", lessons: 8 },
      { id: "ko-c1-m2", title: "文学鉴赏", lessons: 8 },
      { id: "ko-c1-m3", title: "专业领域词汇", lessons: 8 },
      { id: "ko-c1-m4", title: "高级语法结构", lessons: 8 },
      { id: "ko-c1-m5", title: "口译基础", lessons: 8 },
      { id: "ko-c1-m6", title: "韩语语言学", lessons: 8 },
      { id: "ko-c1-m7", title: "跨文化交际", lessons: 8 },
      { id: "ko-c1-m8", title: "综合实战", lessons: 8 }
    ]
  },
  {
    id: "ko-c2",
    language: "韩语",
    level: "C2",
    code: "KO-C2",
    title: "韩语精通",
    description: "达到接近母语者的韩语水平，能够理解几乎所有内容，进行高度专业化的表达与创作，对应TOPIK VI水平。",
    totalLessons: 68,
    duration: "6个月",
    icon: "💎",
    color: "bg-emerald-600",
    modules: [
      { id: "ko-c2-m1", title: "古典文学精读", lessons: 9 },
      { id: "ko-c2-m2", title: "高级翻译实践", lessons: 9 },
      { id: "ko-c2-m3", title: "专业口译", lessons: 8 },
      { id: "ko-c2-m4", title: "韩语教育学", lessons: 8 },
      { id: "ko-c2-m5", title: "创意写作", lessons: 9 },
      { id: "ko-c2-m6", title: "方言与社会语言学", lessons: 8 },
      { id: "ko-c2-m7", title: "韩国思想与文化", lessons: 8 },
      { id: "ko-c2-m8", title: "综合能力巅峰", lessons: 9 }
    ]
  }
];
