import { useQuery } from '@/core/useQuery.jsx'
import { getCollection, createDocument, updateDocument, deleteDocument } from '@/services/firebase.js'
import { createContext, useContext } from 'react'

/*
 * Store
 */
function createRecipeStore() {
    /* eslint-disable react-hooks/rules-of-hooks */
    const listQuery = useQuery(async () => getCollection('recipes'))
    const createMutation = useQuery(async (data) => createDocument('recipes', data))
    const updateMutation = useQuery(async (id, data) => updateDocument('recipes', id, data))
    const deleteMutation = useQuery(async (id) => deleteDocument('recipes', id))

    const getById = (id) => listQuery.data.find(recipe => recipe.id === id)

    return { listQuery, createMutation, updateMutation, deleteMutation, getById }
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
    store.listQuery.callOnce()

    return (
        <RecipeStoreContext.Provider value={store}>
            {children}
        </RecipeStoreContext.Provider>
    )
}