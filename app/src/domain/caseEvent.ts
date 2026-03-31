export type Actor = 'system' | 'ai_assistant' | (string & {})

export type EventType =
  | 'case.created'
  | 'task.status_changed'
  | 'document.requested'
  | 'document.received'
  | 'compliance.check_completed'
  | 'milestone.reached'
  | 'searches.ordered'
  | 'search.result_received'
  | 'enquiry.raised'
  | 'enquiry.reply_received'
  | 'enquiry.chased'
  | 'communication.sent'
  | 'communication.received'
  | 'internal.note'
  | 'ai.analysis_completed'
  | 'ai.draft_produced'
  | 'ai.draft_reviewed'

export interface CaseEvent {
  id: string
  case_id: string
  type: EventType
  timestamp: string
  actor: Actor
  payload: Record<string, unknown>
  description: string
}
