import { RecipeCard } from '@/components/RecipeCard.jsx'
import { Link } from '@tanstack/react-router'
import { UiIcon } from '@lib/components/UiIcon.jsx'
import { QuickActions } from '@/components/QuickActions.jsx'
import { QuickActionButton } from '@/components/QuickActionButton.jsx'

export function RecipeListView() {
    return <>
        <div className="container mx-auto p-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                <div>
                    <Link
                        to="/recipe/1"
                    >
                        <RecipeCard
                            title="Test 1"
                        />
                    </Link>
                </div>
                <div>
                    <Link
                        to="/recipe/1"
                    >
                        <RecipeCard
                            title="Test 1"
                        />
                    </Link>
                </div>
                <div>
                    <Link
                        to="/recipe/1"
                    >
                        <RecipeCard
                            title="Test 1"
                        />
                    </Link>
                </div>
                <div>
                    <Link
                        to="/recipe/1"
                    >
                        <RecipeCard
                            title="Test 1"
                        />
                    </Link>
                </div>
            </div>
        </div>
        <QuickActions>
            <Link to="/recipe/new">
                <QuickActionButton>
                    <UiIcon icon="add" size="2xl" />
                </QuickActionButton>
            </Link>
        </QuickActions>
    </>
}