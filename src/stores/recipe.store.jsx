import { useRequest } from '@/core/useQuery.jsx'
import { getCollection, createDocument, updateDocument, deleteDocument } from '@/services/firebase.js'
import { createContext, useContext } from 'react'

/*
 * Store
 */
function createRecipeStore() {
    /* eslint-disable react-hooks/rules-of-hooks */
    const listRequest = useRequest(async () => getCollection('recipes'))

    const getById = (id) => listRequest.data.find(recipe => recipe.id === id)
    const create = (data) => createDocument('recipes', data)
    const update = (id, data) => updateDocument('recipes', id, data)
    const remove = (id) => deleteDocument('recipes', id)

    return { listRequest, getById, create, update, remove }
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
    store.listRequest.callOnce()

    return (
        <RecipeStoreContext.Provider value={store}>
            {children}
        </RecipeStoreContext.Provider>
    )
}