import { getCollection, createDocument, updateDocument, deleteDocument } from '@/services/firebase.js'
import { createContext, useContext } from 'react'
import { useMutation, useMutationState, useQuery } from '@tanstack/react-query'
import { queryClient } from '@/services/tanstackQuery.jsx'
import { sanitizeUndefinedRecursive } from '@/utils/object.js'

/*
 * Mapping
 */
const recipeMapper = (recipe, partial = false) => {
    const mappedRecipe = {
        name: recipe.name ?? (partial ? undefined : ''),
        description: recipe.description ?? (partial ? undefined : ''),
        quantity: recipe.quantity ?? (partial ? undefined : 0),
        ingredients: recipe.ingredients ?? (partial ? undefined : []),
    }
    if (recipe.ingredients) {
        mappedRecipe.ingredients = recipe.ingredients.map(ingredient => ({
            id: ingredient.id,
            name: ingredient.name ?? (partial ? undefined : ''),
            quantity: ingredient.quantity ?? (partial ? undefined : 0),
        }))
    }
    return sanitizeUndefinedRecursive(mappedRecipe)
}

/*
 * Store
 */
/* eslint-disable react-hooks/rules-of-hooks */
function createRecipeStore() {
    const listQuery = useQuery({
        queryKey: ['recipeList'],
        queryFn: async () => getCollection('recipes'),
    })

    const createMutation = useMutation({
        mutationKey: ['recipeCreate'],
        mutationFn: async (vars) => createDocument('recipes', recipeMapper(vars.payload)),
        onSuccess: async () => queryClient.invalidateQueries({ queryKey: ['recipeList'] }),
    })

    const updateMutation = useMutation({
        mutationKey: ['recipeUpdate'],
        mutationFn: async (vars) => updateDocument('recipes', vars.id, recipeMapper(vars.payload, true)),
        onSuccess: async () => queryClient.invalidateQueries({ queryKey: ['recipeList'] }),
    })
    const updateMutationVars = useMutationState({
        filters: { mutationKey: ['recipeUpdate'] },
        select: (mutationState) => mutationState.state.variables
    })

    const deleteMutation = useMutation({
        mutationKey: ['recipeDelete'],
        mutationFn: async (vars) => deleteDocument('recipes', vars.id),
        onSuccess: async () => queryClient.invalidateQueries({ queryKey: ['recipeList'] }),
    })

    const getById = (id) => listQuery.data?.find(recipe => recipe.id === id) || null

    return {
        listQuery,
        createMutation,
        updateMutation,
        updateMutationVars,
        deleteMutation,
        getById,
    }
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