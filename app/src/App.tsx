import { useEffect, useState } from 'react'
import './App.css'
import type { CaseTask } from '../../src/domain/task'
import type { ConveyancingCase } from '../../src/domain/conveyancingCase'
import type { CaseConversation } from '../../src/domain/conversation'
import { buildTaskGraph, type TaskGraph as TaskGraphModel } from '../../src/domain/taskGraph'
import { CaseCard } from './CaseCard'
import { CaseChat } from './CaseChat'
import { TaskGraph } from './TaskGraph'

interface Props {
  getCaseTasks: (caseId: string) => Promise<CaseTask[]>
  getCase: (caseId: string) => Promise<ConveyancingCase | null>
  getCaseConversation: (caseId: string) => Promise<CaseConversation | null>
}

function App({ getCaseTasks, getCase, getCaseConversation }: Props) {
  const match = window.location.pathname.match(/^\/case\/(.+)$/)
  const caseId = match?.[1]

  const [taskGraph, setTaskGraph] = useState<TaskGraphModel | null>(null)
  const [conveyancingCase, setConveyancingCase] = useState<ConveyancingCase | null>(null)
  const [conversation, setConversation] = useState<CaseConversation | null>(null)

  useEffect(() => {
    if (!caseId) return
    getCaseTasks(caseId).then((tasks: CaseTask[]) => setTaskGraph(buildTaskGraph(tasks)))
    getCase(caseId).then(setConveyancingCase)
    getCaseConversation(caseId).then(setConversation)
  }, [caseId, getCaseTasks, getCase, getCaseConversation])

  if (caseId) {
    return (
      <div className="app">
        <header className="app-header">
          <h1>Conveyancing AI</h1>
        </header>
        <main className="app-main">
          <div className="case-layout">
            <div>
              {conveyancingCase
                ? <CaseCard conveyancingCase={conveyancingCase} />
                : <p>Loading case…</p>}
            </div>
            <div className="tasks-column">
              {taskGraph !== null
                ? <TaskGraph graph={taskGraph} />
                : <p>Loading tasks…</p>}
{conversation
                ? <CaseChat messages={conversation.messages} />
                : <p>Loading explanation…</p>}
            </div>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>Conveyancing AI</h1>
      </header>
      <main className="app-main">
        <p>Ready.</p>
      </main>
    </div>
  )
}

export default App
