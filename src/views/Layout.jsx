import { Outlet } from '@tanstack/react-router'
import { Navbar } from '@/components/Navbar.jsx'

export function Layout({ title }) {
    return (
        <main>
            <Navbar title={title} backlink="/" />
            <Outlet />
        </main>
    )
}