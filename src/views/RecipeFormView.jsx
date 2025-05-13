import { Navbar } from '@/components/Navbar.jsx'
import { useNavigate, useParams } from '@tanstack/react-router'
import { useRecipeStore } from '@/stores/recipe.store.jsx'
import { useStateWithDeps } from '@/utils/useStateWithDeps.jsx'
import { useState } from 'react'

export function RecipeFormView() {
    const navigate = useNavigate()
    const recipeStore = useRecipeStore()

    const { id: recipeId } = useParams({ strict: false })
    /*
     * isUpdate and updatedRecipe could be simple derived values, but using useState avoids the form from blinking when navigating to the update page.
     */
    const [isUpdate, setIsUpdate] = useState(!!recipeId)
    const [updatedRecipe, setUpdatedRecipe] = useStateWithDeps(isUpdate ? recipeStore.getById(recipeId) : null, [recipeStore.listQuery.data])

    const [localName, setLocalName] = useStateWithDeps(updatedRecipe?.name || '', [updatedRecipe?.name])
    const [localDescription, setLocalDescription] = useStateWithDeps(updatedRecipe?.description || '', [updatedRecipe?.description])

    const onBlur = () => {
        if (recipeStore.createMutation.isPending) return
        if (isUpdate) {
            recipeStore.updateMutation.mutate({ id: recipeId, payload: { name: localName, description: localDescription } })
        } else {
            recipeStore.createMutation.mutateAsync({ payload: { name: localName, description: localDescription } })
                .then((createdRecipe) => {
                    /*
                     * Setting isUpdate and updatedRecipe before navigation to avoid the form blinking when navigating to the update page.
                     */
                    setIsUpdate(true)
                    setUpdatedRecipe(createdRecipe)
                    return navigate({
                        to: '/recipe/$id/update',
                        params: { id: createdRecipe.id },
                        replace: true,
                    })
                })
        }
    }

    return <>
        <Navbar title="Make a recipe" backlink="/" />

        {isUpdate && !updatedRecipe
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