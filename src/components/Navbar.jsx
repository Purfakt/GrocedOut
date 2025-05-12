import { Link, useRouterState } from '@tanstack/react-router'
import { UiIcon } from '@lib/components/UiIcon.jsx'
import { useAuthStore } from '@/stores/auth.store.jsx'

export function Navbar({
    title,
    backlink,
})
{
    const authStore = useAuthStore()
    const routerState = useRouterState()
    const routeRecipeActive = routerState.location.pathname.startsWith('/recipe') || routerState.location.pathname === '/'
    const routeGroceryActive = routerState.location.pathname.startsWith('/grocery')
    const routeIngredientsActive = routerState.location.pathname.startsWith('/ingredients')

    return (
        <div className="navbar bg-base-300 items-stretch p-0">
            <div className="container mx-auto flex items-center gap-4 px-4">

                {/* Mobile back button */}
                {backlink &&
                    <Link to={backlink} className="lg:hidden btn btn-square">
                        <UiIcon icon="arrow_back_ios_new" size="2xl" />
                    </Link>
                }

                {/* Title */}
                {title &&
                    <h1 className="lg:hidden text-2xl font-bold">
                        {title}
                    </h1>
                }

                {/* Desktop menu */}
                <div className="flex-1 self-stretch">
                    <div role="tablist" className="hidden lg:flex tabs tabs-border h-full">
                        <Link to="/" role="tab" className={`tab h-full flex gap-2 ${routeRecipeActive ? 'tab-active' : ''}`}>
                            <UiIcon icon="skillet" size="2xl" />
                            Recipes
                        </Link>
                        <Link to="/grocery" role="tab" className={`tab h-full flex gap-2 ${routeGroceryActive ? 'tab-active' : ''}`}>
                            <UiIcon icon="shopping_cart" size="2xl" />
                            Grocery
                        </Link>
                        {authStore.isAdmin &&
                            <Link to="/ingredients" role="tab" className={`tab h-full flex gap-2 ${routeIngredientsActive ? 'tab-active' : ''}`}>
                                <UiIcon icon="grocery" size="2xl" />
                                Ingredients
                            </Link>
                        }
                    </div>
                </div>

                {/* User */}
                <div className="flex justify-end">
                    {authStore.user
                        ?
                        <>
                            <button className="btn btn-ghost" popoverTarget="navbar-user" style={{ anchorName: '--navbar-user' }}>
                                <div className="avatar">
                                    <div className={`ring-offset-base-100 w-6 rounded-full ring-2 ring-offset-2 ${authStore.isAdmin ? 'ring-primary' : 'ring-secondary'}`}>
                                        <img src="https://img.daisyui.com/images/profile/demo/spiderperson@192.webp" />
                                    </div>
                                </div>
                                <p className="hidden sm:inline ml-2">{authStore.user.email}</p>
                            </button>
                            <ul className="dropdown dropdown-end menu w-52 rounded-box bg-base-100 shadow-md" popover="auto" id="navbar-user" style={{ positionAnchor: '--navbar-user' }}>
                                <li>
                                    <a onClick={authStore.logout}>
                                        <UiIcon icon="logout" size="2xl" />
                                        Logout
                                    </a>
                                </li>
                            </ul>
                        </>
                        :
                        <button className="btn" onClick={authStore.login}>
                            <UiIcon icon="person" size="2xl" />
                            Login
                        </button>
                    }
                </div>

                {/* Mobile dock */}
                <div className="dock dock-lg lg:hidden">
                    <Link to="/" className={`${routeRecipeActive ? 'dock-active' : ''}`}>
                        <UiIcon icon="skillet" size="2xl" />
                        <span className="dock-label text-base!">Recipes</span>
                    </Link>
                    <Link to="/grocery" className={`${routeGroceryActive ? 'dock-active' : ''}`}>
                        <UiIcon icon="shopping_cart" size="2xl" />
                        <span className="dock-label text-base!">Grocery</span>
                    </Link>
                    {authStore.isAdmin &&
                        <Link to="/ingredients" className={`${routeIngredientsActive ? 'dock-active' : ''}`}>
                            <UiIcon icon="grocery" size="2xl" />
                            <span className="dock-label text-base!">Ingredients</span>
                        </Link>
                    }
                </div>

            </div>
        </div>
    )
}