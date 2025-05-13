import { createRootRoute, createRoute, createRouter, RouterProvider as TanstackRouterProvider } from '@tanstack/react-router'
import { Layout } from '@/views/Layout'
import { RecipeListView } from '@/views/RecipeListView.jsx'
import { RecipeShowView } from '@/views/RecipeShowView.jsx'
import { RecipeFormView } from '@/views/RecipeFormView.jsx'
import { getTanstackQueryContext } from '@/services/tanstackQuery.jsx'

const rootRoute = createRootRoute({
    component: Layout,
})

const routeTree = rootRoute
    .addChildren([
        createRoute({
            getParentRoute: () => rootRoute,
            path: '/',
            component: RecipeListView
        }),
        createRoute({
            getParentRoute: () => rootRoute,
            path: '/recipe/$id',
            component: RecipeShowView,
        }),
        createRoute({
            getParentRoute: () => rootRoute,
            path: '/recipe/create',
            component: RecipeFormView,
        }),
        createRoute({
            getParentRoute: () => rootRoute,
            path: '/recipe/$id/update',
            component: RecipeFormView,
        }),
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