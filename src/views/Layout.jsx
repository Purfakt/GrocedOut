import { Link, Outlet } from '@tanstack/react-router'
import { UiIcon } from '@lib/components/UiIcon.jsx'

export function Layout() {
    return (
        <main>
            <Outlet />
            <div className="dock">
                <Link to="/" activeProps={{ className: 'dock-active' }}>
                    <UiIcon icon="skillet" size="2xl" />
                    <span className="dock-label">Recipes</span>
                </Link>

                <Link to="/grocery" disabled activeProps={{ className: 'dock-active' }}>
                    <UiIcon icon="shopping_cart" size="2xl" />
                    <span className="dock-label">Grocery</span>
                </Link>

                <Link to="/settings" disabled activeProps={{ className: 'dock-active' }}>
                    <UiIcon icon="settings" size="2xl" />
                    <span className="dock-label">Settings</span>
                </Link>
            </div>
        </main>
    )
}