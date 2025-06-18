export interface Group {
  id: string;
  name: string;
  description: string;
  members: string[];
  // 新增发言顺序管理
  speakingOrder: string[];
  currentSpeakerIndex: number;
  discussionPhase: 'strategic' | 'creative' | 'technical' | 'execution' | 'review';
  // 新增讨论模式增强
  isGroupDiscussionMode: boolean;
  discussionRules?: {
    maxSpeakingTime: number; 
    turnSwitchCondition: 'time' | 'completion' | 'interruption';
    emotionThreshold: number; 
  };
}
// 发言顺序生成器
function generateSpeakingOrder(phase: Group['discussionPhase'], members: string[]): string[] {
  // 基础顺序映射
  const roleOrder: Record<string, string[]> = {
    strategic: ['ai8', 'ai4', 'ai7', 'ai9', 'ai11', 'ai10'], 
    creative: ['ai4', 'ai8', 'ai10', 'ai7', 'ai9', 'ai11'], 
    technical: ['ai7', 'ai11', 'ai9', 'ai8', 'ai4', 'ai10'], 
    execution: ['ai9', 'ai11', 'ai7', 'ai8', 'ai4', 'ai10'], 
    review: ['ai10', 'ai8', 'ai4', 'ai7', 'ai9', 'ai11']    
  };
  // 获取当前阶段的推荐顺序
  const recommendedOrder = roleOrder[phase];
  // 确保所有成员都被包含
  const finalOrder = [...recommendedOrder];
  members.forEach(member => {
    if (!finalOrder.includes(member)) {
      finalOrder.push(member);
    }
  });
  return finalOrder;
}
export const groups: Group[] = [
  {
    id: 'group1',
    name: '🚀 创业智囊团',
    description: '动态发言系统：战略规划→创新突破→技术实现→执行落地→复盘评估',
    members: ['ai8', 'ai7', 'ai10', 'ai11', 'ai4', 'ai9'], 
    speakingOrder: [], 
    currentSpeakerIndex: 0,
    discussionPhase: 'strategic',
    isGroupDiscussionMode: true,
    discussionRules: {
      maxSpeakingTime: 120, 
      turnSwitchCondition: 'completion',
      emotionThreshold: 70 
    }
  }
];
// 讨论阶段转换函数
export function advanceDiscussionPhase(group: Group) {
  const phases: Group['discussionPhase'][] = ['strategic', 'creative', 'technical', 'execution', 'review'];
  const currentIndex = phases.indexOf(group.discussionPhase);
  const nextIndex = (currentIndex + 1) % phases.length;
  group.discussionPhase = phases[nextIndex];
  group.speakingOrder = generateSpeakingOrder(group.discussionPhase, group.members);
  group.currentSpeakerIndex = 0;
  console.log(`进入${getPhaseName(group.discussionPhase)}阶段`);
}
// 获取阶段名称
function getPhaseName(phase: Group['discussionPhase']): string {
  const names = {
    strategic: '战略规划',
    creative: '创新突破',
    technical: '技术实现',
    execution: '执行落地',
    review: '复盘评估'
  };
  return names[phase];
}
// 获取当前发言人
export function getCurrentSpeaker(group: Group): string {
  if (group.speakingOrder.length === 0) {
    // 首次初始化发言顺序
    group.speakingOrder = generateSpeakingOrder(group.discussionPhase, group.members);
  }
  return group.speakingOrder[group.currentSpeakerIndex];
}
// 切换到下一位发言人
export function nextSpeaker(group: Group, forceEmotionCheck = false): string {
  // 情感支持检查（压力>阈值时优先小度）
  if (forceEmotionCheck || (group.discussionRules && Math.random() * 100 > group.discussionRules.emotionThreshold)) {
    const xiaoduIndex = group.members.indexOf('ai10');
    if (xiaoduIndex !== -1) {
      group.currentSpeakerIndex = group.speakingOrder.indexOf('ai10');
      return 'ai10';
    }
  }
  // 正常轮转
  group.currentSpeakerIndex = (group.currentSpeakerIndex + 1) % group.speakingOrder.length;
  // 当完成一轮时推进阶段
  if (group.currentSpeakerIndex === 0) {
    advanceDiscussionPhase(group);
  }
  return getCurrentSpeaker(group);
}
// 根据讨论内容动态调整顺序
export function dynamicReorder(group: Group, lastMessage: string) {
  const techKeywords = ['技术', '代码', '架构', '开发'];
  const strategyKeywords = ['市场', '融资', '商业', '竞争'];
  const creativeKeywords = ['创新', '模式', '颠覆', '差异'];
  const executionKeywords = ['执行', '时间', '交付', '里程碑'];
  if (techKeywords.some(kw => lastMessage.includes(kw))) {
    group.discussionPhase = 'technical';
  } else if (strategyKeywords.some(kw => lastMessage.includes(kw))) {
    group.discussionPhase = 'strategic';
  } else if (creativeKeywords.some(kw => lastMessage.includes(kw))) {
    group.discussionPhase = 'creative';
  } else if (executionKeywords.some(kw => lastMessage.includes(kw))) {
    group.discussionPhase = 'execution';
  }
  group.speakingOrder = generateSpeakingOrder(group.discussionPhase, group.members);
  group.currentSpeakerIndex = 0;
}
