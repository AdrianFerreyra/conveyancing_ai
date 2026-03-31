export type MessageRole = 'ai'

export interface ConversationMessage {
  id: string
  role: MessageRole
  title: string
  body: string
}

export interface CaseConversation {
  caseId: string
  messages: ConversationMessage[]
  generatedAt: string
}
