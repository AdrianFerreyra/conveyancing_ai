import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import tasksData from '@data/tasks.json'
import caseData from '@data/case.json'
import eventsData from '@data/events.json'
import { JsonTasksRepository } from '../../src/infrastructure/JsonTasksRepository'
import { JsonCaseRepository } from '../../src/infrastructure/JsonCaseRepository'
import { JsonEventsRepository } from '../../src/infrastructure/JsonEventsRepository'
import { createGetCaseTasks } from '../../src/application/getCaseTasks'
import { createGetCase } from '../../src/application/getCase'
import { createGetCaseConversation } from '../../src/application/getCaseConversation'
import { MockCaseExplainerAgent } from '../../src/infrastructure/MockCaseExplainerAgent'
import type { CaseExplainerAgent } from '../../src/application/ports/CaseExplainerAgent'
import type { ConveyancingCase } from '../../src/domain/conveyancingCase'
import type { CaseTask } from '../../src/domain/task'
import type { CaseEvent } from '../../src/domain/caseEvent'

;(async () => {
  const tasksRepo = new JsonTasksRepository(tasksData.tasks as CaseTask[])
  const getCaseTasks = createGetCaseTasks(tasksRepo)

  const eventsRepo = new JsonEventsRepository(eventsData.events as CaseEvent[])

  // Assemble the full domain object from the JSON file's separate sections
  const conveyancingCase: ConveyancingCase = {
    ...caseData.case,
    property: caseData.property,
    parties: caseData.parties,
    financials: caseData.financials,
  } as ConveyancingCase

  const caseRepo = new JsonCaseRepository(conveyancingCase)
  const getCase = createGetCase(caseRepo)

  const apiKey = import.meta.env.VITE_OPENAI_API_KEY as string | undefined
  const useMock = import.meta.env.VITE_USE_MOCK_AI === 'true'

  let explainerAgent: CaseExplainerAgent
  if (!useMock && apiKey) {
    const { OpenAICaseExplainerAgent } = await import('../../src/infrastructure/OpenAICaseExplainerAgent')
    explainerAgent = new OpenAICaseExplainerAgent(apiKey)
  } else {
    explainerAgent = new MockCaseExplainerAgent()
  }

  const getCaseConversation = createGetCaseConversation(caseRepo, tasksRepo, eventsRepo, explainerAgent)

  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <App getCaseTasks={getCaseTasks} getCase={getCase} getCaseConversation={getCaseConversation} />
    </StrictMode>,
  )
})()
