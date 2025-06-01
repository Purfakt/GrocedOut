import { UiIcon } from '@lib/components/UiIcon.jsx'
import { QuickActions } from '@/components/QuickActions.jsx'
import { QuickActionButton } from '@/components/QuickActionButton.jsx'
import { useGroceryItemStore } from '@/stores/groceryItem.store.jsx'
import { useState } from 'react'
import { useItemCategoryStore } from '@/stores/itemCategory.store.jsx'

export function GroceryItemListView() {
    const groceryItemStore = useGroceryItemStore()
    const groceryItemCategoryStore = useItemCategoryStore()

    /*
     * Form
     */
    const [localName, setLocalName] = useState('')
    const [localCategory, setLocalCategory] = useState(null)
    const [localPriority, setLocalPriority] = useState(0)
    const [localIsIngredient, setLocalIsIngredient] = useState(true)

    /*
     * Actions
     */
    const [currentId, setCurrentId] = useState(null)
    const isUpdate = currentId !== null
    const startCreate = () => {
        resetForm()
        document.getElementById('modal-form').showModal()
    }
    const create = async () => {
        await groceryItemStore.createMutation.mutateAsync({
            payload: {
                name: localName,
                category: groceryItemCategoryStore.getById(localCategory) || null,
                priority: localPriority,
                isIngredient: localIsIngredient,
            },
        })
        resetForm()
        document.getElementById('modal-form').close()
    }
    const startUpdate = (groceryItem) => {
        setCurrentId(groceryItem.id)
        setLocalName(groceryItem.name || '')
        setLocalCategory(groceryItem.category?.id || null)
        setLocalPriority(groceryItem.priority || 0)
        setLocalIsIngredient(groceryItem.isIngredient || false)
        document.getElementById('modal-form').showModal()
    }
    const update = async () => {
        await groceryItemStore.updateMutation.mutateAsync({
            id: currentId,
            payload: {
                name: localName,
                category: groceryItemCategoryStore.getById(localCategory) || null,
                priority: localPriority,
                isIngredient: true, 
            },
        })
        resetForm()
        document.getElementById('modal-form').close()
    }
    const startDelete = (groceryItem) => {
        setCurrentId(groceryItem.id)
        document.getElementById('modal-delete').showModal()
    }
    const deleteItem = async () => {
        await groceryItemStore.deleteMutation.mutateAsync({ id: currentId })
        setCurrentId(null)
        document.getElementById('modal-delete').close()
    }

    const resetForm = () => {
        setCurrentId(null)
        setLocalName('')
        setLocalCategory(null)
        setLocalPriority(0)
    }

    return <>
        {groceryItemStore.listQuery.isLoading
            ?
            <span className="loading loading-spinner loading-xl"></span>
            :
            <>
                <div className="mt-4">
                    {(groceryItemStore.listQuery.data?.length || 0) === 0
                        ?
                        <p>No grocery items found. Add your first one!</p>
                        :
                        <div className="overflow-x-auto rounded-box border border-base-content/5 bg-base-100">
                            <table className="table">
                                <thead className="bg-base-300">
                                    <tr>
                                        <th>Name</th>
                                        <th>Category</th>
                                        <th>Priority</th>
                                        <th>Is Ingredient</th>
                                        <th></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {groceryItemStore.listQuery.data?.map(item => (
                                        <tr key={item.id}>
                                            <td>{item.name}</td>
                                            <td>
                                                {item.category && <span className="badge bg-base-200 border-base-300">{item.category.name}</span>}
                                            </td>
                                            <td>
                                                {item.priority}
                                            </td>
                                            <td>
                                                {item.isIngredient
                                                    ? <span className="badge badge-accent">Ingredient</span>
                                                    : <span className=""></span>
                                                }
                                            </td>
                                            <td className="flex justify-end gap-1">
                                                <button
                                                    className="btn btn-ghost btn-sm px-2"
                                                    onClick={() => startUpdate(item)}
                                                >
                                                    <UiIcon icon="edit" size="lg" />
                                                </button>
                                                <button
                                                    className="btn btn-ghost btn-sm px-2"
                                                    onClick={() => startDelete(item)}
                                                >
                                                    <UiIcon icon="delete" size="lg" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    }
                </div>

                <QuickActions>
                    <QuickActionButton onClick={startCreate}>
                        <UiIcon icon="add" size="2xl" />
                    </QuickActionButton>
                </QuickActions>

                <dialog id="modal-form" className="modal">
                    <div className="modal-box">
                        <div className="flex flex-col gap-4">
                            <h3 className="text-lg font-bold">
                                {isUpdate ? 'Update Grocery Item' : 'Create Grocery Item'}
                            </h3>
                            <p>
                                Manage master grocery items.
                            </p>
                            <div>
                                <fieldset className="fieldset py-0">
                                    <legend className="fieldset-legend pt-0">Name</legend>
                                    <input
                                        type="text"
                                        className="input input-lg w-full mb-2"
                                        value={localName.toString()}
                                        onChange={(e) => setLocalName(e.target.value)}
                                    />
                                </fieldset>
                                <fieldset className="fieldset">
                                    <legend className="fieldset-legend pt-0">Category</legend>
                                    <select
                                        value={localCategory?.toString() || ''}
                                        className="select w-full"
                                        onChange={(e) => setLocalCategory(e.target.value)}
                                    >
                                        <option value="">No category</option>
                                        {groceryItemCategoryStore.listQuery.data?.map(category => (
                                            <option key={category.id} value={category.id}>{category.name}</option>
                                        ))}
                                    </select>
                                </fieldset>
                                <fieldset className="fieldset">
                                    <legend className="fieldset-legend pt-0">Priority</legend>
                                    <input
                                        type="number"
                                        className="input input-lg w-full mb-2"
                                        value={localPriority}
                                        onChange={(e) => setLocalPriority(parseInt(e.target.value) || 0)}
                                    />
                                </fieldset>
                                <fieldset className="fieldset">
                                    <label className="label cursor-pointer">
                                        <span className="label-text fieldset-legend pt-0">Is an Ingredient?</span>
                                        <input
                                            type="checkbox"
                                            className="toggle toggle-primary"
                                            checked={localIsIngredient}
                                            onChange={(e) => setLocalIsIngredient(e.target.checked)}
                                        />
                                    </label>
                                </fieldset>
                            </div>
                        </div>
                        <div className="modal-action">
                            <button
                                className="btn btn-success"
                                disabled={localName.length === 0}
                                onClick={isUpdate ? update : create}
                            >
                                {isUpdate
                                    ? groceryItemStore.updateMutation.isPending
                                        ? <span className="loading loading-spinner loading-sm"></span>
                                        : 'Update'
                                    : groceryItemStore.createMutation.isPending
                                        ? <span className="loading loading-spinner loading-sm"></span>
                                        : 'Create'}
                            </button>
                        </div>
                    </div>
                    <form method="dialog" className="modal-backdrop">
                        <button>close</button>
                    </form>
                </dialog>

                <dialog id="modal-delete" className="modal">
                    <div className="modal-box">
                        <h3 className="text-lg font-bold">Delete Grocery Item</h3>
                        <p>Are you sure you want to delete this master groceryItem?</p>
                        <div className="modal-action">
                            <button
                                className="btn btn-error"
                                onClick={deleteItem}
                            >
                                {groceryItemStore.deleteMutation.isPending
                                    ? <span className="loading loading-spinner loading-sm"></span>
                                    : 'Delete'}
                            </button>
                        </div>
                    </div>
                    <form method="dialog" className="modal-backdrop">
                        <button>close</button>
                    </form>
                </dialog>

            </>
        }
    </>
}