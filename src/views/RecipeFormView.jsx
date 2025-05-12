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
        if (isEditMode) {
            recipeStore.updateMutation.call(recipeId, { name: localName, description: localDescription })
                .then(() => recipeStore.listQuery.call())
        } else {
            recipeStore.createMutation.call({ name: localName, description: localDescription })
                .then(() => recipeStore.listQuery.call())
                .then((id) => navigate({ to: `/recipe/${id}/edit` }))
        }
    }

    return <>
        <Navbar title={recipeId ? 'Edit Recipe' : 'Create Recipe'} backlink="/" />

        {isEditMode && !editedRecipe
            ?
            <div className="container mx-auto p-4">Recipe not found</div>
            :
            <div className="container mx-auto p-4">
                <div className="flex flex-col gap-4">
                    <div>
                        <input
                            type="text"
                            placeholder="Name"
                            className="input input-lg w-full mb-2"
                            value={localName}
                            onChange={(e) => setLocalName(e.target.value)}
                            onBlur={onBlur}
                        />
                    </div>
                    <div>
                        <textarea
                            placeholder="Description"
                            className="textarea textarea-lg w-full"
                            value={localDescription}
                            onChange={(e) => setLocalDescription(e.target.value)}
                            onBlur={onBlur}
                        ></textarea>
                    </div>
                </div>
            </div>
        }
    </>
}