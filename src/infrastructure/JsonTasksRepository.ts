import type { CaseTask } from '../domain/task'
import type { TasksRepository } from '../application/ports/TasksRepository'

export class JsonTasksRepository implements TasksRepository {
  constructor(private readonly tasks: CaseTask[]) {}

  async getTasksForCase(caseId: string): Promise<CaseTask[]> {
    return this.tasks.filter((task) => task.case_id === caseId)
  }
}
