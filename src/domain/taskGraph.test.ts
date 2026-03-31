import type { CaseTask } from './task'
import { buildTaskGraph } from './taskGraph'

function makeTask(id: string, dependencies: string[]): CaseTask {
  return {
    id,
    case_id: 'CASE-2024-0847',
    title: `Task ${id}`,
    description: '',
    category: 'compliance',
    status: 'not_started',
    assigned_to: 'David Chen',
    created_at: '2024-01-01T00:00:00Z',
    started_at: null,
    completed_at: null,
    dependencies,
    notes: '',
  }
}

describe('buildTaskGraph', () => {
  it('returns an empty graph for an empty task list', () => {
    const graph = buildTaskGraph([])
    expect(graph.nodes).toHaveLength(0)
    expect(graph.edges).toHaveLength(0)
  })

  it('places tasks with no dependencies at level 0', () => {
    const tasks = [makeTask('A', []), makeTask('B', [])]
    const graph = buildTaskGraph(tasks)
    const nodeA = graph.nodes.find((n) => n.task.id === 'A')!
    const nodeB = graph.nodes.find((n) => n.task.id === 'B')!
    expect(nodeA.level).toBe(0)
    expect(nodeB.level).toBe(0)
  })

  it('places a task one level above its dependency', () => {
    const tasks = [makeTask('A', []), makeTask('B', ['A'])]
    const graph = buildTaskGraph(tasks)
    const nodeB = graph.nodes.find((n) => n.task.id === 'B')!
    expect(nodeB.level).toBe(1)
  })

  it('uses the maximum dependency level to determine the task level', () => {
    const tasks = [
      makeTask('A', []),
      makeTask('B', []),
      makeTask('C', ['A']),
      makeTask('D', ['B', 'C']),
    ]
    const graph = buildTaskGraph(tasks)
    const nodeC = graph.nodes.find((n) => n.task.id === 'C')!
    const nodeD = graph.nodes.find((n) => n.task.id === 'D')!
    expect(nodeC.level).toBe(1)
    expect(nodeD.level).toBe(2)
  })

  it('assigns sequential positions to tasks at the same level', () => {
    const tasks = [makeTask('A', []), makeTask('B', []), makeTask('C', [])]
    const graph = buildTaskGraph(tasks)
    const positions = graph.nodes.map((n) => n.position).sort()
    expect(positions).toEqual([0, 1, 2])
  })

  it('builds edges from task dependencies', () => {
    const tasks = [makeTask('A', []), makeTask('B', ['A']), makeTask('C', ['A', 'B'])]
    const graph = buildTaskGraph(tasks)
    expect(graph.edges).toContainEqual({ fromId: 'A', toId: 'B' })
    expect(graph.edges).toContainEqual({ fromId: 'A', toId: 'C' })
    expect(graph.edges).toContainEqual({ fromId: 'B', toId: 'C' })
    expect(graph.edges).toHaveLength(3)
  })

  it('produces no edges for tasks with no dependencies', () => {
    const tasks = [makeTask('A', []), makeTask('B', []), makeTask('C', [])]
    const graph = buildTaskGraph(tasks)
    expect(graph.edges).toHaveLength(0)
  })

  it('preserves task data on each node', () => {
    const tasks = [makeTask('A', [])]
    const graph = buildTaskGraph(tasks)
    expect(graph.nodes[0].task).toBe(tasks[0])
  })
})
