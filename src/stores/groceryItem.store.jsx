import { getCollection, createDocument, updateDocument, deleteDocument } from '@/services/firebase.js'
import { createContext, useContext } from 'react'
import { useMutation, useMutationState, useQuery } from '@tanstack/react-query'
import { queryClient } from '@/services/tanstackQuery.jsx'
import { sanitizeUndefinedRecursive } from '@/utils/object.js'

const RECORD_NAME = 'groceryItem'
const COLLECTION_NAME = RECORD_NAME + 's'

/*
 * Mapping
 */
export const groceryItemMapper = (item, partial = false) => {
    const mappedItem = {
        name: item.name,
        priority: item.priority,
        category: item.category,
        isIngredient: item.isIngredient,
        quantity: item.quantity,
        isChecked: item.isChecked,
    }

    if (!partial) {
        mappedItem.name = item.name ?? ''
        mappedItem.isIngredient = item.isIngredient ?? false
        mappedItem.isChecked = item.isChecked ?? false
        mappedItem.priority = item.priority ?? (mappedItem.isIngredient ? 0 : 100)
        mappedItem.category = item.category ?? null

        if (!mappedItem.isIngredient) {
            mappedItem.quantity = item.quantity ?? 1
        }
       
    }

   
    if (mappedItem.category && typeof mappedItem.category === 'object' && mappedItem.category.id) {
        mappedItem.category = {
            id: mappedItem.category.id,
            name: mappedItem.category.name ?? (partial && !item.category?.name ? undefined : ''),
            priority: mappedItem.category.priority ?? (partial && item.category?.priority === undefined ? undefined : 0),
        }
    } else if (Object.prototype.hasOwnProperty.call(item, 'category') && item.category === null) {
        mappedItem.category = null
    }
    return sanitizeUndefinedRecursive(mappedItem)
}

/*
 * Store
 */
/* eslint-disable react-hooks/rules-of-hooks */
export function createGroceryItemStore() {
    const listQuery = useQuery({
        queryKey: [RECORD_NAME + 'List'],
        queryFn: async () => getCollection(COLLECTION_NAME),
    })

    const createMutation = useMutation({
        mutationKey: [RECORD_NAME + 'Create'],
        mutationFn: async (vars) => createDocument(COLLECTION_NAME, groceryItemMapper(vars.payload)),
        onSuccess: async () => queryClient.invalidateQueries({ queryKey: [COLLECTION_NAME+'List'] }),
    })

    const updateMutation = useMutation({
        mutationKey: [RECORD_NAME + 'Update'],
        mutationFn: async (vars) => updateDocument(COLLECTION_NAME, vars.id, groceryItemMapper(vars.payload, true)),
        onSuccess: async () => queryClient.invalidateQueries({ queryKey: [COLLECTION_NAME+'List'] }),
    })
    const updateMutationVars = useMutationState({
        filters: { mutationKey: [RECORD_NAME + 'Update'] },
        select: (mutationState) => mutationState.state.variables
    })

    const deleteMutation = useMutation({
        mutationKey: [COLLECTION_NAME+'Delete'],
        mutationFn: async (vars) => deleteDocument(COLLECTION_NAME, vars.id),
        onSuccess: async () => queryClient.invalidateQueries({ queryKey: [COLLECTION_NAME+'List'] }),
    })

    const getById = (id) => listQuery.data?.find(groceryItem => groceryItem.id === id) || null

    return {
        listQuery,
        createMutation,
        updateMutation,
        updateMutationVars,
        deleteMutation,
        getById
    }
}

/*
 * Context
 */
const GroceryItemStoreContext = createContext(null)
export function useGroceryItemStore() {
    return useContext(GroceryItemStoreContext)
}

/*
 * Provider
 */
export function GroceryItemStoreProvider({ children }) {
    const store = createGroceryItemStore()

    return (
        <GroceryItemStoreContext.Provider value={store}>
            {children}
        </GroceryItemStoreContext.Provider>
    )
}