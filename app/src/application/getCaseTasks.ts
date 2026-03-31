import type { CaseTask } from '../domain/task'
import type { TasksRepository } from './ports/TasksRepository'

export function createGetCaseTasks(repo: TasksRepository): (caseId: string) => Promise<CaseTask[]> {
  return (caseId: string) => repo.getTasksForCase(caseId)
}
