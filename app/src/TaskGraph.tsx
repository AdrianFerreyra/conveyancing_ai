import { useState } from 'react'
import type { CaseTask } from '../../src/domain/task'
import type { TaskGraph } from '../../src/domain/taskGraph'
import {
  NODE_W,
  NODE_H,
  LEVEL_STRIDE,
  ROW_STRIDE,
  PADDING,
  STATUS_COLOR,
  nodeCoords,
  truncate,
} from './taskGraphLayout'
import './TaskGraph.css'

interface Props {
  graph: TaskGraph
}

export function TaskGraph({ graph }: Props) {
  const [hoveredTask, setHoveredTask] = useState<CaseTask | null>(null)
  const [popoverPos, setPopoverPos] = useState({ x: 0, y: 0 })

  const coordsByTaskId = new Map(
    graph.nodes.map((n) => [n.task.id, nodeCoords(n.level, n.position)])
  )

  const maxX = Math.max(...graph.nodes.map((n) => n.level)) * LEVEL_STRIDE + NODE_W + PADDING * 2
  const maxY = Math.max(...graph.nodes.map((n) => n.position)) * ROW_STRIDE + NODE_H + PADDING * 2

  function handleMouseEnter(task: CaseTask, e: React.MouseEvent) {
    const containerRect = (e.currentTarget as SVGElement).closest('.task-graph')!.getBoundingClientRect()
    const nodeRect = (e.currentTarget as SVGElement).getBoundingClientRect()
    setHoveredTask(task)
    setPopoverPos({
      x: nodeRect.left - containerRect.left + NODE_W + 8,
      y: nodeRect.top - containerRect.top,
    })
  }

  return (
    <div className="task-graph">
      <svg width={maxX} height={maxY}>
        <defs>
          <marker id="arrow" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
            <path d="M0,0 L6,3 L0,6 Z" fill="#d1d5db" />
          </marker>
        </defs>

        {/* Edges */}
        {graph.edges.map((edge) => {
          const from = coordsByTaskId.get(edge.fromId)
          const to = coordsByTaskId.get(edge.toId)
          if (!from || !to) return null
          const x1 = from.x + NODE_W
          const y1 = from.y + NODE_H / 2
          const x2 = to.x
          const y2 = to.y + NODE_H / 2
          const cx = (x1 + x2) / 2
          return (
            <path
              key={`${edge.fromId}-${edge.toId}`}
              d={`M${x1},${y1} C${cx},${y1} ${cx},${y2} ${x2},${y2}`}
              fill="none"
              stroke="#d1d5db"
              strokeWidth={1.5}
              markerEnd="url(#arrow)"
            />
          )
        })}

        {/* Nodes */}
        {graph.nodes.map(({ task, level, position }) => {
          const pos = nodeCoords(level, position)
          const color = STATUS_COLOR[task.status] ?? '#9ca3af'
          return (
            <g
              key={task.id}
              data-testid="task-node"
              style={{ cursor: 'pointer' }}
              onMouseEnter={(e) => handleMouseEnter(task, e)}
              onMouseLeave={() => setHoveredTask(null)}
            >
              <rect
                x={pos.x}
                y={pos.y}
                width={NODE_W}
                height={NODE_H}
                rx={8}
                fill={color}
                opacity={0.15}
                stroke={color}
                strokeWidth={1.5}
              />
              <text
                x={pos.x + NODE_W / 2}
                y={pos.y + 18}
                textAnchor="middle"
                fontSize={11}
                fontWeight={600}
                fill="#111827"
              >
                {task.id}
              </text>
              <text
                x={pos.x + NODE_W / 2}
                y={pos.y + 34}
                textAnchor="middle"
                fontSize={10}
                fill="#374151"
              >
                {truncate(task.title, 22)}
              </text>
            </g>
          )
        })}
      </svg>

      {hoveredTask && (
        <div
          className="task-popover"
          style={{ left: popoverPos.x, top: popoverPos.y }}
        >
          <div className="task-popover-title">{hoveredTask.title}</div>
          <div className="task-popover-row">
            <span className="task-popover-label">Status</span>
            <span
              className="task-popover-status"
              style={{
                background: (STATUS_COLOR[hoveredTask.status] ?? '#9ca3af') + '33',
                color: STATUS_COLOR[hoveredTask.status] ?? '#9ca3af',
              }}
            >
              {hoveredTask.status.replace('_', ' ')}
            </span>
          </div>
          <div className="task-popover-row">
            <span className="task-popover-label">Category</span>
            <span>{hoveredTask.category}</span>
          </div>
          <div className="task-popover-row">
            <span className="task-popover-label">Assigned to</span>
            <span>{hoveredTask.assigned_to}</span>
          </div>
          <div className="task-popover-description">{hoveredTask.description}</div>
          {hoveredTask.blocked_reason && (
            <div className="task-popover-blocked">Blocked: {hoveredTask.blocked_reason}</div>
          )}
          {hoveredTask.enquiries && (
            <div className="task-popover-row">
              <span className="task-popover-label">Enquiries</span>
              <span>
                {hoveredTask.enquiries.resolved}/{hoveredTask.enquiries.total_raised} resolved
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
