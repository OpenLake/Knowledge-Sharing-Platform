import { createContext, useContext, useEffect, useState } from 'react'
import cookies from 'js-cookie'
import { api } from '../utils/api'
import { signInWithPopup, GoogleAuthProvider, signOut } from 'firebase/auth'
import { firebaseAuth } from '../utils/firebaseInit'
import { useRouter } from 'next/router'
import { toast } from 'react-hot-toast'

const AuthContext = createContext({
    isAuthenticated: false,
    user: null,
    photoURL: '',
    displayName: '',
    login: () => {},
    logout: () => {},
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
        signOut(firebaseAuth)
            .then(() => {
                cookies.remove('accessToken')
                setUser(null)
                setPhotoURL('')
                setDisplayName('')
                delete api.defaults.headers.Authorization
            })
            .catch((err: any) => {
                toast.error(err.message)
            })
    }

    const login = () => {
        const provider = new GoogleAuthProvider()

        signInWithPopup(firebaseAuth, provider)
            .then(async (res) => {
                const { user }: any = res
                const { accessToken } = user

                if (accessToken) {
                    cookies.set('accessToken', accessToken, { expires: 60 })

                    api.defaults.headers.Authorization = `Bearer ${accessToken}`
                    const { data } = await api.get('/api/auth/')
                    const { result: userData } = data
                    const { picture, name } = userData

                    if (userData) {
                        setUser(userData)
                        setPhotoURL(picture)
                        setDisplayName(name)
                    }
                    toast.success('Login Successful')
                }
            })
            .catch((err: any) => {
                toast.error(err.message)
            })
    }

    async function loadUserFromCookie() {
        const accessToken = cookies.get('accessToken')
        if (accessToken) {
            api.defaults.headers.Authorization = `Bearer ${accessToken}`
            try {
                const { data } = await api.get('/api/auth/')
                const { result: user } = data
                const { picture, name } = user
                if (user) {
                    setUser(user)
                    setPhotoURL(picture)
                    setDisplayName(name)
                }
            } catch (err: any) {
                if (err.response.data.err.code === 'auth/id-token-expired') {
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
        if (loading) loadUserFromCookie()
    }),
        [loading]

    return (
        <AuthContext.Provider
            value={{
                isAuthenticated: !!user,
                user,
                photoURL,
                displayName,
                login,
                logout,
                loading,
            }}
        >
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext)

export const ProtectRoute = ({ children }: any) => {
    // const { isAuthenticated, loading }: any = useAuth()

    // if (loading || (!isAuthenticated && window.location.pathname !== "/login"))
    //     return <h1>Loading...</h1>
    return children
}
