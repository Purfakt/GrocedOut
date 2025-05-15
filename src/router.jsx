import { createRootRoute, createRoute, createRouter, RouterProvider as TanstackRouterProvider, useParams, useRouteContext, useRouterState } from '@tanstack/react-router'
import { NotFoundView } from '@/views/NotFoundView.jsx'
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
    notFoundComponent: NotFoundView
})

const layoutRoute = createRoute({
    id: 'layout',
    getParentRoute: () => rootRoute,
    component: () => {
        const matches = useRouterState({ select: (s) => s.matches })
        console.log(matches)

        const matchWithTitle = [...matches]
            .reverse()
            .find((d) => d.context.title)

        return <Layout title={matchWithTitle?.context.title || 'My App'} />
    }
})

const layoutIngredientRoute = createRoute({
    id: 'layoutIngredient',
    getParentRoute: () => layoutRoute,
    component: IngredientLayout,
})

const routeTree = layoutRoute
    .addChildren([
        createRoute({
            getParentRoute: () => layoutRoute,
            path: '/',
            component: RecipeListView,
            context: () => ({
                title: 'Recipes',
            }),
        }),
        createRoute({
            getParentRoute: () => layoutRoute,
            path: '/recipe/$id',
            component: () => {
                const { id } = useParams({ strict: false })
                const recipeStore = useRecipeStore()
                const recipe = recipeStore.getById(id)

                const context = useRouteContext({ from: 'layout' })
                context.title = recipe?.name || 'Recipe'

                return <RecipeShowView recipe={recipe} />
            },
        }),
        createRoute({
            getParentRoute: () => layoutRoute,
            path: '/recipe/create',
            component: RecipeFormView,
            context: () => ({
                title: 'Create a recipe',
            }),
        }),
        createRoute({
            getParentRoute: () => layoutRoute,
            path: '/recipe/$id/update',
            component: () => {
                const { id } = useParams({ strict: false })
                const recipeStore = useRecipeStore()
                const recipe = recipeStore.getById(id)

                const context = useRouteContext({ from: 'layout' })
                context.title = recipe?.name || 'Recipe'

                return <RecipeFormView recipe={recipe} />
            },
        }),
        layoutIngredientRoute
            .addChildren([
                createRoute({
                    getParentRoute: () => layoutIngredientRoute,
                    path: '/ingredient/ingredient',
                    component: IngredientListView,
                    context: () => ({
                        title: 'Ingredients',
                    }),
                }),
                createRoute({
                    getParentRoute: () => layoutIngredientRoute,
                    path: '/ingredient/category',
                    component: IngredientCategoryListView,
                }),
            ])
    ])

const router = createRouter({
    routeTree: rootRoute.addChildren([
        routeTree,
    ]),
    context: {
        ...getTanstackQueryContext(),
    },
    defaultPreload: 'intent',
    scrollRestoration: true,
    defaultStructuralSharing: true,
    defaultPreloadStaleTime: 0,
    notFoundMode: 'root',
})

export const RouterProvider = function () {
    return (
        <TanstackRouterProvider router={router} />
    )
}