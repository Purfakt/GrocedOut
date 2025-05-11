export function QuickActions({ children }) {
    return (
        <div className="fixed bottom-[70px] lg:bottom-0 right-0 left-0">
            <div className="container mx-auto flex flex-row-reverse gap-4 p-4">
                {children}
            </div>
        </div>
    )
}