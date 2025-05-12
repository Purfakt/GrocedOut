import { RecipeCard } from '@/components/RecipeCard.jsx'
import { Link } from '@tanstack/react-router'
import { UiIcon } from '@lib/components/UiIcon.jsx'
import { QuickActions } from '@/components/QuickActions.jsx'
import { QuickActionButton } from '@/components/QuickActionButton.jsx'
import { useRecipeStore } from '@/stores/recipe.store.jsx'
import { Navbar } from '@/components/Navbar.jsx'

export function RecipeListView() {
    const recipeStore = useRecipeStore()

    const onSetQuantity = (recipe, quantity) => {
        if (quantity < 0 || recipe.quantity === quantity) return
        recipeStore.update(recipe.id, { quantity })
            .then(() => recipeStore.listRequest.call())
    }

    return <>
        <Navbar />

        {recipeStore.listRequest.isLoading &&
            <div className="container mx-auto p-4 text-center">
                <span className="loading loading-spinner loading-xl"></span>
            </div>
        }

        <div className="container mx-auto p-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {recipeStore.listRequest.data.length === 0
                    ? <p>No recipes found. Add your first recipe!</p>
                    : recipeStore.listRequest.data.map(recipe => (
                        <div key={recipe.id}>
                            <Link to={`/recipe/${recipe.id}`}>
                                <RecipeCard
                                    title={recipe.name}
                                    description={recipe.description}
                                    quantity={recipe.quantity}
                                    onSetQuantity={(quantity) => onSetQuantity(recipe, quantity)}
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