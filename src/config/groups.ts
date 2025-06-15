export interface Group {
  id: string;
  name: string;
  description: string;
  members: string[];
  isGroupDiscussionMode: boolean;
}

export const groups: Group[] = [
  {
    id: 'group1',
    name: '🔥A1交流群',
    description: '群消息关注度权重："user"的最新消息>其他成员最新消息>"user"的历史消息>其他成员历史消息',
    members: ['ai8', 'ai7', 'ai9', 'ai10', 'ai4', 'ai11'],
    isGroupDiscussionMode: false
  }
];
