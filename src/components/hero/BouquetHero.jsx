import { useEffect, useMemo, useRef, useState } from 'react'
import { FLOWER_TYPES, WRAPPING_FEE } from './bouquetConfig'
import { useBouquet } from './useBouquet'
import BouquetStage from './BouquetStage'
import FlowerPicker from './FlowerPicker'
import { useCart } from '../../context/CartContext'
import './bouquet-hero.css'

const DRAG_THRESHOLD = 5

function pointInRect(x, y, rect) {
  return x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom
}

function BouquetHero() {
  const bouquet = useBouquet()
  const stageRef = useRef(null)
  const justDraggedRef = useRef(false)
  const { addCustomBouquet } = useCart()

  const [dragPreview, setDragPreview] = useState(null) // { flowerId, clientX, clientY, overStage }
  const [draggingInstanceId, setDraggingInstanceId] = useState(null)
  const [justAdded, setJustAdded] = useState(false)

  const flowerTypesById = useMemo(
    () => Object.fromEntries(FLOWER_TYPES.map((f) => [f.id, f])),
    []
  )

  const counts = useMemo(() => {
    const map = {}
    for (const p of bouquet.placed) {
      map[p.flowerId] = (map[p.flowerId] || 0) + 1
    }
    return map
  }, [bouquet.placed])

  const flowersTotal = useMemo(
    () => bouquet.placed.reduce((sum, p) => sum + (flowerTypesById[p.flowerId]?.price ?? 0), 0),
    [bouquet.placed, flowerTypesById]
  )
  const total = bouquet.placed.length > 0 ? flowersTotal + WRAPPING_FEE : 0

  useEffect(() => {
    function onKeyDown(e) {
      if (e.key === 'Escape') bouquet.deselect()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [bouquet])

  function handlePickerPointerDown(flowerId, e) {
    if (e.pointerType === 'mouse' && e.button !== 0) return
    const startX = e.clientX
    const startY = e.clientY
    let moved = false

    function onMove(ev) {
      const dx = ev.clientX - startX
      const dy = ev.clientY - startY
      if (!moved && Math.hypot(dx, dy) > DRAG_THRESHOLD) moved = true
      if (!moved) return
      const stageEl = stageRef.current
      const overStage = stageEl ? pointInRect(ev.clientX, ev.clientY, stageEl.getBoundingClientRect()) : false
      setDragPreview({ flowerId, clientX: ev.clientX, clientY: ev.clientY, overStage })
    }

    function cleanup() {
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerup', onUp)
      window.removeEventListener('pointercancel', cleanup)
    }

    function onUp(ev) {
      cleanup()
      if (moved) {
        justDraggedRef.current = true
        const stageEl = stageRef.current
        if (stageEl) {
          const rect = stageEl.getBoundingClientRect()
          if (pointInRect(ev.clientX, ev.clientY, rect)) {
            bouquet.addFlower(flowerId, {
              x: (ev.clientX - rect.left) / rect.width,
              y: (ev.clientY - rect.top) / rect.height,
            })
          }
        }
      }
      setDragPreview(null)
    }

    window.addEventListener('pointermove', onMove)
    window.addEventListener('pointerup', onUp)
    window.addEventListener('pointercancel', cleanup)
  }

  function handlePickerPick(flowerId) {
    if (justDraggedRef.current) {
      justDraggedRef.current = false
      return
    }
    bouquet.addFlower(flowerId)
  }

  function handleFlowerPointerDown(instanceId, e) {
    e.stopPropagation()
    if (e.pointerType === 'mouse' && e.button !== 0) return
    bouquet.selectFlower(instanceId)

    const startX = e.clientX
    const startY = e.clientY
    let moved = false
    let historyPushed = false

    function onMove(ev) {
      const stageEl = stageRef.current
      if (!stageEl) return
      const dx = ev.clientX - startX
      const dy = ev.clientY - startY
      if (!moved && Math.hypot(dx, dy) > DRAG_THRESHOLD) moved = true
      if (!moved) return
      if (!historyPushed) {
        bouquet.beginMove(instanceId)
        historyPushed = true
        setDraggingInstanceId(instanceId)
      }
      const rect = stageEl.getBoundingClientRect()
      bouquet.moveFlower(
        instanceId,
        (ev.clientX - rect.left) / rect.width,
        (ev.clientY - rect.top) / rect.height
      )
    }

    function onUp() {
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerup', onUp)
      window.removeEventListener('pointercancel', onUp)
      setDraggingInstanceId(null)
    }

    window.addEventListener('pointermove', onMove)
    window.addEventListener('pointerup', onUp)
    window.addEventListener('pointercancel', onUp)
  }

  function handleAddToCart() {
    const description = Object.entries(counts)
      .map(([flowerId, qty]) => `${qty} ${flowerTypesById[flowerId].name}${qty > 1 ? 's' : ''}`)
      .join(', ')
    addCustomBouquet({ price: total, description })
    bouquet.reset()
    setJustAdded(true)
    window.setTimeout(() => setJustAdded(false), 2400)
  }

  const flowerCount = bouquet.placed.length
  const countLabel = `${flowerCount} ${flowerCount === 1 ? 'flower' : 'flowers'} in your bouquet`
  const dragGhostFlower = dragPreview ? flowerTypesById[dragPreview.flowerId] : null

  return (
    <section className="bouquet-hero" aria-labelledby="bouquet-hero-heading">
      <div className="bouquet-hero__intro">
        <h1 id="bouquet-hero-heading">A little joy, arranged by you.</h1>
        <p>Pick your favourite blooms, arrange them your way, and add your bouquet to cart.</p>
      </div>

      <div className="bouquet-hero__workspace">
        <BouquetStage
          ref={stageRef}
          placed={bouquet.placed}
          flowerTypesById={flowerTypesById}
          selectedId={bouquet.selectedId}
          draggingInstanceId={draggingInstanceId}
          isDropActive={Boolean(dragPreview?.overStage)}
          showHint={flowerCount === 0}
          onBackgroundPointerDown={() => bouquet.deselect()}
          onFlowerPointerDown={handleFlowerPointerDown}
          onSelect={bouquet.selectFlower}
          onNudge={bouquet.nudge}
          onRemove={bouquet.removeFlower}
        />

        <FlowerPicker
          flowers={FLOWER_TYPES}
          onPointerDown={handlePickerPointerDown}
          onPick={handlePickerPick}
          activeFlowerId={dragPreview?.flowerId ?? null}
        />
      </div>

      <div className="bouquet-controls">
        <p className="bouquet-controls__count" aria-live="polite">
          {countLabel}
        </p>
        <div className="bouquet-controls__buttons">
          <button type="button" onClick={bouquet.removeSelected} disabled={!bouquet.canRemoveSelected}>
            Remove selected
          </button>
          <button type="button" onClick={bouquet.undo} disabled={!bouquet.canUndo}>
            Undo
          </button>
          <button type="button" onClick={bouquet.reset} disabled={!bouquet.canReset}>
            Reset
          </button>
        </div>
      </div>

      <div className="bouquet-hero__summary">
        {flowerCount > 0 ? (
          <ul className="bouquet-hero__breakdown">
            {Object.entries(counts).map(([flowerId, qty]) => (
              <li key={flowerId}>
                {qty} × {flowerTypesById[flowerId].name} (${flowerTypesById[flowerId].price} each)
              </li>
            ))}
            <li>Kraft wrap &amp; tie — ${WRAPPING_FEE}</li>
          </ul>
        ) : (
          <p className="bouquet-hero__breakdown-empty">Add a flower to see your price.</p>
        )}

        <div className="bouquet-hero__total">
          <span>Total</span>
          <span>${total.toFixed(2)}</span>
        </div>

        <button
          type="button"
          className="bouquet-hero__add"
          disabled={flowerCount === 0}
          onClick={handleAddToCart}
        >
          {justAdded ? 'Added to cart ✓' : 'Add to cart'}
        </button>
      </div>

      {dragPreview && dragGhostFlower && (
        <div
          className="drag-ghost"
          aria-hidden="true"
          style={{ left: dragPreview.clientX, top: dragPreview.clientY }}
        >
          <img
            src={dragGhostFlower.image}
            alt=""
            style={{ aspectRatio: dragGhostFlower.aspect }}
            draggable={false}
          />
        </div>
      )}
    </section>
  )
}

export default BouquetHero
