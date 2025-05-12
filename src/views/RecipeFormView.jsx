import { Navbar } from '@/components/Navbar.jsx'
import { useNavigate, useParams } from '@tanstack/react-router'
import { useRecipeStore } from '@/stores/recipe.store.jsx'
import { useDependentState } from '@/core/useDependentState.jsx'

export function RecipeFormView() {
    const navigate = useNavigate()
    const recipeStore = useRecipeStore()

    const { id: recipeId } = useParams({ strict: false })
    const isEditMode = !!recipeId
    const editedRecipe = isEditMode ? recipeStore.getById(recipeId) : null

    const [localName, setLocalName] = useDependentState(editedRecipe?.name || '', [editedRecipe?.name])
    const [localDescription, setLocalDescription] = useDependentState(editedRecipe?.description || '', [editedRecipe?.description])

    const onBlur = () => {
        if (recipeStore.createMutation.isLoading) return
        if (isEditMode) {
            recipeStore.updateMutation.call(recipeId, { name: localName, description: localDescription })
                .then(() => recipeStore.listQuery.call())
        } else {
            recipeStore.createMutation.call({ name: localName, description: localDescription })
                .then(() => recipeStore.listQuery.call())
                .then(() => navigate({ to: `/recipe/${recipeStore.createMutation.data}/edit` }))
        }
    }

    return <>
        <Navbar title="Make a recipe" backlink="/" />

        {isEditMode && !editedRecipe
            ?
            <div className="container mx-auto p-4">Recipe not found</div>
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