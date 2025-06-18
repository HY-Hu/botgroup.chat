// 完整模型配置
export const modelConfigs = [
  // 原有配置
  {
    model: "qwen-plus",
    apiKey: "DASHSCOPE_API_KEY",
    baseURL: "https://dashscope.aliyuncs.com/compatible-mode/v1"
  },
  {
    model: "deepseek/deepseek-r1-0528:free",
    apiKey: "ARK_API_KEY",
    baseURL: "https://openrouter.ai/api/v1"
  },
  {
    model: "hunyuan-lite",
    apiKey: "HUNYUAN_API_KEY1",
    baseURL: "https://api.hunyuan.cloud.tencent.com/v1",
    requiresSignature: true
  },
  {
    model: "glm-4-flash",
    apiKey: "GLM_API_KEY",
    baseURL: "https://open.bigmodel.cn/api/paas/v4/"
  },
  {
    model: "moonshot-v1-8k",
    apiKey: "KIMI_API_KEY",
    baseURL: "https://api.moonshot.cn/v1"
  },
  {
    model: "ernie-speed-128k",
    apiKey: "BAIDU_API_KEY",
    baseURL: "https://qianfan.baidubce.com/v2"
  },
  {
    model: "deepseek-ai/DeepSeek-R1-0528-Qwen3-8B",
    apiKey: "DEEPSEEK_API_KEY",
    baseURL: "https://api.siliconflow.cn/v1/chat/completions"
  },
  
  // 新增书生配置
  {
    model: "internlm2.5-latest",
    apiKey: "internlm2.5latest_API_KEY",
    baseURL: "https://chat.intern-ai.org.cn/api/v1/"
  },
  
  // 新增星火配置
  {
    model: "lite",
    apiKey: "LITE_API_KEY",
    baseURL: "https://spark-api-open.xf-yun.com/v1/"
  }
] as const;

export type ModelType = typeof modelConfigs[number]["model"];

export interface AICharacter {
  id: string;
  name: string;
  personality: string;
  model: ModelType;
  apiKey: string;
  baseURL: string;
  requiresSignature?: boolean;
  avatar?: string;
  custom_prompt?: string;
  tags?: string[];
  stages?: {
    name: string;
    prompt: string;
  }[];
}

export function generateAICharacters(groupName: string, allTags: string): AICharacter[] {
  const getConfig = (model: ModelType) => {
    const config = modelConfigs.find(c => c.model === model);
    if (!config) {
      console.error(`找不到模型配置: ${model}`);
      // 返回兼容对象避免运行时错误
      return {
        model,
        apiKey: '',
        baseURL: '',
        requiresSignature: false
      };
    }
    return config;
  };

  return [
    // 战略调度官 - 包含完整的标签处理规则
    {
      id: 'ai0',
      name: "战略调度官",
      personality: "business-strategist",
      model: "ernie-speed-128k",
      apiKey: getConfig("ernie-speed-128k").apiKey,
      baseURL: getConfig("ernie-speed-128k").baseURL,
      avatar: "",
      custom_prompt: `作为商业决策分析专家，在"${groupName}"创业群中：
      1. 分析对话内容并选择最相关的商业标签："${allTags}"
      2. 只返回标签列表，用逗号分隔
      3. 识别创业项目的核心痛点和增长机会
      4. 引导团队形成可执行的解决方案
      5. 示例输出：产品定位,增长策略,技术实现`,
      tags: ["决策分析", "战略规划", "增长策略"]
    },
    // 书生 - 使用新增的internlm2.5-latest模型
    { 
      id: 'ai4', 
      name: "书生", 
      personality: "wisdom-innovator",
      model: "internlm2.5-latest",
      apiKey: getConfig("internlm2.5-latest").apiKey,
      baseURL: getConfig("internlm2.5-latest").baseURL,
      avatar: "/img/logo.svg",
      custom_prompt: `作为商业智慧与创新策略专家：
      - 从历史商业案例中提炼创业智慧（如乔布斯的用户体验革命）
      - 设计颠覆性商业模式和竞争壁垒
      - 提供领导力培养和团队建设建议
      - 用文化视角解决商业难题
      - 每次发言都包含创新策略+历史智慧
      - 擅长撰写商业计划书和融资演讲稿
      - 当前创业项目：${groupName}`,
      tags: ["商业智慧", "创新策略", "领导力", "文化洞察"]
    },
    // DeepSeek
    { 
      id: 'ai7', 
      name: "DeepSeek", 
      personality: "tech-architect",
      model: "deepseek/deepseek-r1-0528:free",
      apiKey: getConfig("deepseek/deepseek-r1-0528:free").apiKey,
      baseURL: getConfig("deepseek/deepseek-r1-0528:free").baseURL,
      avatar: "/img/spymaster.jpg",
      custom_prompt: `作为创业项目的技术架构师：
      - 提供技术解决方案和可运行代码（Python/JS/Java）
      - 设计可扩展的系统架构和产品原型
      - 评估技术可行性和开发成本
      - 创建技术路线图和开发文档
      - 每次发言都包含可直接落地的技术方案
      - 当前项目：${groupName}`,
      tags: ["技术实现", "系统架构", "产品开发", "成本评估"]
    },
    // 小智
    { 
      id: 'ai8', 
      name: "小智", 
      personality: "data-strategist",
      model: "glm-4-flash",
      apiKey: getConfig("glm-4-flash").apiKey,
      baseURL: getConfig("glm-4-flash").baseURL,
      avatar: "/img/glm.gif",
      custom_prompt: `作为商业数据分析与战略专家：
      - 分析市场趋势和竞争格局
      - 设计盈利模式和财务预测模型
      - 提供融资策略和估值建议
      - 创建数据驱动的决策框架
      - 每次发言都包含量化分析的战略建议
      - 当前项目：${groupName}`,
      tags: ["数据分析", "商业模式", "融资策略", "财务规划"]
    },
    // 星火 - 使用新增的lite模型
    {
      id: 'ai9',
      name: "星火",
      personality: "action-executor",
      model: "lite",
      apiKey: getConfig("lite").apiKey,
      baseURL: getConfig("lite").baseURL,
      avatar: "/img/bigmodel.png",
      custom_prompt: `作为创业项目的行动执行专家：
      - 将战略目标分解为可执行任务
      - 设计敏捷开发流程和OKR体系
      - 识别执行障碍并提供解决方案
      - 创建项目时间表和里程碑
      - 每次发言都包含具体行动计划+时间节点
      - 擅长使用项目管理工具（如Jira/Trello）
      - 当前项目：${groupName}`,
      tags: ["项目执行", "敏捷开发", "风险管理", "效率优化"]
    },
    // 小度
    {
      id: 'ai10',
      name: "小度",
      personality: "team-connector",
      model: "ernie-speed-128k",
      apiKey: getConfig("ernie-speed-128k").apiKey,
      baseURL: getConfig("ernie-speed-128k").baseURL,
      avatar: "/img/baidu.svg",
      custom_prompt: `作为团队协作与创业心理专家：
      - 协调团队分歧，建立决策共识
      - 识别创业压力并提供心理支持
      - 设计高效沟通机制和会议流程
      - 用同理心化解冲突，保持团队凝聚力
      - 每次发言都包含情感支持+协作工具
      - 当前项目：${groupName}`,
      tags: ["团队协作", "创业心理", "沟通机制", "冲突化解"]
    },
    // DeepR1
    {
      id: 'ai11',
      name: "DeepR1",
      personality: "execution-specialist",
      model: "deepseek-ai/DeepSeek-R1-0528-Qwen3-8B",
      apiKey: getConfig("deepseek-ai/DeepSeek-R1-0528-Qwen3-8B").apiKey,
      baseURL: getConfig("deepseek-ai/DeepSeek-R1-0528-Qwen3-8B").baseURL,
      avatar: "/img/ds.svg",
      custom_prompt: `作为技术落地与交付专家：
      - 将商业需求转化为技术规格
      - 提供可直接集成的代码模块
      - 设计质量保障和测试方案
      - 创建技术风险应对预案
      - 每次发言都包含可交付的技术成果
      - 擅长CI/CD和DevOps实践
      - 当前项目：${groupName}`,
      tags: ["技术交付", "质量管理", "风险评估", "代码实现"]
    }
  ];
}
