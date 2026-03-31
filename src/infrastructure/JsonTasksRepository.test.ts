import { JsonTasksRepository } from './JsonTasksRepository'
import type { CaseTask } from '../domain/task'

const sampleTasks: CaseTask[] = [
  {
    id: 'TASK-001',
    case_id: 'CASE-2024-0847',
    title: 'Client onboarding and ID verification',
    description: 'Verify client identity documents.',
    category: 'compliance',
    status: 'completed',
    assigned_to: 'David Chen',
    created_at: '2024-09-12T09:30:00Z',
    started_at: '2024-09-12T10:00:00Z',
    completed_at: '2024-09-14T14:20:00Z',
    dependencies: [],
    notes: 'AML check passed.',
  },
  {
    id: 'TASK-002',
    case_id: 'CASE-2024-0847',
    title: 'Request and review mortgage offer',
    description: 'Obtain formal mortgage offer.',
    category: 'finance',
    status: 'completed',
    assigned_to: 'David Chen',
    created_at: '2024-09-12T09:30:00Z',
    started_at: '2024-09-15T09:00:00Z',
    completed_at: '2024-10-03T11:45:00Z',
    dependencies: ['TASK-001'],
    notes: 'Mortgage offer received.',
  },
  {
    id: 'TASK-099',
    case_id: 'CASE-2024-0001',
    title: 'Other case task',
    description: 'Belongs to a different case.',
    category: 'compliance',
    status: 'not_started',
    assigned_to: 'Jane Smith',
    created_at: '2024-01-01T00:00:00Z',
    started_at: null,
    completed_at: null,
    dependencies: [],
    notes: '',
  },
]

describe('JsonTasksRepository', () => {
  it('returns tasks for the requested case ID', async () => {
    const repo = new JsonTasksRepository(sampleTasks)
    const result = await repo.getTasksForCase('CASE-2024-0847')

    expect(result).toHaveLength(2)
    expect(result.every((t) => t.case_id === 'CASE-2024-0847')).toBe(true)
  })

  it('returns an empty array for an unknown case ID', async () => {
    const repo = new JsonTasksRepository(sampleTasks)
    const result = await repo.getTasksForCase('CASE-9999-0000')

    expect(result).toEqual([])
  })

  it('maps all fields correctly', async () => {
    const repo = new JsonTasksRepository(sampleTasks)
    const [task] = await repo.getTasksForCase('CASE-2024-0847')

    expect(task.id).toBe('TASK-001')
    expect(task.title).toBe('Client onboarding and ID verification')
    expect(task.status).toBe('completed')
    expect(task.dependencies).toEqual([])
    expect(task.started_at).toBe('2024-09-12T10:00:00Z')
    expect(task.completed_at).toBe('2024-09-14T14:20:00Z')
  })

  it('does not include tasks from other cases', async () => {
    const repo = new JsonTasksRepository(sampleTasks)
    const result = await repo.getTasksForCase('CASE-2024-0847')

    expect(result.find((t) => t.id === 'TASK-099')).toBeUndefined()
  })
})
