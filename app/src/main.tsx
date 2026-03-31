import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import caseData from '@data/case.json'
import { JsonCaseRepository } from '../../src/infrastructure/JsonCaseRepository'
import { createGetCase } from '../../src/application/getCase'
import type { ConveyancingCase } from '../../src/domain/conveyancingCase'

// Assemble the full domain object from the JSON file's separate sections
const conveyancingCase: ConveyancingCase = {
  ...caseData.case,
  property: caseData.property,
  parties: caseData.parties,
  financials: caseData.financials,
} as ConveyancingCase

const caseRepo = new JsonCaseRepository(conveyancingCase)
const getCase = createGetCase(caseRepo)

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App getCase={getCase} />
  </StrictMode>,
)
