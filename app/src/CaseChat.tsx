interface ChatMessage {
  id: string
  title: string
  body: string
}

interface Props {
  messages: ChatMessage[]
}

export function CaseChat({ messages }: Props) {
  return (
    <div className="case-chat">
      {messages.map((message, index) => (
        <div key={message.id}>
          <div className="chat-card chat-card--ai">
            <div className="chat-card-header">
              <span className="chat-card-title">{message.title}</span>
              <span className="chat-card-badge">AI</span>
            </div>
            <div className="chat-card-body">{message.body}</div>
          </div>
          {index < messages.length - 1 && (
            <div className="chat-connector" aria-hidden="true" />
          )}
        </div>
      ))}
    </div>
  )
}
