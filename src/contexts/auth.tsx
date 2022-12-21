import { Context, FC, createContext, useContext, useEffect, useState } from "react";
import cookies from 'js-cookie'
import { api } from "../utils/api";
import { getAuth, signInWithPopup, GoogleAuthProvider } from 'firebase/auth'
import { deleteApp, initializeApp } from "firebase/app"
import { FIREBASE_CONFIG } from "../config";
import { firebaseAuth } from "../utils/firebaseInit";
import { useRouter } from 'next/router'

const AuthContext = createContext({
    isAuthenticated: false,
    user: null,
    login: () => { },
    loading: true,
})


export const AuthProvider = ({ children }: any) => {
    //? router
    const router = useRouter()

    //? states
    const [user, setUser] = useState(null)
    const [photoURL, setPhotoURL] = useState('')
    const [displayName, setDisplayName] = useState('')
    const [loading, setLoading] = useState(true)

    //? functions
    const logout = () => {
        cookies.remove('accessToken')
        setUser(null)
        delete api.defaults.headers.Authorization
    }

    const login = () => {
        const provider = new GoogleAuthProvider

        signInWithPopup(firebaseAuth, provider)
            .then(async (res) => {
                const { user }: any = res
                const { accessToken, photoURL, displayName } = user
                console.log(user)
                if (accessToken) {
                    cookies.set('accessToken', accessToken, { expires: 60 })
                    api.defaults.headers.Authorization = `Bearer ${accessToken}`
                    const { data } = await api.get('/api/auth/')
                    const { result: user } = data
                    console.log(user)
                    // setPhotoURL(photoURL)
                    // setDisplayName(displayName)
                    setUser(user)
                }
            })
            .catch((err: any) => {
                console.log(err)
            })
    }

    async function loadUserFromCookie() {
        const accessToken = cookies.get('accessToken')
        if (accessToken) {
            api.defaults.headers.Authorization = `Bearer ${accessToken}`
            try {
                const { data } = await api.get('/api/auth/')
                const { result: user } = data
                if (user) setUser(user)
            }
            catch (err: any) {
                console.log(err)
                if (err.response.data.err.code === "auth/id-token-expired") {
                    console.log('cookie removed')
                    cookies.remove('accessToken')
                    setUser(null)
                    delete api.defaults.headers.Authorization
                }
            }
        }
        setLoading(false)
    }
    //? effects
    useEffect(() => {
        if (loading)
            loadUserFromCookie()
    }), [loading]

    return (
        <AuthContext.Provider
            value={{
                isAuthenticated: !!user,
                user,
                login,
                loading
            }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext)

export const ProtectRoute = ({ children }: any) => {
    // const { isAuthenticated, loading }: any = useAuth()

    // if (loading || (!isAuthenticated && window.location.pathname !== "/login"))
    //     return <h1>Loading...</h1>
    return children;
}