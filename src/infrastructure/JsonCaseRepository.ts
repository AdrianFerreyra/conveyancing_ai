import type { ConveyancingCase } from '../domain/conveyancingCase'
import type { CaseRepository } from '../application/ports/CaseRepository'

export class JsonCaseRepository implements CaseRepository {
  constructor(private readonly conveyancingCase: ConveyancingCase) {}

  async getCaseById(caseId: string): Promise<ConveyancingCase | null> {
    if (this.conveyancingCase.id !== caseId) return null
    return this.conveyancingCase
  }
}
