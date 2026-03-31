export type TaskStatus =
  | 'not_started'
  | 'in_progress'
  | 'in_review'
  | 'blocked'
  | 'completed'

export interface EnquiryTracker {
  total_raised: number
  resolved: number
  outstanding: number
  last_chased: string
}

export interface CaseTask {
  id: string
  case_id: string
  title: string
  description: string
  category: string
  status: TaskStatus
  assigned_to: string
  created_at: string
  started_at: string | null
  completed_at: string | null
  dependencies: string[]
  notes: string
  blocked_reason?: string
  enquiries?: EnquiryTracker
}
