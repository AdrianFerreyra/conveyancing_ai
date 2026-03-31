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

describe('nodeCoords', () => {
  it('places the first node at the padding offset', () => {
    const { x, y } = nodeCoords(0, 0)
    expect(x).toBe(PADDING)
    expect(y).toBe(PADDING)
  })

  it('advances x by LEVEL_STRIDE per level', () => {
    const { x: x0 } = nodeCoords(0, 0)
    const { x: x1 } = nodeCoords(1, 0)
    const { x: x2 } = nodeCoords(2, 0)
    expect(x1 - x0).toBe(LEVEL_STRIDE)
    expect(x2 - x1).toBe(LEVEL_STRIDE)
  })

  it('advances y by ROW_STRIDE per position within a level', () => {
    const { y: y0 } = nodeCoords(0, 0)
    const { y: y1 } = nodeCoords(0, 1)
    const { y: y2 } = nodeCoords(0, 2)
    expect(y1 - y0).toBe(ROW_STRIDE)
    expect(y2 - y1).toBe(ROW_STRIDE)
  })

  it('keeps y constant when only the level changes', () => {
    expect(nodeCoords(0, 3).y).toBe(nodeCoords(5, 3).y)
  })

  it('keeps x constant when only the position changes', () => {
    expect(nodeCoords(2, 0).x).toBe(nodeCoords(2, 4).x)
  })
})

describe('truncate', () => {
  it('returns the string unchanged when it is within the limit', () => {
    expect(truncate('hello', 10)).toBe('hello')
    expect(truncate('hello', 5)).toBe('hello')
  })

  it('truncates strings longer than the limit and appends an ellipsis', () => {
    const result = truncate('hello world', 8)
    expect(result).toHaveLength(8)
    expect(result.endsWith('…')).toBe(true)
  })

  it('truncates to exactly max characters including the ellipsis', () => {
    const result = truncate('abcdefghij', 6)
    expect(result).toBe('abcde…')
  })

  it('handles an empty string', () => {
    expect(truncate('', 5)).toBe('')
  })
})

describe('STATUS_COLOR', () => {
  it('defines a colour for every task status', () => {
    const requiredStatuses = ['completed', 'in_progress', 'in_review', 'blocked', 'not_started']
    for (const status of requiredStatuses) {
      expect(STATUS_COLOR[status]).toMatch(/^#[0-9a-f]{6}$/i)
    }
  })
})

describe('layout constants', () => {
  it('NODE_W and NODE_H are positive numbers', () => {
    expect(NODE_W).toBeGreaterThan(0)
    expect(NODE_H).toBeGreaterThan(0)
  })

  it('LEVEL_STRIDE is wider than NODE_W to leave room for edges', () => {
    expect(LEVEL_STRIDE).toBeGreaterThan(NODE_W)
  })

  it('ROW_STRIDE is taller than NODE_H to separate nodes vertically', () => {
    expect(ROW_STRIDE).toBeGreaterThan(NODE_H)
  })
})
