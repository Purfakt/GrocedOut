import { RecipeCard } from '@/components/RecipeCard.jsx'
import { Link } from '@tanstack/react-router'
import { UiIcon } from '@lib/components/UiIcon.jsx'
import { QuickActions } from '@/components/QuickActions.jsx'
import { QuickActionButton } from '@/components/QuickActionButton.jsx'
import { useRecipeStore } from '@/stores/recipe.store.jsx'
import { Navbar } from '@/components/Navbar.jsx'

export function RecipeListView() {
    const recipeStore = useRecipeStore()

    const onSetQuantity = async (recipe, quantity) => {
        if (quantity < 0 || recipe.quantity === quantity) return
        return recipeStore.updateMutation.mutateAsync({ id: recipe.id, payload: { quantity } })
    }

    return <>
        <Navbar />

        {recipeStore.listQuery.isLoading
            ?
            <div className="container mx-auto p-4 text-center">
                <span className="loading loading-spinner loading-xl"></span>
            </div>
            :
            <>
                <div className="container mx-auto p-4">
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {recipeStore.listQuery.data?.length === 0
                            ?
                            <p>No recipes found. Add your first recipe!</p>
                            :
                            recipeStore.listQuery.data?.map(recipe => (
                                <div key={recipe.id}>
                                    <Link to={`/recipe/${recipe.id}`}>
                                        <RecipeCard
                                            className="h-full"
                                            title={recipe.name}
                                            description={recipe.description}
                                            quantity={recipe.quantity}
                                            loading={recipeStore.updateMutation.isPending && recipeStore.updateMutationVars?.[0]?.id === recipe.id}
                                            onSetQuantity={(quantity) => onSetQuantity(recipe, quantity)}
                                        />
                                    </Link>
                                </div>
                            ))
                        }
                    </div>
                </div>
                <QuickActions>
                    <Link to="/recipe/create">
                        <QuickActionButton>
                            <UiIcon icon="add" size="2xl" />
                        </QuickActionButton>
                    </Link>
                </QuickActions>
            </>
        }
    </>
}