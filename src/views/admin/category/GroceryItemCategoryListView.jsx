import { UiIcon } from '@lib/components/UiIcon.jsx'
import { QuickActions } from '@/components/QuickActions.jsx'
import { QuickActionButton } from '@/components/QuickActionButton.jsx'
import { useState } from 'react'
import { useItemCategoryStore } from '@/stores/itemCategory.store.jsx'

export function GroceryItemCategoryListView() {
    const itemCategoryStore = useItemCategoryStore()

    /*
     * Form
     */
    const [localName, setLocalName] = useState('')
    const [localPriority, setLocalPriority] = useState(0)

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
        await itemCategoryStore.createMutation.mutateAsync({
            payload: {
                name: localName,
                priority: localPriority
            }
        })
        resetForm()
        document.getElementById('modal-form').close()
    }
    const startUpdate = (category) => {
        setCurrentId(category.id)
        setLocalName(category.name || '')
        setLocalPriority(category.priority || 0)
        document.getElementById('modal-form').showModal()
    }
    const update = async () => {
        await itemCategoryStore.updateMutation.mutateAsync({
            id: currentId,
            payload: {
                name: localName,
                priority: localPriority
            }
        })
        resetForm()
        document.getElementById('modal-form').close()
    }
    const startDelete = (category) => {
        setCurrentId(category.id)
        document.getElementById('modal-delete').showModal()
    }
    const deleteCategory = async () => {
        await itemCategoryStore.deleteMutation.mutateAsync({ id: currentId })
        setCurrentId(null)
        document.getElementById('modal-delete').close()
    }

    const resetForm = () => {
        setCurrentId(null)
        setLocalName('')
        setLocalPriority(0)
    }

    return <>
        {itemCategoryStore.listQuery.isLoading
            ?
            <span className="loading loading-spinner loading-xl"></span>
            :
            <>

                <div className="mt-4">
                    {itemCategoryStore.listQuery.data?.length === 0
                        ?
                        <p>No category found. Add your first grocery item!</p>
                        :
                        <div className="overflow-x-auto rounded-box border border-base-content/5 bg-base-100">
                            <table className="table">
                                <thead className="bg-base-300">
                                    <tr>
                                        <th>Name</th>
                                        <th>Priority</th>
                                        <th></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {itemCategoryStore.listQuery.data?.map(category => (
                                        <tr key={category.id}>
                                            <td>{category.name}</td>
                                            <td>{category.priority}</td>
                                            <td className="flex justify-end gap-1">
                                                <button
                                                    className="btn btn-ghost btn-sm px-2"
                                                    onClick={() => startUpdate(category)}
                                                >
                                                    <UiIcon icon="edit" size="lg" />
                                                </button>
                                                <button
                                                    className="btn btn-ghost btn-sm px-2"
                                                    onClick={() => startDelete(category)}
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
                                {isUpdate ? 'Update grocery item' : 'Create grocery item'}
                            </h3>
                            <p>
                                Create a category to use in your grocery items. You can add a name and a priority.
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
                                    <legend className="fieldset-legend pt-0">Priority</legend>
                                    <input
                                        type="number"
                                        className="input input-lg w-full mb-2"
                                        value={localPriority}
                                        onChange={(e) => setLocalPriority(parseInt(e.target.value) || 0)}
                                    />
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
                                    ? itemCategoryStore.updateMutation.isPending
                                        ?
                                        <span className="loading loading-spinner loading-sm"></span>
                                        : 'Update'
                                    : itemCategoryStore.createMutation.isPending
                                        ?
                                        <span className="loading loading-spinner loading-sm"></span>
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
                        <h3 className="text-lg font-bold">Delete category</h3>
                        <p>Are you sure you want to delete this category?</p>
                        <div className="modal-action">
                            <button
                                className="btn btn-error"
                                onClick={deleteCategory}
                            >
                                {itemCategoryStore.deleteMutation.isPending
                                    ?
                                    <span className="loading loading-spinner loading-sm"></span>
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