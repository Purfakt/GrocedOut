import { Link, Outlet } from '@tanstack/react-router'

export function GroceryItemsLayout() {
    return (
        <div className="container mx-auto p-4">
            <div role="tablist" className="tabs tabs-border">
                <Link to="/admin/groceryitems" className="tab" activeProps={{ className: 'tab-active' }}>Grocery Items</Link>
                <Link to="/admin/category" className="tab" activeProps={{ className: 'tab-active' }}>Categories</Link>
            </div>
            <Outlet />
        </div>
    )
}