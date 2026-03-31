import { useEffect, useState } from 'react'
import './App.css'
import type { CaseTask } from '../../src/domain/task'
import type { ConveyancingCase } from '../../src/domain/conveyancingCase'
import { CaseCard } from './CaseCard'

interface Props {
  getCaseTasks: (caseId: string) => Promise<CaseTask[]>
  getCase: (caseId: string) => Promise<ConveyancingCase | null>
}

function App({ getCaseTasks, getCase }: Props) {
  const match = window.location.pathname.match(/^\/case\/(.+)$/)
  const caseId = match?.[1]

  const [tasks, setTasks] = useState<CaseTask[] | null>(null)
  const [conveyancingCase, setConveyancingCase] = useState<ConveyancingCase | null>(null)

  useEffect(() => {
    if (!caseId) return
    getCaseTasks(caseId).then(setTasks)
    getCase(caseId).then(setConveyancingCase)
  }, [caseId, getCaseTasks, getCase])

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
              <pre>{tasks !== null ? JSON.stringify(tasks, null, 2) : 'Loading tasks…'}</pre>
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
