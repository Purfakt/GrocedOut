import { RecipeCard } from '@/components/RecipeCard.jsx'
import { Link } from '@tanstack/react-router'
import { UiIcon } from '@lib/components/UiIcon.jsx'
import { QuickActions } from '@/components/QuickActions.jsx'
import { QuickActionButton } from '@/components/QuickActionButton.jsx'
import { useEffect } from 'react'
import { useRecipeStore } from '@/stores/recipe.store.jsx'

export function RecipeListView() {
    const recipeStore = useRecipeStore()
    useEffect(() => {
        recipeStore.listRequest.callOnce()
    }, [])

    if (recipeStore.listRequest.isLoading)
        return <div className="container mx-auto p-4 text-center">Loading recipes...</div>
    if (recipeStore.listRequest.isError)
        return <div className="container mx-auto p-4 text-center text-error">{recipeStore.listRequest.error}</div>

    return <>
        <div className="container mx-auto p-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                {recipeStore.listRequest.data.length === 0
                    ? <p>No recipes found. Add your first recipe!</p>
                    : recipeStore.listRequest.data.map(recipe => (
                        <div key={recipe.id}>
                            <Link to={`/recipe/${recipe.id}`}>
                                <RecipeCard
                                    title={recipe.name}
                                    description={recipe.description}
                                />
                            </Link>
                        </div>
                    ))
                }
            </div>
        </div>
        <QuickActions>
            <Link to="/recipe/new">
                <QuickActionButton>
                    <UiIcon icon="add" size="2xl" />
                </QuickActionButton>
            </Link>
        </QuickActions>
    </>
}