import type { ConveyancingCase } from '../domain/conveyancingCase'
import type { CaseRepository } from './ports/CaseRepository'

export function createGetCase(repo: CaseRepository): (caseId: string) => Promise<ConveyancingCase | null> {
  return (caseId: string) => repo.getCaseById(caseId)
}
