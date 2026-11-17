function FlowerPicker({ flowers, onPointerDown, onPick, activeFlowerId }) {
  return (
    <div className="flower-picker" role="group" aria-label="Flowers you can add to your bouquet">
      {flowers.map((flower) => (
        <button
          key={flower.id}
          type="button"
          className={`flower-picker__item${activeFlowerId === flower.id ? ' is-active' : ''}`}
          onPointerDown={(e) => onPointerDown(flower.id, e)}
          onClick={() => onPick(flower.id)}
          aria-label={`Add a ${flower.name} to your bouquet`}
        >
          <span className="flower-picker__thumb">
            <img
              src={flower.image}
              alt=""
              draggable={false}
              style={{ aspectRatio: flower.aspect }}
            />
          </span>
          <span className="flower-picker__name">{flower.name}</span>
        </button>
      ))}
    </div>
  )
}

export default FlowerPicker
