import { QuickActions } from '@/components/QuickActions.jsx'
import { UiIcon } from '@lib/components/UiIcon.jsx'
import { QuickActionButton } from '@/components/QuickActionButton.jsx'
import { Navbar } from '@/components/Navbar.jsx'
import { useParams } from '@tanstack/react-router'

export function RecipeFormView({
}) {
    const { id: recipeId } = useParams({ strict: false })

    return <>
        <Navbar title={recipeId ? "Edit Recipe" : "Create Recipe"} backlink="/" />

        <div className="container mx-auto p-4">
            <div className="flex flex-col gap-4">
                <div>
                    <input type="text" placeholder="Name" className="input w-full mb-2" />
                </div>
                <div>
                    <textarea placeholder="Description" className="textarea w-full"></textarea>
                </div>
            </div>
        </div>

        <QuickActions>
            <QuickActionButton>
                <UiIcon icon="check" size="2xl" />
            </QuickActionButton>
        </QuickActions>
    </>
}