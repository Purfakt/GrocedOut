import { UiIcon } from '@lib/components/UiIcon.jsx'
import { QuickActions } from '@/components/QuickActions.jsx'
import { QuickActionButton } from '@/components/QuickActionButton.jsx'
import { useIngredientCategoryStore } from '@/stores/ingredientCategory.store.jsx'

export function IngredientCategoryListView() {
    const ingredientCategoryStore = useIngredientCategoryStore()

    return <>
        {ingredientCategoryStore.listQuery.isLoading
            ?
            <span className="loading loading-spinner loading-xl"></span>
            :
            <>
                <div className="mt-4">
                    {ingredientCategoryStore.listQuery.data?.length === 0
                        ?
                        <p>No ingredientCategories found. Add your first ingredientCategory!</p>
                        :
                        <div className="overflow-x-auto rounded-box border border-base-content/5 bg-base-100">
                            <table className="table">
                                <thead>
                                <tr>
                                    <th>Name</th>
                                    <th></th>
                                </tr>
                                </thead>
                                <tbody>
                                {ingredientCategoryStore.listQuery.data?.map(ingredientCategory => (
                                    <tr key={ingredientCategory.id}>
                                        <td>{ingredientCategory.name}</td>
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