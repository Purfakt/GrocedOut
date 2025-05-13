import { createRoot } from 'react-dom/client'

import '@/assets/styles/main.css'
import { RouterProvider } from '@/router.jsx'
import { TanstackQueryProvider } from '@/services/tanstackQuery.jsx'
import { StoreProvider } from '@/stores/index.jsx'

createRoot(document.getElementById('root')).render(
    <TanstackQueryProvider>
        <StoreProvider>
            <RouterProvider />
        </StoreProvider>
    </TanstackQueryProvider>
)
