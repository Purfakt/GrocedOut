import { useMemo, useState } from 'react'
import { useRecipeStore } from '@/stores/recipe.store.jsx'
import { useGroceryItemStore } from '@/stores/groceryItem.store.jsx'
import { useAuthStore } from '@/stores/auth.store.jsx' 
import { UiIcon } from '@lib/components/UiIcon.jsx'
import { QuickActions } from '@/components/QuickActions.jsx'
import { QuickActionButton } from '@/components/QuickActionButton.jsx'

export function GroceryListView() {
    const recipeStore = useRecipeStore()
    const itemStore = useGroceryItemStore()
    const authStore = useAuthStore()

    const [customItemName, setCustomItemName] = useState('')
    const [customItemQuantity, setCustomItemQuantity] = useState(1)

    const { data: recipes, isLoading: recipesLoading } = recipeStore.listQuery
    const { data: allGroceryItemDocs, isLoading: groceryItemsLoading } = itemStore.listQuery

    const processedGroceryList = useMemo(() => {
        if (recipesLoading || groceryItemsLoading || !authStore.user) {
            return { categories: [], isLoading: true }
        }
        if (!recipes || !allGroceryItemDocs) {
            return { categories: [], isLoading: false }
        }

        const ingredientMap = new Map()
        const ingredients = allGroceryItemDocs?.filter(item => item.isIngredient) || []
        const otherItems = allGroceryItemDocs?.filter(item => !item.isIngredient) || []

        recipes.forEach(recipe => {
            if (recipe.quantity > 0) {
                (recipe.ingredients || []).forEach(recipeIng => {
                    const groceryItemDetails = ingredients.find(i => i.id === recipeIng.id)
                    if (groceryItemDetails) {
                        const existing = ingredientMap.get(groceryItemDetails.id)
                        const currentCalcQuantity = (recipeIng.quantity || 0) * recipe.quantity
                        if (existing) {
                            existing.totalQuantity += currentCalcQuantity
                        } else {
                            ingredientMap.set(groceryItemDetails.id, {
                                ...groceryItemDetails,
                                displayId: `recipe-${groceryItemDetails.id}`,
                                originalGroceryItemId: groceryItemDetails.id,
                                totalQuantity: currentCalcQuantity,
                                isUserAdded: false,
                                isChecked: false,
                            })
                        }
                    }
                })
            }
        })

        const combinedItems = Array.from(ingredientMap.values())

        otherItems.forEach(customItem => {
            combinedItems.push({
                ...customItem,
                displayId: `custom-${customItem.id}`,
                originalGroceryItemId: null,
                totalQuantity: customItem.quantity,
                category: customItem.category || { name: 'Manually Added', id: 'manually_added_cat_id', priority: 9999 },
                isUserAdded: true,
               
            })
        })

        const groups = combinedItems.reduce((acc, item) => {
            const categoryName = item.category?.name || (item.isUserAdded ? 'Manually Added' : 'Uncategorized')
            const categoryPriority = item.category?.priority ?? (item.isUserAdded ? 9999 : Infinity)

            if (!acc[categoryName]) {
                acc[categoryName] = { items: [], priority: categoryPriority, name: categoryName }
            }
            acc[categoryName].items.push(item)
            return acc
        }, {})

        const sortedCategoriesArray = Object.values(groups)
            .map(categoryGroup => {
                categoryGroup.items.sort((a, b) => {
                    const priorityDiff = (a.priority ?? Infinity) - (b.priority ?? Infinity)
                    if (priorityDiff !== 0) return priorityDiff
                    return a.name.localeCompare(b.name)
                })
                return categoryGroup
            })
            .sort((a, b) => {
                const priorityDiff = a.priority - b.priority
                if (priorityDiff !== 0) return priorityDiff
                return a.name.localeCompare(b.name)
            })

        return { categories: sortedCategoriesArray, isLoading: false }
    }, [recipes, allGroceryItemDocs, recipesLoading, groceryItemsLoading, authStore.user])

    const handleAddCustomItem = async () => {
        if (!customItemName.trim() || customItemQuantity <= 0 || !authStore.user) return
        await itemStore.createMutation.mutateAsync({
            payload: {
                name: customItemName.trim(),
                quantity: customItemQuantity,
                isChecked: false,
                isIngredient: false,
            },
        })
        setCustomItemName('')
        setCustomItemQuantity(1)
        document.getElementById('modal-add-custom-item').close()
    }
    const toggleCustomItemChecked = async (item) => {
        if (!item.isUserAdded || !item.id) return 
        await itemStore.updateMutation.mutateAsync({
            id: item.id,
            payload: { isChecked: !item.isChecked },
        })
    }

    if (processedGroceryList.isLoading) {
        return (
            <div className="container mx-auto p-4 text-center">
                <span className="loading loading-spinner loading-xl"></span>
            </div>
        )
    }

    return (
        <>
            <div className="container mx-auto p-4">
                {processedGroceryList.categories.length === 0 ? (
                    <p className="text-center text-gray-500">Your grocery list is empty. Select some recipes or add items manually!</p>
                ) : (
                    <div className="space-y-6">
                        {processedGroceryList.categories.map(category => (
                            <div key={category.name} className="card bg-base-100 shadow">
                                <div className="card-body p-4 sm:p-6">
                                    <h2 className="card-title text-xl mb-3 border-b border-base-300 pb-2">
                                        {category.name}
                                    </h2>
                                    <ul className="space-y-2">
                                        {category.items.map(item => (
                                            <li key={item.displayId} className="flex items-center justify-between p-2 rounded-lg hover:bg-base-200">
                                                <div className="flex items-center">
                                                    <button
                                                        className={`btn btn-ghost btn-sm mr-2 p-1 ${!item.isUserAdded ? 'cursor-not-allowed opacity-50' : ''}`}
                                                        onClick={() => item.isUserAdded && toggleCustomItemChecked(item)}
                                                        disabled={!item.isUserAdded || itemStore.updateMutation.isPending}
                                                        aria-label={item.isChecked ? 'Uncheck item' : 'Check item'}
                                                    >
                                                        <UiIcon icon={item.isChecked ? 'check_box' : 'check_box_outline_blank'} size="xl" />
                                                    </button>
                                                    <span className={`${item.isChecked ? 'line-through text-gray-500' : ''}`}>
                                                        {item.name}
                                                    </span>
                                                </div>
                                                <span className={`badge badge-ghost ${item.isChecked ? 'line-through text-gray-500' : ''}`}>
                                                    Qty: {item.totalQuantity}
                                                </span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <QuickActions>
                <QuickActionButton onClick={() => document.getElementById('modal-add-custom-item').showModal()}>
                    <UiIcon icon="add_shopping_cart" size="2xl" />
                </QuickActionButton>
            </QuickActions>

            <dialog id="modal-add-custom-item" className="modal">
                <div className="modal-box">
                    <h3 className="font-bold text-lg">Add Custom Item to Grocery List</h3>
                    <div className="py-4 space-y-4">
                        <div>
                            <label className="label"><span className="label-text">Item Name</span></label>
                            <input
                                type="text"
                                placeholder="E.g., Paper towels"
                                className="input input-bordered w-full"
                                value={customItemName}
                                onChange={(e) => setCustomItemName(e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="label"><span className="label-text">Quantity</span></label>
                            <input
                                type="number"
                                placeholder="1"
                                min="1"
                                className="input input-bordered w-full"
                                value={customItemQuantity}
                                onChange={(e) => setCustomItemQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                            />
                        </div>
                    </div>
                    <div className="modal-action">
                        <button className="btn" onClick={() => document.getElementById('modal-add-custom-item').close()}>Cancel</button>
                        <button
                            className="btn btn-primary"
                            onClick={handleAddCustomItem}
                            disabled={!customItemName.trim() || customItemQuantity <= 0 || itemStore.createMutation.isPending || !authStore.user}
                        >
                            {itemStore.createMutation.isPending ? <span className="loading loading-spinner loading-sm"></span> : 'Add Item'}
                        </button>
                    </div>
                </div>
                <form method="dialog" className="modal-backdrop">
                    <button>close</button>
                </form>
            </dialog>
        </>
    )
}