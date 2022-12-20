import { Context, createContext, useContext, useEffect, useState } from "react";
import cookies from 'js-cookie'
import { api } from "../utils/api";
import { getAuth, signInWithPopup, GoogleAuthProvider } from 'firebase/auth'
import { deleteApp, initializeApp } from "firebase/app"
import { FIREBASE_CONFIG } from "../config";

const AuthContext = createContext({
    isAuthenticated: false,
    user: null,
    login: () => { },
    loading: true,
})


export const AuthProvider = ({ children }: any) => {
    //? states
    const [user, setUser] = useState(null)
    const [photoURL, setPhotoURL] = useState('')
    const [displayName, setDisplayName] = useState('')
    const [loading, setLoading] = useState(true)

    //? functions
    const logout = () => {
        cookies.remove('token')
        setUser(null)
        delete api.defaults.headers.Authorization
        window.location.pathname = '/login'
    }

    const login = () => {
        // const firebaseApp = initializeApp(FIREBASE_CONFIG)
        // const firebaseAuth = getAuth(firebaseApp)
        // const provider = new GoogleAuthProvider

        // signInWithPopup(firebaseAuth, provider)
        //     .then(async (res) => {
        //         const { user }: any = res
        //         const { accessToken, photoURL, displayName } = user
        //         console.log(user)

        //         await deleteApp(firebaseApp)
        //         if (accessToken) {
        //             console.log("Got accessToken")
        //             cookies.set('accessToken', accessToken, { expires: 60 })
        //             api.defaults.headers.Authorization = `Bearer ${accessToken}`
        //             const { data } = await api.get('/api/auth/')
        //             const { result: user } = data
        //             console.log(user)
        //             // setPhotoURL(photoURL)
        //             // setDisplayName(displayName)
        //             setUser(user)
        //         }
        //     })
        //     .catch((err: any) => {
        //         console.log(err)
        //     })
    }

    //? effects
    useEffect(() => {
        async function loadUserFromCookie() {
            const accessToken = cookies.get('accessToken')
            if (accessToken) {
                api.defaults.headers.Authorization = `Bearer ${accessToken}`
                const { data } = await api.get('/api/auth/')
                const { result: user } = data
                console.log(user)
                if (user) setUser(user)
            }
            setLoading(false)
        }
        loadUserFromCookie()
    }), []

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