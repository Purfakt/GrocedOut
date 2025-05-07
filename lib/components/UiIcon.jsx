export function UiIcon({
    icon,
    size = 'base',
    className = '',
}) {
    return (
        <span className={`UiIcon material-symbols-outlined text-${size} ${className}`}>{icon}</span>
    )
}