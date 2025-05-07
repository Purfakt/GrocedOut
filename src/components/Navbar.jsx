import { Link } from '@tanstack/react-router'
import { UiIcon } from '@lib/components/UiIcon.jsx'

export function Navbar({
    title,
    backlink,
}) {
    return (
        <div className="navbar bg-base-100 shadow-sm px-4 gap-4">
            {backlink && (
                <div className="flex-none">
                    <Link to={backlink}>
                        <button className="btn btn-square btn-ghost">
                            <UiIcon icon="arrow_back_ios_new" size="2xl" />
                        </button>
                    </Link>
                </div>
            )}
            <div className="flex-1">
                <h1 className="text-2xl font-bold">{title}</h1>
            </div>
        </div>
    )
}