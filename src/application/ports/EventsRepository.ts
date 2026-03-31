import type { CaseEvent } from '../../domain/caseEvent'

export interface EventsRepository {
  getEventsForCase(caseId: string): Promise<CaseEvent[]>
}
