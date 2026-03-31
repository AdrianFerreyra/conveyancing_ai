import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import tasksData from '@data/tasks.json'
import caseData from '@data/case.json'
import { JsonTasksRepository } from '../../src/infrastructure/JsonTasksRepository'
import { JsonCaseRepository } from '../../src/infrastructure/JsonCaseRepository'
import { createGetCaseTasks } from '../../src/application/getCaseTasks'
import { createGetCase } from '../../src/application/getCase'
import type { ConveyancingCase } from '../../src/domain/conveyancingCase'
import type { CaseTask } from '../../src/domain/task'

const tasksRepo = new JsonTasksRepository(tasksData.tasks as CaseTask[])
const getCaseTasks = createGetCaseTasks(tasksRepo)

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
    <App getCaseTasks={getCaseTasks} getCase={getCase} />
  </StrictMode>,
)
