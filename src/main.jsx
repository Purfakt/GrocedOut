import { createRoot } from 'react-dom/client'

import '@/assets/styles/main.css'
import { RouterProvider } from '@/router.jsx'

createRoot(document.getElementById('root')).render(<RouterProvider />)
