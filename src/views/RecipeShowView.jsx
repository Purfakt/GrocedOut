import { Link } from '@tanstack/react-router'
import { UiIcon } from '@lib/components/UiIcon.jsx'
import { QuickActions } from '@/components/QuickActions.jsx'
import { QuickActionButton } from '@/components/QuickActionButton.jsx'
import { Navbar } from '@/components/Navbar.jsx'

export function RecipeShowView() {
    return <>
        <Navbar title={"Recipe Title"} backlink="/" />

        <div className="container mx-auto p-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                <div>
                    <img src="https://picsum.photos/500/200" alt="Recipe" className="w-full h-auto rounded-xl shadow-lg" />
                </div>
                <div className="col-span-2">
                    <p>
                        This is a delicious salmon pasta recipe that is quick and easy to make. It features fresh salmon, pasta, and a creamy sauce.
                    </p>
                </div>
            </div>
        </div>

        <QuickActions>
            <Link to={`/recipe/1/edit`}>
                <QuickActionButton>
                    <UiIcon icon="edit" size="2xl" />
                </QuickActionButton>
            </Link>
            <QuickActionButton variant="error" onClick={() => document.getElementById('modal-recipe-delete').showModal()}>
                <UiIcon icon="delete" size="2xl" />
            </QuickActionButton>
        </QuickActions>

        <dialog id="modal-recipe-delete" className="modal">
            <div className="modal-box">
                <h3 className="text-lg font-bold">Delete recipe Recipe Title</h3>
                <p className="py-4">Are you sure you want to delete this recipe?</p>
                <div className="modal-action">
                    <form method="dialog">
                        <button className="btn">No, cancel</button>
                    </form>
                    <button className="btn btn-error">Yes, delete!</button>
                </div>
            </div>
            <form method="dialog" className="modal-backdrop">
                <button>close</button>
            </form>
        </dialog>
    </>
}