export function UiIcon({
    icon,
    size = 'base',
    bold = false,
    className = '',
}) {
    return (
        <span className={`UiIcon material-symbols-outlined text-${size} ${bold ? 'font-semibold' : ''} ${className}`}>{icon}</span>
    )
}