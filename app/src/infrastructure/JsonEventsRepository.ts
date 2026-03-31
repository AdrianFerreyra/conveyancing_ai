import type { CaseEvent } from '../domain/caseEvent'
import type { EventsRepository } from '../application/ports/EventsRepository'

export class JsonEventsRepository implements EventsRepository {
  constructor(private readonly events: CaseEvent[]) {}

  async getEventsForCase(caseId: string): Promise<CaseEvent[]> {
    return this.events.filter((event) => event.case_id === caseId)
  }
}
