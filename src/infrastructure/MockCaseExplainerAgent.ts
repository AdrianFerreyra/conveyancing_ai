import type { ConveyancingCase } from '../domain/conveyancingCase'
import type { CaseTask } from '../domain/task'
import type { CaseConversation } from '../domain/conversation'
import type { CaseExplainerAgent } from '../application/ports/CaseExplainerAgent'

export class MockCaseExplainerAgent implements CaseExplainerAgent {
  async explainCase(conveyancingCase: ConveyancingCase, _tasks: CaseTask[]): Promise<CaseConversation> {
    return {
      caseId: conveyancingCase.id,
      messages: [
        {
          id: 'msg-1',
          role: 'ai',
          title: "What's happening with your case?",
          body: "your case is progressing well — you're currently in the pre-contract stage, which means the legal groundwork is being laid before you exchange contracts.",
        },
        {
          id: 'msg-2',
          role: 'ai',
          title: 'Anything to keep an eye on?',
          body: "There are a couple of enquiries still outstanding with the seller's solicitor. These are normal at this stage, but they need to be resolved before you can exchange.",
        },
      ],
      generatedAt: new Date().toISOString(),
    }
  }
}
