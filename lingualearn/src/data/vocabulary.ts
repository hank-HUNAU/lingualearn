export type VocabularyCategory = "日常" | "旅行" | "商务" | "学术";
export type VocabularyLevel = "A1" | "A2" | "B1" | "B2" | "C1" | "C2";

export interface VocabularyWord {
  id: string;
  word: string;
  phonetic: string;
  meaning: string;
  example: string;
  exampleTranslation: string;
  category: VocabularyCategory;
  level: VocabularyLevel;
}

export const vocabulary: VocabularyWord[] = [
  {
    id: "v001",
    word: "hello",
    phonetic: "/həˈloʊ/",
    meaning: "你好；喂",
    example: "Hello, how are you today?",
    exampleTranslation: "你好，你今天怎么样？",
    category: "日常",
    level: "A1"
  },
  {
    id: "v002",
    word: "goodbye",
    phonetic: "/ɡʊdˈbaɪ/",
    meaning: "再见；告别",
    example: "Goodbye, see you tomorrow!",
    exampleTranslation: "再见，明天见！",
    category: "日常",
    level: "A1"
  },
  {
    id: "v003",
    word: "breakfast",
    phonetic: "/ˈbrekfəst/",
    meaning: "早餐",
    example: "I usually have breakfast at seven o'clock.",
    exampleTranslation: "我通常在七点吃早餐。",
    category: "日常",
    level: "A1"
  },
  {
    id: "v004",
    word: "weather",
    phonetic: "/ˈweðər/",
    meaning: "天气",
    example: "The weather is beautiful today.",
    exampleTranslation: "今天天气很好。",
    category: "日常",
    level: "A1"
  },
  {
    id: "v005",
    word: "friend",
    phonetic: "/frend/",
    meaning: "朋友",
    example: "She is my best friend from school.",
    exampleTranslation: "她是我学校里最好的朋友。",
    category: "日常",
    level: "A1"
  },
  {
    id: "v006",
    word: "schedule",
    phonetic: "/ˈskedʒuːl/",
    meaning: "日程安排；时间表",
    example: "My schedule is very busy this week.",
    exampleTranslation: "我这周的日程安排非常满。",
    category: "日常",
    level: "A2"
  },
  {
    id: "v007",
    word: "appointment",
    phonetic: "/əˈpɔɪntmənt/",
    meaning: "预约；约会",
    example: "I have an appointment with the doctor at 3 PM.",
    exampleTranslation: "我下午三点和医生有预约。",
    category: "日常",
    level: "A2"
  },
  {
    id: "v008",
    word: "grocery",
    phonetic: "/ˈɡroʊsəri/",
    meaning: "杂货；食品",
    example: "We need to buy some groceries for the week.",
    exampleTranslation: "我们需要买一些这周的食品杂货。",
    category: "日常",
    level: "A2"
  },
  {
    id: "v009",
    word: "neighbor",
    phonetic: "/ˈneɪbər/",
    meaning: "邻居",
    example: "Our neighbors are very friendly and helpful.",
    exampleTranslation: "我们的邻居非常友好且乐于助人。",
    category: "日常",
    level: "A2"
  },
  {
    id: "v010",
    word: "commute",
    phonetic: "/kəˈmjuːt/",
    meaning: "通勤；上下班",
    example: "I commute to work by subway every day.",
    exampleTranslation: "我每天坐地铁通勤上班。",
    category: "日常",
    level: "B1"
  },
  {
    id: "v011",
    word: "luggage",
    phonetic: "/ˈlʌɡɪdʒ/",
    meaning: "行李",
    example: "Please make sure your luggage is properly tagged.",
    exampleTranslation: "请确保您的行李已正确贴上标签。",
    category: "旅行",
    level: "A1"
  },
  {
    id: "v012",
    word: "passport",
    phonetic: "/ˈpæspɔːrt/",
    meaning: "护照",
    example: "Don't forget to bring your passport to the airport.",
    exampleTranslation: "别忘了带护照去机场。",
    category: "旅行",
    level: "A1"
  },
  {
    id: "v013",
    word: "hotel",
    phonetic: "/hoʊˈtel/",
    meaning: "酒店；旅馆",
    example: "We booked a hotel near the city center.",
    exampleTranslation: "我们在市中心附近订了一家酒店。",
    category: "旅行",
    level: "A1"
  },
  {
    id: "v014",
    word: "destination",
    phonetic: "/ˌdestɪˈneɪʃn/",
    meaning: "目的地",
    example: "Our destination is Paris, France.",
    exampleTranslation: "我们的目的地是法国巴黎。",
    category: "旅行",
    level: "A2"
  },
  {
    id: "v015",
    word: "itinerary",
    phonetic: "/aɪˈtɪnəreri/",
    meaning: "行程安排；旅行路线",
    example: "The travel agent prepared a detailed itinerary for us.",
    exampleTranslation: "旅行社为我们准备了详细的行程安排。",
    category: "旅行",
    level: "B1"
  },
  {
    id: "v016",
    word: "customs",
    phonetic: "/ˈkʌstəmz/",
    meaning: "海关",
    example: "We had to go through customs at the border.",
    exampleTranslation: "我们必须在边境通过海关检查。",
    category: "旅行",
    level: "B1"
  },
  {
    id: "v017",
    word: "excursion",
    phonetic: "/ɪkˈskɜːrʒn/",
    meaning: "短途旅行；远足",
    example: "The resort offers various excursions for guests.",
    exampleTranslation: "度假村为客人提供各种短途旅行。",
    category: "旅行",
    level: "B2"
  },
  {
    id: "v018",
    word: "expedition",
    phonetic: "/ˌekspəˈdɪʃn/",
    meaning: "探险；远征",
    example: "The scientific expedition lasted three months.",
    exampleTranslation: "这次科学探险持续了三个月。",
    category: "旅行",
    level: "C1"
  },
  {
    id: "v019",
    word: "meeting",
    phonetic: "/ˈmiːtɪŋ/",
    meaning: "会议；会面",
    example: "The meeting is scheduled for 10 AM in the conference room.",
    exampleTranslation: "会议定于上午十点在会议室举行。",
    category: "商务",
    level: "A2"
  },
  {
    id: "v020",
    word: "contract",
    phonetic: "/ˈkɑːntrækt/",
    meaning: "合同；合约",
    example: "Both parties signed the contract yesterday.",
    exampleTranslation: "双方昨天签署了合同。",
    category: "商务",
    level: "B1"
  },
  {
    id: "v021",
    word: "negotiate",
    phonetic: "/nɪˈɡoʊʃieɪt/",
    meaning: "谈判；协商",
    example: "We need to negotiate the terms of the agreement.",
    exampleTranslation: "我们需要协商协议的条款。",
    category: "商务",
    level: "B2"
  },
  {
    id: "v022",
    word: "revenue",
    phonetic: "/ˈrevənuː/",
    meaning: "收入；税收",
    example: "The company's annual revenue exceeded expectations.",
    exampleTranslation: "公司的年收入超出了预期。",
    category: "商务",
    level: "B2"
  },
  {
    id: "v023",
    word: "stakeholder",
    phonetic: "/ˈsteɪkhoʊldər/",
    meaning: "利益相关者",
    example: "All stakeholders should be informed of the changes.",
    exampleTranslation: "所有利益相关者都应被告知这些变化。",
    category: "商务",
    level: "C1"
  },
  {
    id: "v024",
    word: "merger",
    phonetic: "/ˈmɜːrdʒər/",
    meaning: "合并；并购",
    example: "The merger between the two companies was finalized last month.",
    exampleTranslation: "两家公司的合并已于上月完成。",
    category: "商务",
    level: "C1"
  },
  {
    id: "v025",
    word: "research",
    phonetic: "/rɪˈsɜːrtʃ/",
    meaning: "研究；调查",
    example: "The research was published in a leading journal.",
    exampleTranslation: "这项研究发表在一家顶级期刊上。",
    category: "学术",
    level: "B1"
  },
  {
    id: "v026",
    word: "hypothesis",
    phonetic: "/haɪˈpɑːθəsɪs/",
    meaning: "假设；假说",
    example: "The hypothesis was tested through multiple experiments.",
    exampleTranslation: "这个假设通过多次实验进行了验证。",
    category: "学术",
    level: "B2"
  },
  {
    id: "v027",
    word: "methodology",
    phonetic: "/ˌmeθəˈdɑːlədʒi/",
    meaning: "方法论；研究方法",
    example: "The methodology used in this study is well-established.",
    exampleTranslation: "这项研究所使用的方法论是成熟的。",
    category: "学术",
    level: "C1"
  },
  {
    id: "v028",
    word: "paradigm",
    phonetic: "/ˈpærədaɪm/",
    meaning: "范式；典范",
    example: "This discovery represents a paradigm shift in the field.",
    exampleTranslation: "这一发现代表了该领域的范式转变。",
    category: "学术",
    level: "C2"
  },
  {
    id: "v029",
    word: "epistemology",
    phonetic: "/ɪˌpɪstəˈmɑːlədʒi/",
    meaning: "认识论",
    example: "Epistemology examines the nature and origin of knowledge.",
    exampleTranslation: "认识论研究知识的本质和起源。",
    category: "学术",
    level: "C2"
  },
  {
    id: "v030",
    word: "airport",
    phonetic: "/ˈerpɔːrt/",
    meaning: "机场",
    example: "We arrived at the airport two hours before the flight.",
    exampleTranslation: "我们在航班起飞前两小时到达了机场。",
    category: "旅行",
    level: "A1"
  },
  {
    id: "v031",
    word: "invoice",
    phonetic: "/ˈɪnvɔɪs/",
    meaning: "发票；账单",
    example: "Please send the invoice to our accounting department.",
    exampleTranslation: "请将发票发送到我们的财务部门。",
    category: "商务",
    level: "B1"
  },
  {
    id: "v032",
    word: "analysis",
    phonetic: "/əˈnæləsɪs/",
    meaning: "分析",
    example: "The analysis revealed several interesting patterns.",
    exampleTranslation: "分析揭示了几个有趣的模式。",
    category: "学术",
    level: "B1"
  }
];
