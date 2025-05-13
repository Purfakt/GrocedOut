import { useNavigate } from '@tanstack/react-router'
import { useRecipeStore } from '@/stores/recipe.store.jsx'
import { useStateWithDeps } from '@/utils/useStateWithDeps.jsx'

export function RecipeFormView({ recipe }) {
    const navigate = useNavigate()
    const recipeStore = useRecipeStore()
    const isUpdate = recipe !== undefined

    const [localName, setLocalName] = useStateWithDeps(recipe?.name || '', [recipe])
    const [localDescription, setLocalDescription] = useStateWithDeps(recipe?.description || '', [recipe])

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
                            Create a recipe to share with your friends. You can add ingredients, steps, and more.
                        </p>
                        <fieldset className="fieldset py-0">
                            <legend className="fieldset-legend">Name</legend>
                            <input
                                type="text"
                                className="input input-lg w-full mb-2"
                                value={localName.toString()}
                                onChange={(e) => setLocalName(e.target.value)}
                                onBlur={onBlur}
                            />
                        </fieldset>
                        <fieldset className="fieldset py-0">
                            <legend className="fieldset-legend">Description</legend>
                            <textarea
                                className="textarea textarea-lg w-full resize-none"
                                value={localDescription.toString()}
                                onChange={(e) => setLocalDescription(e.target.value)}
                                onBlur={onBlur}
                            ></textarea>
                        </fieldset>
                    </div>
                </div>
            </div>
        }
    </>
}