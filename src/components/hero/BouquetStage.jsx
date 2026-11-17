import { forwardRef } from 'react'
import { WRAP, WRAP_FRONT_CLIP_CSS } from './bouquetConfig'
import PlacedFlower from './PlacedFlower'

const BouquetStage = forwardRef(function BouquetStage(
  {
    placed,
    flowerTypesById,
    selectedId,
    draggingInstanceId,
    isDropActive,
    showHint,
    interactive = true,
    className = '',
    onBackgroundPointerDown,
    onFlowerPointerDown,
    onSelect,
    onNudge,
    onRemove,
  },
  ref
) {
  return (
    <div
      ref={ref}
      className={`bouquet-stage${isDropActive ? ' is-drop-active' : ''}${interactive ? '' : ' bouquet-stage--static'}${className ? ` ${className}` : ''}`}
      style={{ aspectRatio: WRAP.aspect }}
      onPointerDown={interactive ? onBackgroundPointerDown : undefined}
    >
      <img className="wrap-layer wrap-layer--back" src={WRAP.image} alt="" draggable={false} />

      {placed.map((instance) => (
        <PlacedFlower
          key={instance.instanceId}
          instance={instance}
          flowerType={flowerTypesById[instance.flowerId]}
          selected={instance.instanceId === selectedId}
          dragging={instance.instanceId === draggingInstanceId}
          interactive={interactive}
          onPointerDown={onFlowerPointerDown}
          onSelect={onSelect}
          onNudge={onNudge}
          onRemove={onRemove}
        />
      ))}

      <img
        className="wrap-layer wrap-layer--front"
        src={WRAP.image}
        alt=""
        draggable={false}
        style={{ clipPath: WRAP_FRONT_CLIP_CSS, WebkitClipPath: WRAP_FRONT_CLIP_CSS }}
      />

      {interactive && (
        <p className={`stage-hint${showHint ? '' : ' is-hidden'}`} aria-hidden={!showHint}>
          Drag a flower into the wrapping to begin.
        </p>
      )}
    </div>
  )
})

export default BouquetStage
