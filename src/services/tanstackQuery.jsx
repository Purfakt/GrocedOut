import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

export const queryClient = new QueryClient()

export function getTanstackQueryContext() {
    return {
        queryClient,
    }
}

export function TanstackQueryProvider({ children }) {
    return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
}