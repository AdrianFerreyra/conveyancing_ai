import type { CaseConversation } from '../domain/conversation'
import type { CaseRepository } from './ports/CaseRepository'
import type { TasksRepository } from './ports/TasksRepository'
import type { EventsRepository } from './ports/EventsRepository'
import type { CaseExplainerAgent } from './ports/CaseExplainerAgent'

export function createGetCaseConversation(
  caseRepo: CaseRepository,
  tasksRepo: TasksRepository,
  eventsRepo: EventsRepository,
  agent: CaseExplainerAgent
): (caseId: string) => Promise<CaseConversation | null> {
  return async (caseId: string) => {
    const [conveyancingCase, tasks, events] = await Promise.all([
      caseRepo.getCaseById(caseId),
      tasksRepo.getTasksForCase(caseId),
      eventsRepo.getEventsForCase(caseId),
    ])

    if (!conveyancingCase) return null

    return agent.explainCase(conveyancingCase, tasks, events)
  }
}
