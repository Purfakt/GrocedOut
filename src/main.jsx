import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import '@/assets/styles/main.css'
import { RouterProvider } from '@/router.jsx'
import { RecipeStoreProvider } from '@/stores/recipe.store.jsx'
import { AuthStoreProvider } from '@/stores/auth.store.jsx'

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <AuthStoreProvider>
            <RecipeStoreProvider>
                <RouterProvider />
            </RecipeStoreProvider>
        </AuthStoreProvider>
    </StrictMode>,
)
