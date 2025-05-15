import { UiIcon } from '@lib/components/UiIcon.jsx'
import { QuickActions } from '@/components/QuickActions.jsx'
import { QuickActionButton } from '@/components/QuickActionButton.jsx'
import { useIngredientStore } from '@/stores/ingredient.store.jsx'
import { useState } from 'react'
import { useIngredientCategoryStore } from '@/stores/ingredientCategory.store.jsx'

export function IngredientListView() {
    const ingredientStore = useIngredientStore()
    const ingredientCategoryStore = useIngredientCategoryStore()

    /*
     * Form
     */
    const [localName, setLocalName] = useState('')
    const [localCategory, setLocalCategory] = useState(null)
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
        await ingredientStore.createMutation.mutateAsync({
            payload: {
                name: localName,
                category: localCategory,
                priority: localPriority
            }
        })
        resetForm()
        document.getElementById('modal-form').close()
    }
    const startUpdate = (ingredient) => {
        setCurrentId(ingredient.id)
        setLocalName(ingredient.name || '')
        setLocalCategory(ingredient.category?.id || null)
        setLocalPriority(ingredient.priority || 0)
        document.getElementById('modal-form').showModal()
    }
    const update = async () => {
        await ingredientStore.updateMutation.mutateAsync({
            id: currentId,
            payload: {
                name: localName,
                category: ingredientCategoryStore.getById(localCategory) || null,
                priority: localPriority
            }
        })
        resetForm()
        document.getElementById('modal-form').close()
    }
    const startDelete = (ingredient) => {
        setCurrentId(ingredient.id)
        document.getElementById('modal-delete').showModal()
    }
    const deleteIngredient = async () => {
        await ingredientStore.deleteMutation.mutateAsync({ id: currentId })
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
                                        <td>
                                            {ingredient.category && <span className="badge bg-base-200 border-base-300">{ingredient.category.name}</span>}
                                        </td>
                                        <td className="flex justify-end gap-1">
                                            <button
                                                className="btn btn-ghost btn-sm px-2"
                                                onClick={() => startUpdate(ingredient)}
                                            >
                                                <UiIcon icon="edit" size="lg" />
                                            </button>
                                            <button
                                                className="btn btn-ghost btn-sm px-2"
                                                onClick={() => startDelete(ingredient)}
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
                                {isUpdate ? 'Update ingredient' : 'Create ingredient'}
                            </h3>
                            <p>
                                Create an ingredient to use in your recipes. You can add a name, a category and a priority.
                            </p>
                            <div>
                                <fieldset className="fieldset py-0">
                                    <legend className="fieldset-legend">Name</legend>
                                    <input
                                        type="text"
                                        className="input input-lg w-full mb-2"
                                        value={localName.toString()}
                                        onChange={(e) => setLocalName(e.target.value)}
                                    />
                                </fieldset>
                                <fieldset className="fieldset">
                                    <legend className="fieldset-legend">Category</legend>
                                    <select
                                        value={localCategory?.toString() || ''}
                                        className="select w-full"
                                        onChange={(e) => setLocalCategory(e.target.value)}
                                    >
                                        <option value="">No category</option>
                                        {ingredientCategoryStore.listQuery.data?.map(category => (
                                            <option key={category.id} value={category.id}>{category.name}</option>
                                        ))}
                                    </select>
                                </fieldset>
                                <fieldset className="fieldset">
                                    <legend className="fieldset-legend">Priority</legend>
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
                                    ? ingredientStore.updateMutation.isPending
                                        ? <span className="loading loading-spinner loading-sm"></span>
                                        : 'Update'
                                    : ingredientStore.createMutation.isPending
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
                        <h3 className="text-lg font-bold">Delete ingredient</h3>
                        <p>Are you sure you want to delete this ingredient?</p>
                        <div className="modal-action">
                            <button
                                className="btn btn-error"
                                onClick={deleteIngredient}
                            >
                                {ingredientStore.deleteMutation.isPending
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