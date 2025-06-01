import { getCollection, createDocument, updateDocument, deleteDocument, updateCollectionWhere } from '@/services/firebase.js'
import { createContext, useContext } from 'react'
import { useMutation, useMutationState, useQuery } from '@tanstack/react-query'
import { queryClient } from '@/services/tanstackQuery.jsx'
import { sanitizeUndefinedRecursive } from '@/utils/object.js'

const RECORD_NAME = 'itemCategory'
const COLLECTION_NAME = 'itemCategories'

/*
 * Mapping
 */
export const itemCategoryMapper = (category, partial = false) => sanitizeUndefinedRecursive({
    name: category.name ?? (partial ? undefined : ''),
    priority: category.priority ?? (partial ? undefined : 0),
})

/*
 * Store
 */
/* eslint-disable react-hooks/rules-of-hooks */
export function createItemCategoryStore() {
    const listQuery = useQuery({
        queryKey: [RECORD_NAME + 'List'],
        queryFn: async () => getCollection(COLLECTION_NAME),
    })

    const createMutation = useMutation({
        mutationKey: [RECORD_NAME + 'Create'],
        mutationFn: async (vars) => createDocument(COLLECTION_NAME, itemCategoryMapper(vars.payload)),
        onSuccess: async () => queryClient.invalidateQueries({ queryKey: [RECORD_NAME + 'List'] }),
    })

    const updateMutation = useMutation({
        mutationKey: [RECORD_NAME + 'Update'],
        mutationFn: async (vars) => Promise.all([
            updateDocument(COLLECTION_NAME, vars.id, itemCategoryMapper(vars.payload, true)),
            updateCollectionWhere('groceryItems', ['category.id', '==', vars.id], {
                category: {
                    name: vars.payload.name,
                    priority: vars.payload.priority,
                },
            }),
        ]),
        onSuccess: async () => Promise.all([
            queryClient.invalidateQueries({ queryKey: [RECORD_NAME + 'List'] }),
            queryClient.invalidateQueries({ queryKey: ['groceryItemList'] }),
        ]),
    })
    const updateMutationVars = useMutationState({
        filters: { mutationKey: [RECORD_NAME + 'Update'] },
        select: (mutationState) => mutationState.state.variables
    })

    const deleteMutation = useMutation({
        mutationKey: [RECORD_NAME + 'Delete'],
        mutationFn: async (vars) => Promise.all([
            deleteDocument(COLLECTION_NAME, vars.id),
            updateCollectionWhere('groceryItems', ['category.id', '==', vars.id], {
                category: null,
            })
        ]),
        onSuccess: async () => Promise.all([
            queryClient.invalidateQueries({ queryKey: [RECORD_NAME + 'List'] }),
            queryClient.invalidateQueries({ queryKey: ['groceryItemList'] }),
        ]),
    })

    const getById = (id) => listQuery.data?.find(category => category.id === id) || null

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
const ItemCategoryStoreContext = createContext(null)
export function useItemCategoryStore() {
    return useContext(ItemCategoryStoreContext)
}

/*
 * Provider
 */
export function ItemCategoryStoreProvider({ children }) {
    const store = createItemCategoryStore()

    return (
        <ItemCategoryStoreContext.Provider value={store}>
            {children}
        </ItemCategoryStoreContext.Provider>
    )
}