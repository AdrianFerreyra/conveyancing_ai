import type { ConveyancingCase } from '../../domain/conveyancingCase'

export interface CaseRepository {
  getCaseById(caseId: string): Promise<ConveyancingCase | null>
}
