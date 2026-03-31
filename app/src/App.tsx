import { useEffect, useState } from 'react'
import './App.css'
import type { CaseTask } from '../../src/domain/task'

interface Props {
  getCaseTasks: (caseId: string) => Promise<CaseTask[]>
}

function App({ getCaseTasks }: Props) {
  const match = window.location.pathname.match(/^\/case\/(.+)$/)
  const caseId = match?.[1]

  const [tasks, setTasks] = useState<CaseTask[] | null>(null)

  useEffect(() => {
    if (!caseId) return
    getCaseTasks(caseId).then(setTasks)
  }, [caseId, getCaseTasks])

  if (caseId) {
    return (
      <div className="app">
        <header className="app-header">
          <h1>Conveyancing AI</h1>
        </header>
        <main className="app-main">
          <pre>{tasks !== null ? JSON.stringify(tasks, null, 2) : 'Loading…'}</pre>
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
