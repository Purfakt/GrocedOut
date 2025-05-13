import { getCollection, createDocument, updateDocument, deleteDocument } from '@/services/firebase.js'
import { createContext, useContext } from 'react'
import { useMutation, useMutationState, useQuery } from '@tanstack/react-query'
import { queryClient } from '@/services/tanstackQuery.jsx'

/*
 * Store
 */
/* eslint-disable react-hooks/rules-of-hooks */
export function createIngredientCategoryStore() {
    const listQuery = useQuery({
        queryKey: ['ingredientCategoryList'],
        queryFn: async () => getCollection('ingredientCategories'),
    })

    const createMutation = useMutation({
        mutationKey: ['ingredientCategoryCreate'],
        mutationFn: async (vars) => createDocument('ingredientCategories', vars.payload),
        onSuccess: async () => queryClient.invalidateQueries({ queryKey: ['ingredientCategoryList'] }),
    })

    const updateMutation = useMutation({
        mutationKey: ['ingredientCategoryUpdate'],
        mutationFn: async (vars) => updateDocument('ingredientCategories', vars.id, vars.payload),
        onSuccess: async () => queryClient.invalidateQueries({ queryKey: ['ingredientCategoryList'] }),
    })
    const updateMutationVars = useMutationState({
        filters: { mutationKey: ['ingredientCategoryUpdate'] },
        select: (mutationState) => mutationState.state.variables
    })

    const deleteMutation = useMutation({
        mutationKey: ['ingredientCategoryDelete'],
        mutationFn: async (vars) => deleteDocument('ingredientCategories', vars.id),
        onSuccess: async () => queryClient.invalidateQueries({ queryKey: ['ingredientCategoryList'] }),
    })

    const getById = (id) => listQuery.data?.find(ingredientCategory => ingredientCategory.id === id) || null

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
const IngredientCategoryStoreContext = createContext(null)
export function useIngredientCategoryStore() {
    return useContext(IngredientCategoryStoreContext)
}

/*
 * Provider
 */
export function IngredientCategoryStoreProvider({ children }) {
    const store = createIngredientCategoryStore()

    return (
        <IngredientCategoryStoreContext.Provider value={store}>
            {children}
        </IngredientCategoryStoreContext.Provider>
    )
}