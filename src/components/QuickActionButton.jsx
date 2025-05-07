export function QuickActionButton({
    variant = 'success',
    onClick,
    children
}) {
    return (
        <button className={`btn btn-xl btn-${variant} btn-circle text-2xl shadow-lg shadow-base-300`} onClick={onClick}>
            {children}
        </button>
    )
}