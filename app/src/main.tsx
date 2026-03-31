import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import tasksData from '@data/tasks.json'
import { JsonTasksRepository } from '../../src/infrastructure/JsonTasksRepository'
import { createGetCaseTasks } from '../../src/application/getCaseTasks'

const repo = new JsonTasksRepository(tasksData.tasks)
const getCaseTasks = createGetCaseTasks(repo)

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App getCaseTasks={getCaseTasks} />
  </StrictMode>,
)
