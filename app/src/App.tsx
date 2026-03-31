import { useEffect, useState } from 'react'
import './App.css'
import type { ConveyancingCase } from '../../src/domain/conveyancingCase'
import { CaseCard } from './CaseCard'

interface Props {
  getCase: (caseId: string) => Promise<ConveyancingCase | null>
}

function App({ getCase }: Props) {
  const match = window.location.pathname.match(/^\/case\/(.+)$/)
  const caseId = match?.[1]

  const [conveyancingCase, setConveyancingCase] = useState<ConveyancingCase | null>(null)

  useEffect(() => {
    if (!caseId) return
    getCase(caseId).then(setConveyancingCase)
  }, [caseId, getCase])

  if (caseId) {
    return (
      <div className="app">
        <header className="app-header">
          <h1>Conveyancing AI</h1>
        </header>
        <main className="app-main">
          {conveyancingCase
            ? <CaseCard conveyancingCase={conveyancingCase} />
            : <p>Loading case…</p>}
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
