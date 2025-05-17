import { useNavigate } from '@tanstack/react-router'
import { useRecipeStore } from '@/stores/recipe.store.jsx'
import { useIngredientStore } from '@/stores/ingredient.store.jsx'
import { useStateWithDeps } from '@/utils/useStateWithDeps.jsx'
import { UiIcon } from '@lib/components/UiIcon.jsx'
import { useState } from 'react'

export function RecipeFormView({ recipe }) {
    const navigate = useNavigate()
    const recipeStore = useRecipeStore()
    const ingredientStore = useIngredientStore()

    const isUpdate = recipe !== undefined

    const [localName, setLocalName] = useStateWithDeps(recipe?.name || '', [recipe])
    const [localDescription, setLocalDescription] = useStateWithDeps(recipe?.description || '', [recipe])

    const [localIngredients, setLocalIngredients] = useState([])
    const [localIngredientSearch, setLocalIngredientSearch] = useState('')
    const availableIngredients = ingredientStore.listQuery.data
        ?.filter(ingredient => ingredient.name.toLowerCase().includes(localIngredientSearch.toLowerCase()))
        ?.filter(ingredient => !localIngredients.some(i => i.id === ingredient.id))

    const onBlur = () => {
        if (recipeStore.createMutation.isPending) return
        if (isUpdate) {
            recipeStore.updateMutation.mutate({ id: recipe.id, payload: { name: localName, description: localDescription } })
        } else {
            recipeStore.createMutation.mutateAsync({ payload: { name: localName, description: localDescription } })
                .then(async (createdRecipe) => {
                    // If we navigate immediately, the "update" route component function execution happens in the same render loop,
                    // the mutation is done and the listQuery is invalidated, but the new listQuery.data state is not yet available.
                    // It causes the recipe to be null in the "update" route component function for one frame, and the UI to flash "Recipe not found".
                    await new Promise(resolve => setTimeout(resolve))
                    return navigate({
                        to: '/recipe/$id/update',
                        params: { id: createdRecipe.id },
                        replace: true,
                    })
                })
        }
    }

    return <>
        {isUpdate && recipe === null
            ?
            <>
                {recipeStore.listQuery.isLoading
                    ?
                    <div className="container mx-auto p-4 text-center">
                        <span className="loading loading-spinner loading-xl"></span>
                    </div>
                    :
                    <div className="container mx-auto p-4">Recipe not found</div>
                }
            </>
            :
            <div className="container mx-auto p-4">
                <div className="lg:px-[20%]">
                    <div className="flex flex-col gap-4">
                        <h1 className="hidden lg:block text-2xl font-bold">Make a recipe</h1>
                        <p>
                            Create a recipe to share with your friends. You can add a name, description and ingredients.
                        </p>
                        <fieldset className="fieldset py-0">
                            <legend className="fieldset-legend pt-0">Name</legend>
                            <input
                                type="text"
                                className="input input-lg w-full mb-2"
                                value={localName.toString()}
                                onChange={(e) => setLocalName(e.target.value)}
                                onBlur={onBlur}
                            />
                        </fieldset>
                        <fieldset className="fieldset py-0">
                            <legend className="fieldset-legend pt-0">Description</legend>
                            <textarea
                                className="textarea textarea-lg w-full resize-none"
                                value={localDescription.toString()}
                                onChange={(e) => setLocalDescription(e.target.value)}
                                onBlur={onBlur}
                            ></textarea>
                        </fieldset>

                        <h2 className="hidden lg:flex text-xl font-bold mt-4 items-center">
                            <UiIcon icon="grocery" className="mr-2" size="xl" />
                            Ingredients
                        </h2>
                        <div className="dropdown">
                            <label className="input input-lg w-full" tabIndex={0}>
                                <UiIcon icon="search" className="mr-2" size="xl" />
                                <input type="search" placeholder="Search and add ingredients" value={localIngredientSearch} onChange={(e) => setLocalIngredientSearch(e.target.value)} />
                            </label>
                            <ul tabIndex={0} className="dropdown-content menu bg-base-100 rounded-box z-1 w-full p-2 shadow-xl">
                                {ingredientStore.listQuery.isLoading
                                    ?
                                    <li className="loading loading-spinner loading-lg"></li>
                                    :
                                    availableIngredients.length === 0
                                        ?
                                        <li className="text-center">No ingredients found</li>
                                        :
                                        availableIngredients.map(ingredient => (
                                            <li key={ingredient.id}>
                                                <a onClick={() => {
                                                    setLocalIngredients([...localIngredients, {
                                                        ...ingredient,
                                                        quantity: 1
                                                    }])
                                                    setLocalIngredientSearch('')
                                                }}>
                                                    {ingredient.name}
                                                </a>
                                            </li>
                                        ))
                                }
                            </ul>
                        </div>
                        {localIngredients.length === 0
                            ?
                            <div className="text-center text-sm text-gray-500">
                                No ingredients added yet.
                            </div>
                            :
                            <div className="grid grid-cols-2 gap-2">
                                {localIngredients.map(ingredient => (
                                    <div className="card card-sm bg-base-100 shadow-sm">
                                        <div className="card-body">
                                            <div className="flex items-center">
                                                <div className="flex-1">
                                                    <span className="text-sm">{ingredient.name}</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <button className="btn btn-sm btn-circle btn-error text-2xl" onClick={() => {
                                                        setLocalIngredients(
                                                            localIngredients
                                                                .map(i => i.id === ingredient.id ? {
                                                                    ...i,
                                                                    quantity: i.quantity - 1
                                                                } : i)
                                                                .filter(i => i.quantity > 0)
                                                        )
                                                    }}>
                                                        <UiIcon icon={ingredient.quantity > 1 ? 'remove' : 'delete'} />
                                                    </button>
                                                    <input
                                                        type="number"
                                                        className="input w-18 text-center font-bold"
                                                        value={ingredient.quantity.toString()}
                                                        onChange={(e) => {
                                                            setLocalIngredients(
                                                                localIngredients
                                                                    .map(i => i.id === ingredient.id ? {
                                                                        ...i,
                                                                        quantity: parseInt(e.target.value) || 1
                                                                    } : i)
                                                                    .filter(i => i.quantity > 0)
                                                            )
                                                        }}
                                                    />
                                                    <button className="btn btn-sm btn-circle btn-success text-2xl" onClick={() => {
                                                        setLocalIngredients(localIngredients.map(i => i.id === ingredient.id ? {
                                                            ...i,
                                                            quantity: i.quantity + 1
                                                        } : i))
                                                    }}>
                                                        <UiIcon icon="add" />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        }
                    </div>
                </div>
            </div>
        }
    </>
}