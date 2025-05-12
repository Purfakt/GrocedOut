import { Link, useNavigate, useParams } from '@tanstack/react-router'
import { UiIcon } from '@lib/components/UiIcon.jsx'
import { QuickActions } from '@/components/QuickActions.jsx'
import { QuickActionButton } from '@/components/QuickActionButton.jsx'
import { Navbar } from '@/components/Navbar.jsx'
import { useRecipeStore } from '@/stores/recipe.store.jsx'
import { useState } from 'react'

export function RecipeShowView() {
    const navigate = useNavigate()
    const recipeStore = useRecipeStore()

    const { id: recipeId } = useParams({ strict: false })
    const recipe = recipeStore.getById(recipeId)

    const [isDeleteLoading, setIsDeleteLoading] = useState(false)
    const onDelete = async () => {
        if (isDeleteLoading) return
        setIsDeleteLoading(true)
        await recipeStore.deleteMutation.call(recipeId)
        await recipeStore.listQuery.call()
        setIsDeleteLoading(false)
        return navigate({ to: '/' })
    }

    return <>
        <Navbar title={recipe?.name} backlink="/" />

        {!recipe
            ? (
                <div className="container mx-auto p-4">Recipe not found</div>
            )
            : (
                <>
                    <div className="container mx-auto p-4">
                        <h1 className="hidden lg:block font-bold text-3xl mb-4">{recipe.name}</h1>
                        <div className="grid grid-cols-1 gap-4 grid-cols-4">
                            <div className="col-span-4 lg:col-span-2">
                                <img src="https://picsum.photos/500/200" alt="Recipe" className="w-full h-auto rounded-xl shadow-lg" />
                            </div>
                            <div className="col-span-4 lg:col-span-2">
                                <p>
                                    {recipe.description}
                                </p>
                            </div>
                        </div>
                    </div>

                    <QuickActions>
                        <Link to={`/recipe/${recipe.id}/edit`}>
                            <QuickActionButton>
                                <UiIcon icon="edit" size="2xl" />
                            </QuickActionButton>
                        </Link>
                        <QuickActionButton variant="error" onClick={() => document.getElementById('modal-recipe-delete').showModal()}>
                            <UiIcon icon="delete" size="2xl" />
                        </QuickActionButton>
                    </QuickActions>

                    <dialog id="modal-recipe-delete" className="modal">
                        <div className="modal-box">
                            <h3 className="text-lg font-bold">Delete recipe {recipe.name}</h3>
                            <p className="py-4">Are you sure you want to delete this recipe?</p>
                            <div className="modal-action">
                                <form method="dialog">
                                    <button className="btn">No, cancel</button>
                                </form>
                                <button className="btn btn-error" onClick={onDelete}>
                                    {isDeleteLoading
                                        ? <span className="loading loading-spinner loading-sm"></span>
                                        : 'Yes, delete!'}
                                </button>
                            </div>
                        </div>
                        <form method="dialog" className="modal-backdrop">
                            <button>close</button>
                        </form>
                    </dialog>
                </>
            )
        }
    </>
}