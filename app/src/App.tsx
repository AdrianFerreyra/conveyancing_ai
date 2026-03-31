import { useEffect, useState } from 'react'
import './App.css'
import type { CaseTask } from '../../src/domain/task'
import type { ConveyancingCase } from '../../src/domain/conveyancingCase'
import type { CaseConversation } from '../../src/domain/conversation'
import { buildTaskGraph, type TaskGraph as TaskGraphModel } from '../../src/domain/taskGraph'
import { CaseCard } from './CaseCard'
import { CaseChat } from './CaseChat'
import { TaskGraph } from './TaskGraph'

const SUPPORT_EMAIL = 'd.chen@ourfirm.co.uk'
const SUPPORT_PHONE = '0117 300 4500'

function ErrorCard({ title, message }: { title: string; message: string }) {
  return (
    <div className="error-card">
      <p className="error-card-title">{title}</p>
      <p className="error-card-message">{message}</p>
      <p className="error-card-contact">
        <a href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a>
        <span className="error-card-sep">·</span>
        <a href={`tel:${SUPPORT_PHONE.replace(/\s/g, '')}`}>{SUPPORT_PHONE}</a>
      </p>
    </div>
  )
}

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
  const [caseNotFound, setCaseNotFound] = useState(false)

  useEffect(() => {
    if (caseId) {
      document.title = `Case ${caseId} — Conveyancing AI`
    }
  }, [caseId])

  useEffect(() => {
    if (!caseId) return
    getCaseTasks(caseId).then((tasks: CaseTask[]) => setTaskGraph(buildTaskGraph(tasks)))
    getCase(caseId).then((result) => {
      if (result === null) setCaseNotFound(true)
      else setConveyancingCase(result)
    })
    getCaseConversation(caseId).then(setConversation)
  }, [caseId, getCaseTasks, getCase, getCaseConversation])

  if (caseId && caseNotFound) {
    return (
      <div className="app">
        <header className="app-header">
          <h1>Conveyancing AI</h1>
        </header>
        <main className="app-main">
          <ErrorCard
            title="Case can't be found"
            message={`No case was found for ID "${caseId}". Please check your link or contact us for assistance.`}
          />
        </main>
      </div>
    )
  }

  if (caseId) {
    return (
      <div className="app">
        <header className="app-header">
          <div className="app-header-inner">
            <h1>Conveyancing AI</h1>
            <span className="app-header-case-id">Case {caseId}</span>
          </div>
        </header>
        <main className="app-main">
          <div className="case-layout">
            <div>
              {conveyancingCase
                ? <CaseCard conveyancingCase={conveyancingCase} />
                : <div className="loading-skeleton loading-skeleton--card" />}
            </div>
            <div className="tasks-column">
              {taskGraph !== null
                ? <TaskGraph graph={taskGraph} />
                : <div className="loading-skeleton loading-skeleton--graph" />}
              {conversation
                ? <CaseChat messages={conversation.messages} />
                : <p className="loading-text">Loading explanation…</p>}
            </div>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="app">
      <header className="app-header">
        <div className="app-header-inner">
          <h1>Conveyancing AI</h1>
        </div>
      </header>
      <main className="app-main">
        <ErrorCard
          title="Case ID is required"
          message="No case ID was provided in the URL. Please check your link or contact us for assistance."
        />
      </main>
    </div>
  )
}

export default App
