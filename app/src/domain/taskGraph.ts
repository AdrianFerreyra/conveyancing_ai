import type { CaseTask } from './task'

export interface TaskGraphNode {
  task: CaseTask
  level: number
  position: number
}

export interface TaskGraphEdge {
  fromId: string
  toId: string
}

export interface TaskGraph {
  nodes: TaskGraphNode[]
  edges: TaskGraphEdge[]
}

export function buildTaskGraph(tasks: CaseTask[]): TaskGraph {
  if (tasks.length === 0) return { nodes: [], edges: [] }

  const taskById = new Map(tasks.map((t) => [t.id, t]))
  const levels = new Map<string, number>()

  function levelOf(id: string): number {
    if (levels.has(id)) return levels.get(id)!
    const task = taskById.get(id)
    if (!task || task.dependencies.length === 0) {
      levels.set(id, 0)
      return 0
    }
    const level = Math.max(...task.dependencies.map(levelOf)) + 1
    levels.set(id, level)
    return level
  }

  tasks.forEach((t) => levelOf(t.id))

  const positionByLevel = new Map<number, number>()
  const nodes: TaskGraphNode[] = tasks.map((task) => {
    const level = levels.get(task.id)!
    const position = positionByLevel.get(level) ?? 0
    positionByLevel.set(level, position + 1)
    return { task, level, position }
  })

  const edges: TaskGraphEdge[] = tasks.flatMap((task) =>
    task.dependencies.map((depId) => ({ fromId: depId, toId: task.id }))
  )

  return { nodes, edges }
}
