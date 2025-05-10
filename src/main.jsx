import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import '@/assets/styles/main.css'
import { RouterProvider } from '@/router.jsx'
import { RecipeStoreProvider } from '@/stores/recipe.store.jsx'

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <RecipeStoreProvider>
            <RouterProvider />
        </RecipeStoreProvider>
    </StrictMode>,
)
