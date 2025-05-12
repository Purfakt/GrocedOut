import { createContext, useContext, useState } from 'react'
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth'
import { auth } from '@/services/firebase.js'

/*
 * Store
 */
export function createAuthStore() {
    /* eslint-disable react-hooks/rules-of-hooks */
    const [user, setUser] = useState(null)
    const [token, setToken] = useState(null)
    const [isAdmin, setIsAdmin] = useState(false)

    function login() {
        signInWithPopup(auth, new GoogleAuthProvider())
            .then((result) => {
                const credential = GoogleAuthProvider.credentialFromResult(result)
                setToken(credential.accessToken)
                setUser(result.user)
                setIsAdmin(JSON.parse(result.user?.reloadUserInfo?.customAttributes)?.isAdmin || false)
            })
    }

    function logout() {
        auth.signOut()
            .then(() => {
                setToken(null)
                setUser(null)
            })
    }

    return { user, token, isAdmin, login, logout }
}

/*
 * Context
 */
const AuthStoreContext = createContext(null)
export function useAuthStore() {
    return useContext(AuthStoreContext)
}

/*
 * Provider
 */
export function AuthStoreProvider({ children }) {
    const store = createAuthStore()

    return (
        <AuthStoreContext.Provider value={store}>
            {children}
        </AuthStoreContext.Provider>
    )
}