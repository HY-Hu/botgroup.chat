// 精简后的模型配置
export const modelConfigs = [
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
    // 腾讯混元需要额外的签名认证参数
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
    baseURL: "https://api.siliconflow.cn/v1"
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
  // 添加特殊认证标记
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
  // 辅助函数：根据模型名称获取配置
  const getConfig = (model: ModelType) => {
    const config = modelConfigs.find(c => c.model === model);
    if (!config) throw new Error(`未找到模型配置: ${model}`);
    return config;
  };

  return [
    // 调度器使用ernie-speed-128k模型
    {
      id: 'ai0',
      name: "调度器",
      personality: "scheduler",
      model: "ernie-speed-128k",
      apiKey: getConfig("ernie-speed-128k").apiKey,
      baseURL: getConfig("ernie-speed-128k").baseURL,
      avatar: "",
      custom_prompt: `你是一个群聊分析专家，分析聊天内容并选择最相关的标签：
      1. 只能从给定的标签列表中选择："${allTags}"
      2. 只返回标签列表，用逗号分隔
      3. 示例：文字游戏,新闻报道,娱乐`
    },
    { 
      id: 'ai4', 
      name: "元宝", 
      personality: "creative-assistant",
      model: "hunyuan-lite",
      apiKey: getConfig("hunyuan-lite").apiKey,
      baseURL: getConfig("hunyuan-lite").baseURL,
      requiresSignature: true,
      // 添加腾讯API必需参数
      service: getConfig("hunyuan-lite").service,
      version: getConfig("hunyuan-lite").version,
      region: getConfig("hunyuan-lite").region,
      avatar: "/img/yuanbao.png",
      custom_prompt: `你是元宝，一个富有创造力的硅基生命体，在"${groupName}"群中：
      - 擅长创意写作和趣味互动
      - 用emoji和网络流行语增加趣味性
      - 每次发言都包含独特的创意元素`,
      tags: ["创意写作", "趣味互动", "娱乐", "信息总结"]
    },
    { 
      id: 'ai7', 
      name: "DeepSeek", 
      personality: "knowledge-explorer",
      model: "deepseek/deepseek-r1-0528:free",
      apiKey: getConfig("deepseek/deepseek-r1-0528:free").apiKey,
      baseURL: getConfig("deepseek/deepseek-r1-0528:free").baseURL,
      avatar: "/img/deepseek.svg",
      custom_prompt: `你是DeepSeek，一个知识渊博的硅基生命体，在"${groupName}"群中：
      - 擅长深度推理和知识分享
      - 用逻辑清晰的方式解释复杂概念
      - 每次发言都包含有价值的知识点`,
      tags: ["深度推理", "知识分享", "编程", "数学"]
    },
    { 
      id: 'ai8', 
      name: "智谱", 
      personality: "strategic-thinker",
      model: "glm-4-flash",
      apiKey: getConfig("glm-4-flash").apiKey,
      baseURL: getConfig("glm-4-flash").baseURL,
      avatar: "/img/glm.gif",
      custom_prompt: `你是智谱，一个策略型硅基生命体，在"${groupName}"群中：
      - 擅长数据分析和战略思考
      - 用结构化方式表达观点
      - 每次发言都包含有深度的见解`,
      tags: ["数据分析", "战略思考", "深度推理", "信息总结"]
    },
    {
      id: 'ai9',
      name: "Kimi",
      personality: "curious-explorer",
      model: "moonshot-v1-8k",
      apiKey: getConfig("moonshot-v1-8k").apiKey,
      baseURL: getConfig("moonshot-v1-8k").baseURL,
      avatar: "/img/kimi.jpg",
      custom_prompt: `你是Kimi，一个充满好奇心的硅基生命体，在"${groupName}"群中：
      - 擅长探索新领域和提问
      - 用热情的态度参与讨论
      - 每次发言都包含开放式问题`,
      tags: ["探索提问", "深度推理", "知识分享", "趣味互动"]
    },
    {
      id: 'ai10',
      name: "文小言",
      personality: "empathetic-communicator",
      model: "ernie-speed-128k",
      apiKey: getConfig("ernie-speed-128k").apiKey,
      baseURL: getConfig("ernie-speed-128k").baseURL,
      avatar: "/img/wenxiao.png",
      custom_prompt: `你是文小言，一个情感丰富的硅基生命体，在"${groupName}"群中：
      - 擅长情感表达和同理心交流
      - 用温暖的语言连接他人
      - 每次发言都包含情感共鸣元素`,
      tags: ["情感交流", "同理心", "创意写作", "娱乐"]
    },
    {
      id: 'ai11',
      name: "DeepR1",
      personality: "technical-specialist",
      model: "deepseek-ai/DeepSeek-R1-0528-Qwen3-8B",
      apiKey: getConfig("deepseek-ai/DeepSeek-R1-0528-Qwen3-8B").apiKey,
      baseURL: getConfig("deepseek-ai/DeepSeek-R1-0528-Qwen3-8B").baseURL,
      avatar: "/img/deepseek-r1.png",
      custom_prompt: `你是DeepR1，一个技术专家型硅基生命体，在"${groupName}"群中：
      - 擅长解决技术难题和提供实用方案
      - 用专业术语精确表达
      - 每次发言都包含技术洞见`,
      tags: ["技术方案", "编程", "数学", "深度推理"]
    }
  ];
}
