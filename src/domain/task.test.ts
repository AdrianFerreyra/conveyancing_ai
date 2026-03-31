import type { CaseTask, TaskStatus } from './task'

describe('CaseTask domain model', () => {
  it('accepts a fully populated task', () => {
    const task: CaseTask = {
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
    }

    expect(task.id).toBe('TASK-001')
    expect(task.case_id).toBe('CASE-2024-0847')
    expect(task.status).toBe('completed')
  })

  it('accepts null timestamps for not-yet-started tasks', () => {
    const task: CaseTask = {
      id: 'TASK-010',
      case_id: 'CASE-2024-0847',
      title: 'Exchange contracts',
      description: 'Exchange contracts with seller.',
      category: 'exchange',
      status: 'not_started',
      assigned_to: 'David Chen',
      created_at: '2024-10-20T08:00:00Z',
      started_at: null,
      completed_at: null,
      dependencies: ['TASK-008', 'TASK-009'],
      notes: '',
    }

    expect(task.started_at).toBeNull()
    expect(task.completed_at).toBeNull()
  })

  it('accepts a blocked task with blocked_reason', () => {
    const task: CaseTask = {
      id: 'TASK-009',
      case_id: 'CASE-2024-0847',
      title: 'Report on title to mortgage lender',
      description: 'Prepare Certificate of Title.',
      category: 'finance',
      status: 'blocked',
      assigned_to: 'David Chen',
      created_at: '2024-10-20T08:00:00Z',
      started_at: null,
      completed_at: null,
      dependencies: ['TASK-008'],
      notes: '',
      blocked_reason: 'Awaiting resolution of outstanding enquiries.',
    }

    expect(task.status).toBe('blocked')
    expect(task.blocked_reason).toBe('Awaiting resolution of outstanding enquiries.')
  })

  it('accepts a task with an enquiry tracker', () => {
    const task: CaseTask = {
      id: 'TASK-008',
      case_id: 'CASE-2024-0847',
      title: 'Raise and resolve pre-contract enquiries',
      description: 'Raise enquiries with seller.',
      category: 'enquiries',
      status: 'in_progress',
      assigned_to: 'David Chen',
      created_at: '2024-10-05T09:00:00Z',
      started_at: '2024-10-05T10:00:00Z',
      completed_at: null,
      dependencies: [],
      notes: '',
      enquiries: {
        total_raised: 15,
        resolved: 13,
        outstanding: 2,
        last_chased: '2024-12-13T09:30:00Z',
      },
    }

    expect(task.enquiries?.outstanding).toBe(2)
  })

  it('covers all valid TaskStatus values', () => {
    const statuses: TaskStatus[] = [
      'not_started',
      'in_progress',
      'in_review',
      'blocked',
      'completed',
    ]
    expect(statuses).toHaveLength(5)
  })
})
