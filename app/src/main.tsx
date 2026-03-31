import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import tasksData from '@data/tasks.json'
import caseData from '@data/case.json'
import eventsData from '@data/events.json'
import { JsonTasksRepository } from './infrastructure/JsonTasksRepository'
import { JsonCaseRepository } from './infrastructure/JsonCaseRepository'
import { JsonEventsRepository } from './infrastructure/JsonEventsRepository'
import { createGetCaseTasks } from './application/getCaseTasks'
import { createGetCase } from './application/getCase'
import { createGetCaseConversation } from './application/getCaseConversation'
import { MockCaseExplainerAgent } from './infrastructure/MockCaseExplainerAgent'
import type { CaseExplainerAgent } from './application/ports/CaseExplainerAgent'
import type { ConveyancingCase } from './domain/conveyancingCase'
import type { CaseTask } from './domain/task'
import type { CaseEvent } from './domain/caseEvent'

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
    const { OpenAICaseExplainerAgent } = await import('./infrastructure/OpenAICaseExplainerAgent')
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
