import { Link } from '@tanstack/react-router'

export function NotFoundView() {
    return (
        <div className="h-[100vh] flex flex-col items-center justify-center">
            <h1 className="text-5xl font-bold">404</h1>
            <p className="text-2xl">Page not found</p>
            <Link to="/" className="mt-4 text-blue-500 hover:underline">
                Go back to home
            </Link>
        </div>
    )
}