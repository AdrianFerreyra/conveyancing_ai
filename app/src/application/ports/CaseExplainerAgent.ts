import type { ConveyancingCase } from '../../domain/conveyancingCase'
import type { CaseTask } from '../../domain/task'
import type { CaseEvent } from '../../domain/caseEvent'
import type { CaseConversation } from '../../domain/conversation'

export interface CaseExplainerAgent {
  explainCase(
    conveyancingCase: ConveyancingCase,
    tasks: CaseTask[],
    events: CaseEvent[]
  ): Promise<CaseConversation>
}
