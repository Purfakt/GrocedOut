import { AuthStoreProvider } from '@/stores/auth.store.jsx'
import { RecipeStoreProvider } from '@/stores/recipe.store.jsx'
import { GroceryItemStoreProvider } from '@/stores/groceryItem.store.jsx'
import { ItemCategoryStoreProvider } from '@/stores/itemCategory.store.jsx'

export const StoreProviders = [
    AuthStoreProvider,
    RecipeStoreProvider,
    GroceryItemStoreProvider,
    ItemCategoryStoreProvider,
]

export function StoreProvider({ children }) {
    return StoreProviders.reduceRight((acc, Provider) => <Provider>{acc}</Provider>, children)
}