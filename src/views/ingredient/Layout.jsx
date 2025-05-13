import { Link, Outlet } from '@tanstack/react-router'

export function IngredientLayout() {
    return (
        <div className="container mx-auto p-4">
            <div role="tablist" className="tabs tabs-border">
                <Link to="/ingredient/ingredient" className="tab" activeProps={{ className: 'tab-active' }}>Ingredients</Link>
                <Link to="/ingredient/category" className="tab" activeProps={{ className: 'tab-active' }}>Categories</Link>
            </div>
            <Outlet />
        </div>
    )
}