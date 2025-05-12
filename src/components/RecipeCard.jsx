import { UiIcon } from '@lib/components/UiIcon.jsx'
import { useDependentState } from '@/core/useDependentState.jsx'

export function RecipeCard({
    title = 'Recipe Title',
    description = 'This is a short description of the recipe. It gives an overview of the ingredients and cooking method.',
    quantity = 0,
    image = 'https://picsum.photos/600/300?t=' + Math.random(),
    onClick = () => { },
    onSetQuantity = (quantity) => { },
}) {
    const [localQuantity, setLocalQuantity] = useDependentState(parseInt(quantity.toString()) || 0, [quantity])

    return (
        <div className="card bg-base-100 card-border border-base-300 card-sm" onClick={onClick}>
            {image && (
                <figure>
                    <img
                        className="w-full h-48 object-cover"
                        src={image}
                        alt="Recipe" />
                </figure>
            )}
            <div className="card-body">
                <h2 className="card-title">{title}</h2>
                <p className="text-sm">{description}</p>
                <div className="card-actions">
                    <div className="grow flex items-stretch gap-4 cursor-default" onClick={(e) => { e.stopPropagation(); e.preventDefault() }}>
                        <button className="btn btn-circle btn-error text-2xl" onClick={() => onSetQuantity(quantity - 1)}>
                            <UiIcon icon="remove" />
                        </button>
                        <div className="grow">
                            <input
                                type="number"
                                className="input w-full text-center font-bold"
                                value={localQuantity.toString()}
                                onChange={(e) => setLocalQuantity(parseInt(e.target.value) || 0)}
                                onBlur={(e) => {
                                    const newQuantity = parseInt(e.target.value) || 0
                                    setLocalQuantity(newQuantity)
                                    onSetQuantity(newQuantity)
                                }}
                            />
                        </div>
                        <button className="btn btn-circle btn-success text-2xl" onClick={() => onSetQuantity(quantity + 1)}>
                            <UiIcon icon="add" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}