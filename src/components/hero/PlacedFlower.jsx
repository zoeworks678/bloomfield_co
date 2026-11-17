const NUDGE_X = 0.012
const NUDGE_Y = 0.014

function PlacedFlower({
  flowerType,
  instance,
  selected,
  dragging,
  interactive = true,
  onPointerDown,
  onSelect,
  onNudge,
  onRemove,
}) {
  const { x, y, rotate, heightFrac, z, instanceId } = instance
  const originX = flowerType.stemBaseXFrac * 100

  if (!interactive) {
    return (
      <div
        className="placed-flower placed-flower--static"
        style={{
          left: `${x * 100}%`,
          top: `${y * 100}%`,
          height: `${heightFrac * 100}%`,
          zIndex: z,
          transform: `translate(-${originX}%, -100%) rotate(${rotate}deg)`,
          transformOrigin: `${originX}% 100%`,
        }}
      >
        <span className="placed-flower__inner">
          <img src={flowerType.image} alt="" draggable={false} style={{ aspectRatio: flowerType.aspect }} />
        </span>
      </div>
    )
  }

  function handleKeyDown(e) {
    switch (e.key) {
      case 'ArrowLeft':
        e.preventDefault()
        onNudge(instanceId, -NUDGE_X, 0)
        break
      case 'ArrowRight':
        e.preventDefault()
        onNudge(instanceId, NUDGE_X, 0)
        break
      case 'ArrowUp':
        e.preventDefault()
        onNudge(instanceId, 0, -NUDGE_Y)
        break
      case 'ArrowDown':
        e.preventDefault()
        onNudge(instanceId, 0, NUDGE_Y)
        break
      case 'Delete':
      case 'Backspace':
        e.preventDefault()
        onRemove(instanceId)
        break
      default:
        break
    }
  }

  return (
    <button
      type="button"
      className={`placed-flower${selected ? ' is-selected' : ''}${dragging ? ' is-dragging' : ''}`}
      style={{
        left: `${x * 100}%`,
        top: `${y * 100}%`,
        height: `${heightFrac * 100}%`,
        zIndex: z,
        transform: `translate(-${originX}%, -100%) rotate(${rotate}deg)`,
        transformOrigin: `${originX}% 100%`,
      }}
      onPointerDown={(e) => onPointerDown(instanceId, e)}
      onFocus={() => onSelect(instanceId)}
      onKeyDown={handleKeyDown}
      aria-label={
        selected
          ? `${flowerType.name}, selected. Use arrow keys to move it, or press Delete to remove it.`
          : `${flowerType.name} in your bouquet. Press Enter to select it.`
      }
    >
      <span className="placed-flower__inner">
        <img src={flowerType.image} alt="" draggable={false} style={{ aspectRatio: flowerType.aspect }} />
      </span>
    </button>
  )
}

export default PlacedFlower
