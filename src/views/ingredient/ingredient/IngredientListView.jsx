import { UiIcon } from '@lib/components/UiIcon.jsx'
import { QuickActions } from '@/components/QuickActions.jsx'
import { QuickActionButton } from '@/components/QuickActionButton.jsx'
import { useIngredientStore } from '@/stores/ingredient.store.jsx'

export function IngredientListView() {
    const ingredientStore = useIngredientStore()

    return <>
        {ingredientStore.listQuery.isLoading
            ?
            <span className="loading loading-spinner loading-xl"></span>
            :
            <>
                <div className="mt-4">
                    {ingredientStore.listQuery.data?.length === 0
                        ?
                        <p>No ingredients found. Add your first ingredient!</p>
                        :
                        <div className="overflow-x-auto rounded-box border border-base-content/5 bg-base-100">
                            <table className="table">
                                <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Category</th>
                                    <th></th>
                                </tr>
                                </thead>
                                <tbody>
                                {ingredientStore.listQuery.data?.map(ingredient => (
                                    <tr key={ingredient.id}>
                                        <td>{ingredient.name}</td>
                                        <td>{ingredient.category?.name}</td>
                                        <td></td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    }
                </div>
                <QuickActions>
                    <QuickActionButton>
                        <UiIcon icon="add" size="2xl" />
                    </QuickActionButton>
                </QuickActions>
            </>
        }
    </>
}