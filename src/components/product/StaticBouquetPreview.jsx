import { FLOWER_TYPES } from '../hero/bouquetConfig'
import BouquetStage from '../hero/BouquetStage'
import '../hero/bouquet-hero.css'

const FLOWER_TYPES_BY_ID = Object.fromEntries(FLOWER_TYPES.map((f) => [f.id, f]))

// Renders a fixed, non-interactive arrangement using the same wrap + flower
// art and layering as the interactive builder, so product photography stays
// visually consistent without needing separate photographed assets.
function StaticBouquetPreview({ arrangement, className = '' }) {
  const placed = arrangement.map((slot, i) => ({
    instanceId: `preview-${i}`,
    flowerId: slot.flowerId,
    x: slot.x,
    y: slot.y,
    rotate: slot.rotate,
    heightFrac: slot.height,
    z: i + 1,
  }))

  return (
    <BouquetStage
      className={`bouquet-stage--preview${className ? ` ${className}` : ''}`}
      placed={placed}
      flowerTypesById={FLOWER_TYPES_BY_ID}
      selectedId={null}
      draggingInstanceId={null}
      isDropActive={false}
      showHint={false}
      interactive={false}
    />
  )
}

export default StaticBouquetPreview
