import { createRootRoute, createRoute, createRouter, RouterProvider as TanstackRouterProvider, useParams, useRouteContext, useRouterState } from '@tanstack/react-router'
import { Layout } from '@/views/Layout'
import { RecipeListView } from '@/views/recipe/RecipeListView.jsx'
import { RecipeShowView } from '@/views/recipe/RecipeShowView.jsx'
import { RecipeFormView } from '@/views/recipe/RecipeFormView.jsx'
import { IngredientLayout } from '@/views/ingredient/Layout.jsx'
import { IngredientListView } from '@/views/ingredient/ingredient/IngredientListView.jsx'
import { IngredientCategoryListView } from '@/views/ingredient/category/IngredientCategoryListView.jsx'
import { getTanstackQueryContext } from '@/services/tanstackQuery.jsx'
import { useRecipeStore } from '@/stores/recipe.store.jsx'

const rootRoute = createRootRoute({
    component: () => {
        const matches = useRouterState({ select: (s) => s.matches })

        const matchWithTitle = [...matches]
            .reverse()
            .find((d) => d.context.title)

        return <Layout title={matchWithTitle?.context.title || 'My App'} />
    },
})

const ingredientLayoutRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/ingredient',
    component: IngredientLayout,
})

const routeTree = rootRoute
    .addChildren([
        createRoute({
            getParentRoute: () => rootRoute,
            path: '/',
            component: RecipeListView,
            context: () => ({
                title: 'Recipes',
            }),
        }),
        createRoute({
            getParentRoute: () => rootRoute,
            path: '/recipe/$id',
            component: () => {
                const { id } = useParams({ strict: false })
                const recipeStore = useRecipeStore()
                const recipe = recipeStore.getById(id)

                const context = useRouteContext({ from: '__root__' })
                context.title = recipe?.name || 'Recipe'

                return <RecipeShowView recipe={recipe} />
            },
        }),
        createRoute({
            getParentRoute: () => rootRoute,
            path: '/recipe/create',
            component: RecipeFormView,
            context: () => ({
                title: 'Create a recipe',
            }),
        }),
        createRoute({
            getParentRoute: () => rootRoute,
            path: '/recipe/$id/update',
            component: () => {
                const { id } = useParams({ strict: false })
                const recipeStore = useRecipeStore()
                const recipe = recipeStore.getById(id)

                const context = useRouteContext({ from: '__root__' })
                context.title = recipe?.name || 'Recipe'

                return <RecipeFormView recipe={recipe} />
            },
        }),
        ingredientLayoutRoute
            .addChildren([
                createRoute({
                    getParentRoute: () => ingredientLayoutRoute,
                    path: '/ingredient',
                    component: IngredientListView,
                    context: () => ({
                        title: 'Ingredients',
                    }),
                }),
                createRoute({
                    getParentRoute: () => ingredientLayoutRoute,
                    path: '/category',
                    component: IngredientCategoryListView,
                }),
            ])
    ])

const router = createRouter({
    routeTree,
    context: {
        ...getTanstackQueryContext(),
    },
    defaultPreload: 'intent',
    scrollRestoration: true,
    defaultStructuralSharing: true,
    defaultPreloadStaleTime: 0,
})

export const RouterProvider = function () {
    return (
        <TanstackRouterProvider router={router} />
    )
}