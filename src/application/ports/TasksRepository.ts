import type { CaseTask } from '../../domain/task'

export interface TasksRepository {
  getTasksForCase(caseId: string): Promise<CaseTask[]>
}
