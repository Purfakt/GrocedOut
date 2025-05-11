import { UiIcon } from '@lib/components/UiIcon.jsx'

export function RecipeCard({
    title = 'Recipe Title',
    description = 'This is a short description of the recipe. It gives an overview of the ingredients and cooking method.',
    image = 'https://picsum.photos/600/300?t=' + Math.random(),
    onClick = () => { },
}) {
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
                    <div className="grow flex items-stretch gap-4">
                        <button className="btn btn-circle btn-error text-2xl">
                            <UiIcon icon="remove" />
                        </button>
                        <div className="grow flex justify-center items-center bg-base-200 rounded-lg text-center text-base font-bold">
                            1
                        </div>
                        <button className="btn btn-circle btn-success text-2xl">
                            <UiIcon icon="add" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}