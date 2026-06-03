export type GrammarExerciseType = "fill-blank" | "choice" | "sentence-order";
export type GrammarLevel = "A1" | "A2" | "B1" | "B2" | "C1" | "C2";

export interface GrammarExercise {
  id: string;
  title: string;
  description: string;
  level: GrammarLevel;
  type: GrammarExerciseType;
  question: string;
  options: string[];
  answer: string;
  explanation: string;
}

export const grammarExercises: GrammarExercise[] = [
  {
    id: "g001",
    title: "一般现在时·be动词",
    description: "练习be动词在一般现在时中的正确使用",
    level: "A1",
    type: "fill-blank",
    question: "She ___ a teacher at the local school.",
    options: ["am", "is", "are", "be"],
    answer: "is",
    explanation: "当主语是第三人称单数（she/he/it）时，be动词使用is。"
  },
  {
    id: "g002",
    title: "一般现在时·否定句",
    description: "练习一般现在时否定句的构成",
    level: "A1",
    type: "choice",
    question: "哪个句子是正确的否定句？",
    options: [
      "He don't like coffee.",
      "He doesn't like coffee.",
      "He not like coffee.",
      "He doesn't likes coffee."
    ],
    answer: "He doesn't like coffee.",
    explanation: "第三人称单数的否定句使用doesn't + 动词原形，动词不需要加s。"
  },
  {
    id: "g003",
    title: "冠词用法",
    description: "练习定冠词和不定冠词的正确使用",
    level: "A1",
    type: "fill-blank",
    question: "I saw ___ interesting movie last night. ___ movie was about space exploration.",
    options: ["a / The", "an / The", "the / A", "an / A"],
    answer: "an / The",
    explanation: "interesting以元音发音开头，使用an；第二次提到同一事物时使用定冠词The。"
  },
  {
    id: "g004",
    title: "现在进行时",
    description: "练习现在进行时的构成和用法",
    level: "A2",
    type: "fill-blank",
    question: "Look! The children ___ in the park right now.",
    options: ["play", "plays", "are playing", "is playing"],
    answer: "are playing",
    explanation: "现在进行时表示正在发生的动作，结构为be动词+动词ing形式。children是复数，所以用are playing。"
  },
  {
    id: "g005",
    title: "一般过去时",
    description: "练习一般过去时的规则和不规则变化",
    level: "A2",
    type: "fill-blank",
    question: "She ___ to the store and ___ some groceries yesterday.",
    options: ["go / buy", "went / bought", "goes / buys", "going / buying"],
    answer: "went / bought",
    explanation: "一般过去时中，go变为不规则过去式went，buy变为不规则过去式bought。"
  },
  {
    id: "g006",
    title: "比较级与最高级",
    description: "练习形容词比较级和最高级的构成",
    level: "A2",
    type: "choice",
    question: "选择正确的句子：",
    options: [
      "This is the more beautiful place I've ever seen.",
      "This is the most beautiful place I've ever seen.",
      "This is the beautifulest place I've ever seen.",
      "This is the more beautifulest place I've ever seen."
    ],
    answer: "This is the most beautiful place I've ever seen.",
    explanation: "多音节形容词（如beautiful）的最高级在前面加most，不能用-est结尾。"
  },
  {
    id: "g007",
    title: "现在完成时",
    description: "练习现在完成时的构成和用法",
    level: "B1",
    type: "fill-blank",
    question: "I ___ never ___ sushi before. Is it good?",
    options: ["have / eat", "have / eaten", "has / eaten", "had / eaten"],
    answer: "have / eaten",
    explanation: "现在完成时结构为have/has + 过去分词。主语I搭配have，eat的过去分词为eaten。"
  },
  {
    id: "g008",
    title: "定语从句",
    description: "练习关系代词who/which/that的正确使用",
    level: "B1",
    type: "fill-blank",
    question: "The book ___ I borrowed from the library was very interesting.",
    options: ["who", "which", "whom", "whose"],
    answer: "which",
    explanation: "先行词是物（book）时，使用which或that引导定语从句，不能用who。"
  },
  {
    id: "g009",
    title: "条件句·第一条件句",
    description: "练习第一条件句（真实条件句）的构成",
    level: "B1",
    type: "choice",
    question: "选择正确的条件句：",
    options: [
      "If it will rain tomorrow, I stay home.",
      "If it rains tomorrow, I will stay home.",
      "If it rain tomorrow, I will stay home.",
      "If it rains tomorrow, I stay home."
    ],
    answer: "If it rains tomorrow, I will stay home.",
    explanation: "第一条件句中，if从句用一般现在时，主句用一般将来时（will + 动词原形）。"
  },
  {
    id: "g010",
    title: "被动语态",
    description: "练习被动语态在不同时态中的构成",
    level: "B1",
    type: "fill-blank",
    question: "The new bridge ___ last year and ___ by thousands of people daily.",
    options: [
      "built / is used",
      "was built / is used",
      "was built / used",
      "built / was used"
    ],
    answer: "was built / is used",
    explanation: "桥是被建造的，用过去时被动语态was built；现在每天被使用，用一般现在时被动语态is used。"
  },
  {
    id: "g011",
    title: "虚拟语气·第二条件句",
    description: "练习第二条件句（非真实条件句）的构成",
    level: "B2",
    type: "fill-blank",
    question: "If I ___ you, I ___ accept that job offer immediately.",
    options: [
      "am / will",
      "were / would",
      "was / will",
      "be / would"
    ],
    answer: "were / would",
    explanation: "第二条件句表示与现在事实相反的假设，if从句用过去式（be动词统一用were），主句用would + 动词原形。"
  },
  {
    id: "g012",
    title: "非谓语动词·动名词与不定式",
    description: "练习动名词和不定式作宾语的用法区别",
    level: "B2",
    type: "choice",
    question: "选择语法正确的句子：",
    options: [
      "She enjoys to play the piano after dinner.",
      "She enjoys playing the piano after dinner.",
      "She enjoys to playing the piano after dinner.",
      "She enjoys play the piano after dinner."
    ],
    answer: "She enjoys playing the piano after dinner.",
    explanation: "enjoy后面接动名词（doing），不能接不定式（to do）。类似的动词还有avoid、finish、suggest等。"
  },
  {
    id: "g013",
    title: "句子排序·宾语从句",
    description: "将打乱的单词排列成正确的宾语从句",
    level: "B2",
    type: "sentence-order",
    question: "请将以下单词排列成正确的句子",
    options: ["She", "asked", "where", "he", "had", "been"],
    answer: "She asked where he had been",
    explanation: "宾语从句使用陈述语序，即主语在前，谓语在后，不能使用疑问语序。"
  },
  {
    id: "g014",
    title: "倒装句",
    description: "练习倒装句的构成和用法",
    level: "C1",
    type: "fill-blank",
    question: "Not only ___ the exam, but she also got the highest score in the class.",
    options: [
      "she passed",
      "did she pass",
      "she did pass",
      "passed she"
    ],
    answer: "did she pass",
    explanation: "Not only位于句首时，主句需要部分倒装，即将助动词提到主语前面。"
  },
  {
    id: "g015",
    title: "虚拟语气·wish与if only",
    description: "练习wish和if only引导的虚拟语气的用法",
    level: "C1",
    type: "choice",
    question: "选择表达「我希望我当时更努力学习」的正确句子：",
    options: [
      "I wish I studied harder then.",
      "I wish I had studied harder then.",
      "I wish I have studied harder then.",
      "I wish I would study harder then."
    ],
    answer: "I wish I had studied harder then.",
    explanation: "wish表示对过去事实的遗憾时，从句使用过去完成时had + 过去分词。"
  },
  {
    id: "g016",
    title: "独立主格结构",
    description: "练习独立主格结构的构成和用法",
    level: "C2",
    type: "fill-blank",
    question: "___, we decided to cancel the outdoor event.",
    options: [
      "The weather being terrible",
      "The weather is terrible",
      "The weather was terrible",
      "The weather been terrible"
    ],
    answer: "The weather being terrible",
    explanation: "独立主格结构由名词/代词+分词构成，不构成完整从句，用作状语表示原因、条件等。此处being表示与主句动作同时发生的状态。"
  },
  {
    id: "g017",
    title: "强调句型",
    description: "练习It is/was... that...强调句型的构成",
    level: "C1",
    type: "fill-blank",
    question: "It ___ his dedication and hard work ___ made him successful.",
    options: [
      "is / which",
      "was / that",
      "was / which",
      "is / what"
    ],
    answer: "was / that",
    explanation: "强调句型结构为It is/was + 被强调部分 + that + 句子其余部分。that不能替换为which或what。"
  },
  {
    id: "g018",
    title: "省略与替代",
    description: "练习英语中省略和替代的用法",
    level: "C2",
    type: "choice",
    question: "选择与「She can play the violin, and he can too.」意思相同但使用替代的句子：",
    options: [
      "She can play the violin, and so can he.",
      "She can play the violin, and so does he.",
      "She can play the violin, and neither can he.",
      "She can play the violin, and either can he."
    ],
    answer: "She can play the violin, and so can he.",
    explanation: "so + 助动词/情态动词 + 主语表示「也」，用于肯定句。因为前面用的是can，所以后面也用can。neither用于否定情况。"
  }
];
