import { useRequest } from '@/core/useQuery.jsx'
import { getCollection } from '@/services/firebase.js'
import { createContext, useContext } from 'react'

/*
 * Store
 */
function createRecipeStore() {
    const listRequest = useRequest(async () => getCollection('recipes')
        .then(collection => collection.map(doc => ({ id: doc.id, ...doc.data() }))))

    return { listRequest }
}

/*
 * Context
 */
const RecipeStoreContext = createContext(null)

export function useRecipeStore() {
    return useContext(RecipeStoreContext)
}

/*
 * Provider
 */
export function RecipeStoreProvider({ children }) {
    const store = createRecipeStore()

    return (
        <RecipeStoreContext.Provider value={store}>
            {children}
        </RecipeStoreContext.Provider>
    )
}