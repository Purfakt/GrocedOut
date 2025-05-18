import { getCollection, createDocument, updateDocument, deleteDocument } from '@/services/firebase.js'
import { createContext, useContext } from 'react'
import { useMutation, useMutationState, useQuery } from '@tanstack/react-query'
import { queryClient } from '@/services/tanstackQuery.jsx'
import { sanitizeUndefinedRecursive } from '@/utils/object.js'

/*
 * Mapping
 */
export const ingredientMapper = (ingredient, partial = false) => {
    const mappedIngredient = {
        name: ingredient.name ?? (partial ? undefined : ''),
        priority: ingredient.priority ?? (partial ? undefined : 0),
        category: ingredient.category ?? (partial ? undefined : null),
    }
    if (ingredient.category) {
        mappedIngredient.category = {
            id: ingredient.category.id,
            name: ingredient.category.name ?? (partial ? undefined : ''),
            priority: ingredient.category.priority ?? (partial ? undefined : 0),
        }
    }
    return sanitizeUndefinedRecursive(mappedIngredient)
}

/*
 * Store
 */
/* eslint-disable react-hooks/rules-of-hooks */
export function createIngredientStore() {
    const listQuery = useQuery({
        queryKey: ['ingredientList'],
        queryFn: async () => getCollection('ingredients'),
    })

    const createMutation = useMutation({
        mutationKey: ['ingredientCreate'],
        mutationFn: async (vars) => createDocument('ingredients', ingredientMapper(vars.payload)),
        onSuccess: async () => queryClient.invalidateQueries({ queryKey: ['ingredientList'] }),
    })

    const updateMutation = useMutation({
        mutationKey: ['ingredientUpdate'],
        mutationFn: async (vars) => updateDocument('ingredients', vars.id, ingredientMapper(vars.payload, true)),
        onSuccess: async () => queryClient.invalidateQueries({ queryKey: ['ingredientList'] }),
    })
    const updateMutationVars = useMutationState({
        filters: { mutationKey: ['ingredientUpdate'] },
        select: (mutationState) => mutationState.state.variables
    })

    const deleteMutation = useMutation({
        mutationKey: ['ingredientDelete'],
        mutationFn: async (vars) => deleteDocument('ingredients', vars.id),
        onSuccess: async () => queryClient.invalidateQueries({ queryKey: ['ingredientList'] }),
    })

    const getById = (id) => listQuery.data?.find(ingredient => ingredient.id === id) || null

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
const IngredientStoreContext = createContext(null)
export function useIngredientStore() {
    return useContext(IngredientStoreContext)
}

/*
 * Provider
 */
export function IngredientStoreProvider({ children }) {
    const store = createIngredientStore()

    return (
        <IngredientStoreContext.Provider value={store}>
            {children}
        </IngredientStoreContext.Provider>
    )
}