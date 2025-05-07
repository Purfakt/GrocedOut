export function QuickActions({ children }) {
    return (
        <div className="fixed bottom-[65px] right-0 p-4 flex flex-row-reverse gap-4">
            {children}
        </div>
    )
}