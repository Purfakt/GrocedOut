import { Outlet } from '@tanstack/react-router'

export function Layout() {
    return (
        <main>
            <Outlet />
        </main>
    )
}