import { AuthStoreProvider } from '@/stores/auth.store.jsx'
import { RecipeStoreProvider } from '@/stores/recipe.store.jsx'
import { IngredientStoreProvider } from '@/stores/ingredient.store.jsx'
import { IngredientCategoryStoreProvider } from '@/stores/ingredientCategory.store.jsx'

export const StoreProviders = [
    AuthStoreProvider,
    RecipeStoreProvider,
    IngredientStoreProvider,
    IngredientCategoryStoreProvider,
]

export function StoreProvider({ children }) {
    return StoreProviders.reduceRight((acc, Provider) => <Provider>{acc}</Provider>, children)
}