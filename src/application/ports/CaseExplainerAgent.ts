import type { ConveyancingCase } from '../../domain/conveyancingCase'
import type { CaseTask } from '../../domain/task'
import type { CaseConversation } from '../../domain/conversation'

export interface CaseExplainerAgent {
  explainCase(
    conveyancingCase: ConveyancingCase,
    tasks: CaseTask[]
  ): Promise<CaseConversation>
}
