import { Outlet } from '@tanstack/react-router'
import { Navbar } from '@/components/Navbar.jsx'
import { StoreProvider } from '@/stores/index.jsx'
import { TanstackQueryProvider } from '@/services/tanstackQuery.jsx'

export function Layout({ title }) {
    return (
        <TanstackQueryProvider>
            <StoreProvider>
                <main>
                    <Navbar title={title} backlink="/" />
                    <Outlet />
                </main>
            </StoreProvider>
        </TanstackQueryProvider>
    )
}