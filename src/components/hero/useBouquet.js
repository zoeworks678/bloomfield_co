import { useCallback, useMemo, useReducer } from 'react'
import { PLACEMENT_SLOTS } from './bouquetConfig'

let idCounter = 0
function nextInstanceId() {
  idCounter += 1
  return `bloom-${idCounter}`
}

const MAX_HISTORY = 50

function distance(a, b) {
  return Math.hypot(a.x - b.x, a.y - b.y)
}

function pickSlotIndex(placed, dropPoint) {
  const occupied = new Set(placed.map((p) => p.slotIndex))
  const freeIndices = PLACEMENT_SLOTS.map((_, i) => i).filter((i) => !occupied.has(i))
  const candidates = freeIndices.length ? freeIndices : PLACEMENT_SLOTS.map((_, i) => i)

  if (!dropPoint) return candidates[0]

  let best = candidates[0]
  let bestDist = Infinity
  for (const i of candidates) {
    const d = distance(PLACEMENT_SLOTS[i], dropPoint)
    if (d < bestDist) {
      bestDist = d
      best = i
    }
  }
  return best
}

function jitter(amount) {
  return (Math.random() * 2 - 1) * amount
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value))
}

function pushHistory(past, placed) {
  const next = [...past, placed]
  if (next.length > MAX_HISTORY) next.shift()
  return next
}

const initialState = {
  placed: [],
  selectedId: null,
  past: [],
}

function reducer(state, action) {
  switch (action.type) {
    case 'ADD': {
      const { flowerId, dropPoint } = action
      const slotIndex = pickSlotIndex(state.placed, dropPoint)
      const slot = PLACEMENT_SLOTS[slotIndex]
      const alreadyUsed = state.placed.some((p) => p.slotIndex === slotIndex)
      const instance = {
        instanceId: nextInstanceId(),
        flowerId,
        slotIndex,
        x: clamp(slot.x + jitter(alreadyUsed ? 0.05 : 0.018), 0.06, 0.94),
        y: clamp(slot.y + jitter(alreadyUsed ? 0.03 : 0.01), 0.3, 0.62),
        rotate: slot.rotate + jitter(alreadyUsed ? 10 : 5),
        heightFrac: clamp(slot.height + jitter(alreadyUsed ? 0.05 : 0.025), 0.3, 0.6),
        z: state.placed.length + 1,
      }
      return {
        placed: [...state.placed, instance],
        selectedId: instance.instanceId,
        past: pushHistory(state.past, state.placed),
      }
    }

    case 'BEGIN_MOVE': {
      return {
        ...state,
        selectedId: action.instanceId,
        past: pushHistory(state.past, state.placed),
      }
    }

    case 'MOVE': {
      const maxZ = state.placed.reduce((m, p) => Math.max(m, p.z), 0)
      return {
        ...state,
        placed: state.placed.map((p) =>
          p.instanceId === action.instanceId
            ? { ...p, x: clamp(action.x, 0.03, 0.97), y: clamp(action.y, 0.1, 0.85), z: maxZ + 1 }
            : p
        ),
      }
    }

    case 'NUDGE': {
      const target = state.placed.find((p) => p.instanceId === action.instanceId)
      if (!target) return state
      return {
        placed: state.placed.map((p) =>
          p.instanceId === action.instanceId
            ? { ...p, x: clamp(p.x + action.dx, 0.03, 0.97), y: clamp(p.y + action.dy, 0.1, 0.85) }
            : p
        ),
        selectedId: state.selectedId,
        past: pushHistory(state.past, state.placed),
      }
    }

    case 'REMOVE': {
      return {
        placed: state.placed.filter((p) => p.instanceId !== action.instanceId),
        selectedId: state.selectedId === action.instanceId ? null : state.selectedId,
        past: pushHistory(state.past, state.placed),
      }
    }

    case 'REMOVE_SELECTED': {
      if (!state.selectedId) return state
      return {
        placed: state.placed.filter((p) => p.instanceId !== state.selectedId),
        selectedId: null,
        past: pushHistory(state.past, state.placed),
      }
    }

    case 'SELECT': {
      if (state.selectedId === action.instanceId) return state
      return { ...state, selectedId: action.instanceId }
    }

    case 'DESELECT': {
      if (!state.selectedId) return state
      return { ...state, selectedId: null }
    }

    case 'UNDO': {
      if (!state.past.length) return state
      const past = state.past.slice(0, -1)
      const placed = state.past[state.past.length - 1]
      const stillExists = placed.some((p) => p.instanceId === state.selectedId)
      return { placed, selectedId: stillExists ? state.selectedId : null, past }
    }

    case 'RESET': {
      if (!state.placed.length) return state
      return {
        placed: [],
        selectedId: null,
        past: pushHistory(state.past, state.placed),
      }
    }

    default:
      return state
  }
}

export function useBouquet() {
  const [state, dispatch] = useReducer(reducer, initialState)

  const addFlower = useCallback(
    (flowerId, dropPoint) => dispatch({ type: 'ADD', flowerId, dropPoint }),
    []
  )
  const beginMove = useCallback(
    (instanceId) => dispatch({ type: 'BEGIN_MOVE', instanceId }),
    []
  )
  const moveFlower = useCallback(
    (instanceId, x, y) => dispatch({ type: 'MOVE', instanceId, x, y }),
    []
  )
  const nudge = useCallback(
    (instanceId, dx, dy) => dispatch({ type: 'NUDGE', instanceId, dx, dy }),
    []
  )
  const removeFlower = useCallback((instanceId) => dispatch({ type: 'REMOVE', instanceId }), [])
  const removeSelected = useCallback(() => dispatch({ type: 'REMOVE_SELECTED' }), [])
  const selectFlower = useCallback((instanceId) => dispatch({ type: 'SELECT', instanceId }), [])
  const deselect = useCallback(() => dispatch({ type: 'DESELECT' }), [])
  const undo = useCallback(() => dispatch({ type: 'UNDO' }), [])
  const reset = useCallback(() => dispatch({ type: 'RESET' }), [])

  const canUndo = state.past.length > 0
  const canReset = state.placed.length > 0
  const canRemoveSelected = state.selectedId !== null

  return useMemo(
    () => ({
      placed: state.placed,
      selectedId: state.selectedId,
      canUndo,
      canReset,
      canRemoveSelected,
      addFlower,
      beginMove,
      moveFlower,
      nudge,
      removeFlower,
      removeSelected,
      selectFlower,
      deselect,
      undo,
      reset,
    }),
    [
      state.placed,
      state.selectedId,
      canUndo,
      canReset,
      canRemoveSelected,
      addFlower,
      beginMove,
      moveFlower,
      nudge,
      removeFlower,
      removeSelected,
      selectFlower,
      deselect,
      undo,
      reset,
    ]
  )
}
