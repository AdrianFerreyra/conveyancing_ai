import type { CaseConversation, ConversationMessage } from './conversation'

describe('CaseConversation', () => {
  it('has a caseId, messages, and generatedAt timestamp', () => {
    const conversation: CaseConversation = {
      caseId: 'CASE-2024-0847',
      messages: [
        {
          id: 'msg-1',
          role: 'ai',
          title: "What's happening with your case?",
          body: 'Your case is progressing well.',
        },
      ],
      generatedAt: '2024-09-12T09:15:00Z',
    }

    expect(conversation.caseId).toBe('CASE-2024-0847')
    expect(conversation.messages).toHaveLength(1)
    expect(conversation.generatedAt).toBe('2024-09-12T09:15:00Z')
  })

  it('each message has id, role, title, and body', () => {
    const message: ConversationMessage = {
      id: 'msg-1',
      role: 'ai',
      title: 'Anything to keep an eye on?',
      body: 'There are two outstanding enquiries.',
    }

    expect(message.id).toBe('msg-1')
    expect(message.role).toBe('ai')
    expect(message.title).toBeTruthy()
    expect(message.body).toBeTruthy()
  })

  it('can hold multiple messages', () => {
    const conversation: CaseConversation = {
      caseId: 'CASE-2024-0847',
      messages: [
        { id: 'msg-1', role: 'ai', title: 'Stage', body: "You're in pre-contract." },
        { id: 'msg-2', role: 'ai', title: 'Blockers', body: 'Two enquiries outstanding.' },
        { id: 'msg-3', role: 'ai', title: 'Reassurance', body: "Your conveyancer is on it." },
      ],
      generatedAt: '2024-09-12T09:15:00Z',
    }

    expect(conversation.messages).toHaveLength(3)
  })
})
