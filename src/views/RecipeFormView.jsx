import { Navbar } from '@/components/Navbar.jsx'
import { useNavigate, useParams } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { useRecipeStore } from '@/stores/recipe.store.jsx'

export function RecipeFormView() {
    const navigate = useNavigate()
    const recipeStore = useRecipeStore()

    const { id: recipeId } = useParams({ strict: false })
    const isEditMode = !!recipeId
    const editedRecipe = isEditMode ? recipeStore.getById(recipeId) : null

    const [localName, setLocalName] = useState(editedRecipe?.name || '')
    const [localDescription, setLocalDescription] = useState(editedRecipe?.description || '')
    useEffect(() => {
        setLocalName(editedRecipe?.name || '')
        setLocalDescription(editedRecipe?.description || '')
    }, [editedRecipe])

    const onBlur = () => {
        if (isEditMode) {
            recipeStore.update(recipeId, { name: localName, description: localDescription })
                .then(() => recipeStore.listRequest.call())
        } else {
            recipeStore.create({ name: localName, description: localDescription })
                .then(() => recipeStore.listRequest.call())
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