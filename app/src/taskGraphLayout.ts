export const NODE_W = 160
export const NODE_H = 50
export const LEVEL_STRIDE = 220
export const ROW_STRIDE = 70
export const PADDING = 24

export const STATUS_COLOR: Record<string, string> = {
  completed: '#22c55e',
  in_progress: '#3b82f6',
  in_review: '#8b5cf6',
  blocked: '#f59e0b',
  not_started: '#9ca3af',
}

export function nodeCoords(level: number, position: number): { x: number; y: number } {
  return {
    x: level * LEVEL_STRIDE + PADDING,
    y: position * ROW_STRIDE + PADDING,
  }
}

export function truncate(text: string, max: number): string {
  return text.length > max ? text.slice(0, max - 1) + '…' : text
}
